import {
  Inject,
  Controller,
  Get,
  Post,
  Query,
  SetHeader,
  Body,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  RegisterByPhoneDot,
  SMSDto,
  SvgCaptchaDto,
} from '../../types/dto/security/user.dto';
import { User } from '../../entity/security/user';
import { UserService } from '../../service/security/user';
import * as svgCaptcha from 'svg-captcha';
/*
|--------------------------------------------------------------------------
| 提供如下方法
|--------------------------------------------------------------------------
*/

@Controller('/api/security')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  /**
   * 获取手机验证码
   */
  @Get('/sms')
  async getSMSCode(@Query() params: SMSDto) {
    const data = await this.userService.getSMSCode(params);
    return { success: true, message: 'OK', data: data };
  }
  /**
   * 获取图形验证码
   */
  @Get('/captcha')
  @SetHeader('content-type', 'image/svg+xml')
  async getSVGCaptcha(@Query() params: SvgCaptchaDto) {
    const captcha = svgCaptcha.create({
      width: params.width,
      height: params.height,
    });
    return captcha.data;
  }
  /**
   * 手机号用户注册
   */
  @Post('/register')
  async registerByPhone(@Body() params: RegisterByPhoneDot) {
    const data = await this.userService.registerByPhone(params);
    return { success: true, message: 'OK', data: data };
  }
}
