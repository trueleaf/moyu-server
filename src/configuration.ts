import { Configuration, App, Inject, MidwayDecoratorService, JoinPoint, REQUEST_OBJ_CTX_KEY } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typegoose from '@midwayjs/typegoose';
import * as upload from '@midwayjs/upload';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import {
  AllServerErrorFilter,
  ValidateErrorFilter,
} from './filter/error.filter.js';
import { ResponseWrapperMiddleware } from './middleware/response.middleware.js';
import { PermissionMiddleware } from './middleware/permission.middleware.js';
import { User } from './entity/security/user.js';
import { initClientMenus, initClientRoutes, initRoles, initServerRoutes, initUser } from './entity/init_entity.js';
import { ServerRoutes } from './entity/security/server_routes.js';
import { ClientRoutes } from './entity/security/client_routes.js';
import { Attachment } from './entity/attachment/attachment.js';
import { Role } from './entity/security/role.js';
import { ClientMenu } from './entity/security/client_menu.js';
import * as crossDomain from '@midwayjs/cross-domain';
import DefaultConfig from './config/config.default.js';
import UnittestConfig from './config/config.unittest.js';
import { REQ_LIMIT_KEY } from './decorator/req_limit.decorator.js';
import { ReqLimit } from './types/types.js';
@Configuration({
  imports: [
    koa,
    crossDomain,
    upload,
    validate,
    typegoose,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [{
    default: DefaultConfig,
    unittest: UnittestConfig,
  },],
})
export class ContainerLifeCycle {
  @App()
    app: koa.Application;
  @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
  @InjectEntityModel(ServerRoutes)
    serverRoutesModel: ReturnModelType<typeof ServerRoutes>;
  @InjectEntityModel(ClientRoutes)
    clientRoutesModel: ReturnModelType<typeof ClientRoutes>;
  @InjectEntityModel(Role)
    roleModel: ReturnModelType<typeof Role>;
  @InjectEntityModel(ClientMenu)
    clientMenuModel: ReturnModelType<typeof ClientMenu>;
  @InjectEntityModel(Attachment)
    attachmentModel: ReturnModelType<typeof Attachment>;
  @Inject()
    decoratorService: MidwayDecoratorService;
  private reqLimitStore = new Map<string, number[]>()

  async registerReqLimitDecorator() {
    this.decoratorService.registerMethodHandler(REQ_LIMIT_KEY, (options) => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const { ttl, max } = options.metadata as ReqLimit;
          const instance = joinPoint.target;
          const ctx = instance[REQUEST_OBJ_CTX_KEY];
          const userId = ctx.tokenInfo.id; // 使用用户id作为限流标识
          const now = Date.now();
          const windowStart = now - ttl;
          let timestamps = this.reqLimitStore.get(userId) || [];
          timestamps = timestamps.filter((ts) => ts >= windowStart);
          if (timestamps.length >= max) {
            ctx.status = 429;
            ctx.body = '请求频率过高，请稍后再试';
            return;
          }
          timestamps.push(now);
          this.reqLimitStore.set(userId, timestamps);
          const result = await joinPoint.proceed(...joinPoint.args);
          return result;
        },
      };
    });
  }
  async onReady() {
    this.app.useMiddleware([ResponseWrapperMiddleware, PermissionMiddleware]);
    this.app.useFilter([ValidateErrorFilter, AllServerErrorFilter]);
    await initUser(this.userModel);
    await initServerRoutes(this.serverRoutesModel)
    await initClientRoutes(this.clientRoutesModel)
    await initRoles(this.roleModel)
    await initClientMenus(this.clientMenuModel)
    await this.registerReqLimitDecorator();
    // await initAttachment(this.attachmentModel)
  }
}
