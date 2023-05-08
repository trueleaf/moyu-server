import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { User } from '../entity/security/user';
import { ReturnModelType } from '@typegoose/typegoose';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  @Get('/get_user')
  async getUser() {
    const data = await this.userModel.find();
    return { success: true, message: 'OK', data: data };
  }
}
