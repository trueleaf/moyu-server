import { Config, Inject, Provide } from '@midwayjs/core';
import {
  LoginByPasswordDto,
  RegisterByPhoneDto,
  SMSDto,
} from '../../types/dto/security/user.dto';
import { getRandomNumber, throwError } from '../../utils/utils';
import { GlobalConfig } from '../../types/types';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { Sms } from '../../entity/security/sms';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../../entity/security/user';
import { createHash } from 'crypto';
import { Context } from '@midwayjs/koa';
import { LoginRecord } from '../../entity/security/login_record';

@Provide()
export class UserService {
  @Inject()
  ctx: Context;

  @Config('smsConfig')
  smsConfig: GlobalConfig['smsConfig'];

  @InjectEntityModel(Sms)
  smsModel: ReturnModelType<typeof Sms>;
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;
  @InjectEntityModel(LoginRecord)
  loginRecordModel: ReturnModelType<typeof LoginRecord>;

  /**
   * 根据手机号码获取短信验证码
   */
  async getSMSCode(params: SMSDto) {
    const { phone } = params;
    const code = getRandomNumber(100000, 999999);
    const config = new $OpenApi.Config({
      accessKeyId: this.smsConfig.accessKeyId,
      accessKeySecret: this.smsConfig.accessKeySecret,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    const client = new Dysmsapi20170525(config);
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: this.smsConfig.SignName,
      templateCode: this.smsConfig.templateCode,
      templateParam: `{code: ${code}}`,
    });
    await client.sendSmsWithOptions(
      sendSmsRequest,
      new $Util.RuntimeOptions({})
    );
    await this.smsModel.updateOne(
      { phone },
      { $set: { phone, smsCode: code } },
      { upsert: true }
    );
  }

  /**
   * 使用手机号码注册账号
   */
  async registerByPhone(params: RegisterByPhoneDto) {
    const { loginName, realName, phone, password, smsCode } = params;
    const smsInfo = await this.smsModel.findOne({ phone });
    if (!smsInfo) {
      return throwError(2003, '验证码不正确');
    }
    const updateTimestamps = new Date(smsInfo.updatedAt).getTime();
    const isExpire = Date.now() - updateTimestamps > this.smsConfig.maxAge;
    if (isExpire) {
      return throwError(2002, '验证码失效');
    }
    if (smsInfo.smsCode !== smsCode) {
      return throwError(2003, '验证码不正确');
    }
    //注册手机号与接受验证码手机号不一致
    if (phone !== smsInfo.phone) {
      return throwError(2001, '注册手机号与接受验证码手机号不一致');
    }
    const hasUser = await this.userModel.findOne({ loginName });
    const hasPhone = await this.userModel.findOne({ phone });
    //用户不存在提示验证码错误
    if (hasUser) {
      return throwError(1003, '验证码不正确');
    }
    if (hasPhone) {
      return throwError(1003, '验证码不正确');
    }

    const userInfo: Partial<User> = {};
    const hash = createHash('md5');
    const salt = getRandomNumber(10000, 9999999).toString();
    hash.update((password + salt).slice(2));
    const hashPassword = hash.digest('hex');
    userInfo.loginName = loginName;
    userInfo.realName = realName;
    userInfo.phone = phone;
    userInfo.password = hashPassword;
    userInfo.salt = salt;
    //数据库初始化时候默认生成，创建用户默认权限，可能改变
    userInfo.roleIds = ['5ede0ba06f76185204584700', '5ee980553c63cd01a49952e4'];
    userInfo.roleNames = ['api文档-完全控制', '公共基础权限'];
    await this.userModel.create(userInfo);
  }
  /**
   * 记录登录次数
   */
  async addLoginTimes() {
    const newLoginRecord = await this.loginRecordModel.updateOne(
      { ip: this.ctx.ip },
      {
        $set: { ip: this.ctx.ip, userAgent: this.ctx.get('user-agent') },
        $inc: { loginTimes: 1 },
      },
      { upsert: true }
    );
    return newLoginRecord.modifiedCount;
  }
  /**
   * 使用密码登录
   */
  async loginByPassword(params: LoginByPasswordDto) {
    // const { loginName, password, captcha = '' } = params;
    // const userInfo = await this.userModel.findOne({ loginName });
    // const result = {};
    const { captcha } = params;
    console.log(this.ctx.session.captcha, 99);
    //验证码是否正确
    if (
      this.ctx.session.captcha &&
      this.ctx.session.captcha.toLowerCase() !== captcha.toLowerCase()
    ) {
      await this.addLoginTimes();
      this.ctx.helper.throwCustomError('验证码错误', 2003);
    }
    // //用户不存在
    // if (!userInfo) {
    //   await this.addLoginTimes();
    //   if (loginRecord && loginRecord.loginTimes > 3) {
    //     this.ctx.helper.throwCustomError('需要填写验证码', 2006);
    //   } else {
    //     this.ctx.helper.throwCustomError('用户名或密码错误', 2004);
    //   }
    // }
    // if (!userInfo.enable) {
    //   this.ctx.helper.throwCustomError('用户被锁定', 2008);
    // }
    // //判断密码
    // const hash = crypto.createHash('md5');
    // hash.update((password + userInfo.salt).slice(2));
    // const hashPassword = hash.digest('hex');
    // if (userInfo.password !== hashPassword) {
    //   await this.addLoginTimes();
    //   if (loginRecord && loginRecord.loginTimes > 3) {
    //     this.ctx.helper.throwCustomError('需要填写验证码', 2006);
    //   } else {
    //     this.ctx.helper.throwCustomError('用户名或密码错误', 2004);
    //   }
    // }
    // //登录成功
    // await this.ctx.model.Security.LoginRecord.updateOne(
    //   { ip: this.ctx.ip },
    //   {
    //     $set: { loginTimes: 0 },
    //   }
    // );
    // await this.ctx.model.Security.User.findByIdAndUpdate(
    //   { _id: userInfo._id },
    //   {
    //     $inc: { loginTimes: 1 },
    //     $set: { lastLogin: new Date() },
    //   }
    // );

    // Object.assign(result, {
    //   id: userInfo.id,
    //   roleIds: userInfo.roleIds,
    //   loginName: userInfo.loginName,
    //   realName: userInfo.realName,
    //   phone: userInfo.phone,
    // });
    // // this.ctx.userInfo = {
    // //     ...result,
    // // };
    // const { jwtConfig } = this.app.config;
    // const token = jwt.sign(result, jwtConfig.secretOrPrivateKey, {
    //   expiresIn: jwtConfig.expiresIn,
    // });
    // result.token = token;
    // return result;
  }
}
