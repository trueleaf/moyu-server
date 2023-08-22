import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typegoose from '@midwayjs/typegoose';
import * as upload from '@midwayjs/upload';
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
import { initClientMenus, initClientRoutes, initRoles, initServerRoutes, initUser } from './entity/init_entity';
import { ServerRoutes } from './entity/security/server_routes';
import { ClientRoutes } from './entity/security/client_routes';
import { Role } from './entity/security/role';
import { ClientMenu } from './entity/security/client_menu';
import cors from '@koa/cors'
@Configuration({
  imports: [
    koa,
    upload,
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
  @InjectEntityModel(ClientRoutes)
    clientRoutesModel: ReturnModelType<typeof ClientRoutes>;
  @InjectEntityModel(Role)
    roleModel: ReturnModelType<typeof Role>;
  @InjectEntityModel(ClientMenu)
    clientMenuModel: ReturnModelType<typeof ClientMenu>;
  async onReady() {
    this.app.use(cors({
      origin(app) {
        const origin = app.request.headers.origin;
        console.log(origin)
        return origin
      },
      credentials: true,
      allowMethods: 'GET,PUT,POST,DELETE',
      exposeHeaders: 'content-disposition',
      allowHeaders: ['Authorization', 'x-csrf-token', 'content-type'],
      maxAge: 60 * 60 * 24
    }))
    this.app.useMiddleware([PermissionMiddleware, ResponseWrapperMiddleware]);
    this.app.useFilter([ValidateErrorFilter, AllServerErrorFilter]);
    await initUser(this.userModel);
    await initServerRoutes(this.serverRoutesModel)
    await initClientRoutes(this.clientRoutesModel)
    await initRoles(this.roleModel)
    await initClientMenus(this.clientMenuModel)
  }
}
