import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typegoose from '@midwayjs/typegoose';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ResponseWrapperMiddleware } from './middleware/response.middleware';
import {
  AllServerErrorFilter,
  ValidateErrorFilter,
} from './filter/error.filter';
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
    // add middleware
    this.app.useMiddleware([ResponseWrapperMiddleware]);
    // add filter
    this.app.useFilter([ValidateErrorFilter, AllServerErrorFilter]);
  }
}
