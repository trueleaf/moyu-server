import { Inject, Controller, All } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/security/user';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/security/user';
import { ReturnModelType } from '@typegoose/typegoose';
import { sleep } from '../utils/utils';
import path from 'node:path';
import fs from 'node:fs'

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  @All('/test/response')
  async responseTest() {
    console.log("请求头", this.ctx.headers);
    console.log("query参数", this.ctx.querystring);
    console.log("path参数", this.ctx.path);
    console.log("body参数", this.ctx.request.body);
    console.log("multiPart-body参数", this.ctx.fields, this.ctx.files);
    console.log('原始body', this.ctx.request.body);
    
    // const data = await this.userModel.find();
    await sleep(1000)
    const imagePath = path.join(__dirname, `../public/a.html`);
    const imageBuffer = fs.readFileSync(imagePath);
    // this.ctx.set('Content-Type', 'video/mp4; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/svg+xml; charset=utf-8');
    // this.ctx.set('Content-Type', 'text/css; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/svg+xml; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/jpeg; charset=utf-8');
    this.ctx.set('Content-Type', 'text/html; charset=utf-8');
    // this.ctx.cookies.set('test', 'test');
    // this.ctx.set('Content-Type', 'text/html; charset=utf-8');
    return imageBuffer;
    // return {
    //   method: this.ctx.method,
    //   headers: this.ctx.headers,
    //   query: this.ctx.query,
    //   path: this.ctx.path,
    //   body: this.ctx.request.body
    // };
  }
  @All('/test/request_method')
  async methodTest() {
    console.log('method test')
    return {
      method: this.ctx.method,
    };
  }
}
