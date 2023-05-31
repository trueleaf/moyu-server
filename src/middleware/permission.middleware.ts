import { Middleware, IMiddleware, Config, ALL } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { GlobalConfig } from '../types/types';
import * as jwt from 'jsonwebtoken';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../entity/security/user';
import { ResponseWrapper } from '../types/response/common/common';
import { throwError } from '../utils/utils';

@Middleware()
export class PermissionMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config(ALL)
  config: GlobalConfig;
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // const urlWithoutQueryParams = ctx.request.url.replace(/\?.*$/g, '');
      // let serverRoutes = []; //用户所拥有得权限列表
      try {
        if (!ctx.headers.authorization) {
          return throwError(5000, '缺少Authorization认证头');
        }
        const tokenInfo = jwt.verify(
          ctx.headers.authorization,
          this.config.jwtConfig.secretOrPrivateKey
        );
        ctx.userInfo = tokenInfo;
        // const loginName = tokenInfo.loginName;
        // const userInfo = await this.userModel.findOne({ loginName });
        // const allServerRoutes = await ctx.model.Security.ServerRoutes.find(
        //   {},
        //   { path: 1, method: 1 }
        // );
        // const roleIds = userInfo.roleIds;

        // for (let i = 0; i < roleIds.length; i++) {
        //   const roleInfo = await ctx.model.Security.Role.findById({
        //     _id: roleIds[i],
        //   });
        //   if (roleInfo) {
        //     const serverRoutesPathes = roleInfo.serverRoutes.map(val => {
        //       return allServerRoutes.find(val2 => {
        //         return val2._id.toString() === val;
        //       });
        //     });
        //     serverRoutes = serverRoutes.concat(serverRoutesPathes);
        //   }
        // }
        // serverRoutes = ctx.helper.unique(serverRoutes, 'id');
        // const reqMethod = ctx.request.method.toLowerCase();
        // const hasPermission = serverRoutes.find(val => {
        //   return (
        //     val.method.toLowerCase() === reqMethod &&
        //     val.path === urlWithoutQueryParams
        //   );
        // });
        // if (!hasPermission) {
        //   ctx.helper.throwCustomError('暂无权限', 4002);
        // }
        await next();
      } catch (error: unknown) {
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
