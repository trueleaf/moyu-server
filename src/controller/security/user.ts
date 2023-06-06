import {
  Inject,
  Controller,
  Get,
  Post,
  Query,
  SetHeader,
  Body,
  Put,
  Del,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  ChangePasswordByUserDto,
  DisableUserDto,
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterByPhoneDto,
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

@Controller('/api')
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
  @Get('/security/sms')
  async getSMSCode(@Query() params: SMSDto) {
    const data = await this.userService.getSMSCode(params);
    return data;
  }
  /**
   * 获取图形验证码
   */
  @Get('/security/captcha')
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
  @Post('/security/register')
  async registerByPhone(@Body() params: RegisterByPhoneDto) {
    const data = await this.userService.registerByPhone(params);
    return data;
  }
  /**
   * 根据账号密码登录
   */
  @Post('/security/login_password')
  async loginByPassword(@Body() params: LoginByPasswordDto) {
    const data = await this.userService.loginByPassword(params);
    return data;
  }
  /**
   * 根据手机号码登录
   */
  @Post('/security/login_phone')
  async loginByPhone(@Body() params: LoginByPhoneDto) {
    const data = await this.userService.loginByPhone(params);
    return data;
  }
  /**
   * 修改密码(用户主动修改)
   */
  @Put('/security/user_password')
  async changePasswordByUser(@Body() params: ChangePasswordByUserDto) {
    const data = await this.userService.changePasswordByUser(params);
    return data;
  }
  /**
   * 批量禁用用户
   */
  @Del('/project/delete_user') //【兼容】历史数据
  @Del('/security/delete_user')
  async disableUser(@Body() params: DisableUserDto) {
    const data = await this.userService.disableUser(params);
    return data;
  }

}
