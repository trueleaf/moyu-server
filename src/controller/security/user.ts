import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { SMSDTO } from '../../types/dto/security/user.dto';
import { User } from '../../entity/security/user';
import { UserService } from '../../service/security/user';

/*
|--------------------------------------------------------------------------
| 提供如下方法
|--------------------------------------------------------------------------
|
| 
|
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
  async getSMSCode(@Query() params: SMSDTO) {
    const data = await this.userService.getSMSCode(params);;
    return { success: true, message: 'OK', data: data };
  }
}
