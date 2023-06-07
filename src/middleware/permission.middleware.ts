import { Middleware, IMiddleware, Config, ALL } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { GlobalConfig, LoginTokenInfo } from '../types/types';
import * as jwt from 'jsonwebtoken';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../entity/security/user';
import { ResponseWrapper } from '../types/response/common/common';
import { throwError } from '../utils/utils';
import { ServerRoutes } from '../entity/security/server_routes';
import { Role } from '../entity/security/role';

@Middleware()
export class PermissionMiddleware implements IMiddleware<Context, NextFunction> {
  @Config(ALL)
    config: GlobalConfig;
  @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
  @InjectEntityModel(Role)
    roleModel: ReturnModelType<typeof Role>;
  @InjectEntityModel(ServerRoutes)
    serverRoutesModel: ReturnModelType<typeof ServerRoutes>;
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      try {
        if (!ctx.headers.authorization) {
          return throwError(5000, '缺少Authorization认证头');
        }
        const tokenInfo = jwt.verify(
          ctx.headers.authorization,
          this.config.jwtConfig.secretOrPrivateKey
        ) as LoginTokenInfo;
        ctx.tokenInfo = tokenInfo;
        const urlWithoutQueryParams = ctx.request.url.replace(/\?.*$/g, '');
        const serverRouteInfoList: Pick<ServerRoutes, 'path' | 'method'>[] = []; //用户所拥有得权限列表
        const loginName = tokenInfo.loginName;
        const userInfo = await this.userModel.findOne({ loginName });
        const { roleIds } = userInfo;
        const allServerRoutes = await this.serverRoutesModel.find(
          {},
          { path: 1, method: 1 }
        );
        for (let i = 0; i < roleIds.length; i++) {
          const roleInfo = await this.roleModel.findById({
            _id: roleIds[i],
          });
          if (roleInfo) {
            roleInfo.serverRoutes.forEach(routeId => {
              const matchedRoute = allServerRoutes.find(routeInfo => {
                return routeInfo.id === routeId;
              });
              if (matchedRoute) {
                serverRouteInfoList.push({
                  path: matchedRoute.path,
                  method: matchedRoute.method,
                });
              }
            });
          }
        }
        if (serverRouteInfoList.every(routeInfo => routeInfo.path !== urlWithoutQueryParams)) {
          return throwError(4004, '路由不正确')
        }
        const reqMethod = ctx.request.method.toLowerCase();
        const hasPermission = serverRouteInfoList.find(routeInfo => {
          const isSameMethod = routeInfo.method.toLowerCase() === reqMethod;
          const isSamePath = routeInfo.path === urlWithoutQueryParams
          return isSameMethod && isSamePath;
        });
        if (!hasPermission) {
          return throwError(4002, '暂无权限')
        }
        await next();
      } catch (error: unknown) {
        ctx.logger.error(error);
        return {
          code: 5000,
          msg: (error as Error).message,
        } as ResponseWrapper;
      }
    };
  }
  ignore(ctx: Context): boolean {
    if (this.config.permission.isFree) {
      return true;
    }
    return !!this.config.permission.whiteList.find(freeUrl =>
      ctx.path.includes(freeUrl)
    );
  }
  static getName(): string {
    return 'permissionMiddleware';
  }
}
