import { Inject, Controller, All, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/security/user.js';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/security/user.js';
import { ReturnModelType } from '@typegoose/typegoose';
// import { sleep } from '../utils/utils.js';
import path, { dirname } from 'node:path';
import fs from 'node:fs'
import { fileURLToPath } from 'node:url';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;


  @All('/test/request_method')
  async methodTest() {
    console.log('method test')
    return {
      method: this.ctx.method,
    };
  }
  @All('/test/query_params/*')
  async queryTest() {
    console.log('query test', this.ctx.query)
    return {
      query: this.ctx.query,
      path: this.ctx.path,
    };
  }
  @All('/test/request_info/**')
  async requestInfoTest() {
    console.log('request_info test')
    return {
      query: this.ctx.query,
      path: this.ctx.path,
      body: this.ctx.request.body,
      files: this.ctx.files,
      fields: this.ctx.fields,
      headers: this.ctx.headers,
    };
  }
  @All('/test/raw_body')
  async rawBodyTest() {
    console.log('rawBody test')
    const rawBody = await new Promise((resolve, reject) => {
      let data = '';
      this.ctx.req.setEncoding('utf8');
      this.ctx.req.on('data', chunk => {
        data += chunk
      });
      this.ctx.req.on('end', () => resolve(data));
    });
    return {
      rawBody,
    };
  }
  @All('/test/binary')
  async binaryTest() {
    console.log('binaryTest')
    const rawBody = await new Promise((resolve, reject) => {
      let data = '';
      this.ctx.req.setEncoding('utf8');
      this.ctx.req.on('data', chunk => {
        data += chunk
      });
      this.ctx.req.on('end', () => resolve(data));
    });
    return {
      path: this.ctx.path,
      rawBody,
      headers: this.ctx.headers,
    };
  }
    @All('/test/response/**')
  async responseTest(@Body() params: { type: string }) {
    console.log("请求头", this.ctx.headers);
    console.log("query参数", this.ctx.querystring);
    console.log("path参数", this.ctx.path);
    console.log("body参数", this.ctx.request.body);
    console.log("multiPart-body参数", this.ctx.fields, this.ctx.files);
    console.log('原始body', this.ctx.request.body);
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // const data = await this.userModel.find();
    if (params.type === 'json') {
      const jsonPath = path.resolve(__dirname, `../../public/response_test/text/res.json`);
      this.ctx.set('Content-Type', 'application/json; charset=utf-8');
      const jsonBuffer = fs.readFileSync(jsonPath);
      return jsonBuffer;
    }
    // this.ctx.set('Content-Type', 'video/mp4; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/svg+xml; charset=utf-8');
    // this.ctx.set('Content-Type', 'text/css; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/svg+xml; charset=utf-8');
    // this.ctx.set('Content-Type', 'image/jpeg; charset=utf-8');
    // this.ctx.cookies.set('test', 'test');
    // this.ctx.set('Content-Type', 'text/html; charset=utf-8');
    // return {
    //   method: this.ctx.method,
    //   headers: this.ctx.headers,
    //   query: this.ctx.query,
    //   path: this.ctx.path,
    //   body: this.ctx.request.body
    // };
  }

}
