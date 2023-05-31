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

  async onReady() {
    this.app.useMiddleware([PermissionMiddleware, ResponseWrapperMiddleware]);
    this.app.useFilter([ValidateErrorFilter, AllServerErrorFilter]);
  }
}
