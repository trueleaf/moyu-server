import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typegoose from '@midwayjs/typegoose';
import { join } from 'path';
import { ResponseWrapperMiddleware } from './middleware/response.middleware';
import {
  AllServerErrorFilter,
  ValidateErrorFilter,
} from './filter/error.filter';
import { PermissionMiddleware } from './middleware/permission.middleware';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from './entity/security/user';
import { ReturnModelType } from '@typegoose/typegoose';
import { initServerRoutes, initUser } from './entity/init_entity';
import { ServerRoutes } from './entity/security/server_routes';
@Configuration({
  imports: [
    koa,
    validate,
    typegoose,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config/')],
})
export class ContainerLifeCycle {
  @App()
    app: koa.Application;
  @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
  @InjectEntityModel(ServerRoutes)
    serverRoutesModel: ReturnModelType<typeof ServerRoutes>;
  async onReady() {
    this.app.useMiddleware([PermissionMiddleware, ResponseWrapperMiddleware]);
    this.app.useFilter([ValidateErrorFilter, AllServerErrorFilter]);
    await initUser(this.userModel);
    await initServerRoutes(this.serverRoutesModel)
  }
}
