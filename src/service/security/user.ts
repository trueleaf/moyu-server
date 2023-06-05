import { Config, Inject, Provide } from '@midwayjs/core';
import {
  ChangePasswordByUserDto,
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterByPhoneDto,
  SMSDto,
} from '../../types/dto/security/user.dto';
import { getRandomNumber, throwError } from '../../utils/utils';
import { GlobalConfig, LoginTokenInfo } from '../../types/types';
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
import * as jwt from 'jsonwebtoken';
import { validatePassword } from '../../rules/rules';

@Provide()
export class UserService {
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };

  @Config('smsConfig')
    smsConfig: GlobalConfig['smsConfig'];
  @Config('jwtConfig')
    jwtConfig: GlobalConfig['jwtConfig'];

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
    const { loginName, password } = params;
    const userInfo = await this.userModel.findOne({ loginName });
    if (!userInfo) {
      return throwError(2004, '用户不存在')
    }
    if (!userInfo.enable) {
      return throwError(2008, '用户被禁止登录');
    }
    //判断密码
    const hash = createHash('md5');
    hash.update((password + userInfo.salt).slice(2));
    const hashPassword = hash.digest('hex');
    if (userInfo.password !== hashPassword) {
      await this.addLoginTimes();
      return throwError(2004, '用户名或密码错误');
    }
    //登录成功
    await this.loginRecordModel.updateOne(
      { ip: this.ctx.ip },
      {
        $set: { loginTimes: 0 },
      }
    );
    await this.userModel.findByIdAndUpdate(
      { _id: userInfo._id },
      {
        $inc: { loginTimes: 1 },
        $set: { lastLogin: new Date() },
      }
    );

    const loginInfo: LoginTokenInfo = {
      id: userInfo.id,
      roleIds: userInfo.roleIds,
      loginName: userInfo.loginName,
      realName: userInfo.realName,
      phone: userInfo.phone,
      token: '',
    };
    const token = jwt.sign(loginInfo, this.jwtConfig.secretOrPrivateKey, {
      expiresIn: this.jwtConfig.expiresIn,
    });
    loginInfo.token = token;
    return loginInfo;
  }
  /**
   * 使用手机号码登录
   */
  async loginByPhone(params: LoginByPhoneDto) {
    const { phone, smsCode } = params;
    const smsInfo = await this.smsModel.findOne({ phone });
    const updateTimestamps = new Date(smsInfo.updatedAt).getTime();
    const isExpire = Date.now() - updateTimestamps > this.smsConfig.maxAge;
    if (!smsInfo) {
      return throwError(2005, '请输入正确的手机号码');
    }
    if (isExpire) {
      return throwError(2003, '验证码已失效');
    }
    if (smsInfo.smsCode !== smsCode) {
      return throwError(2003, '短信验证码错误');
    }
    const userInfo = await this.userModel.findOne({ phone });
    if (!userInfo) {
      return throwError(2004, '当前用户不存在');
    }
    const loginInfo: LoginTokenInfo = {
      id: userInfo.id,
      roleIds: userInfo.roleIds,
      loginName: userInfo.loginName,
      realName: userInfo.realName,
      phone: userInfo.phone,
      token: '',
    };
    const token = jwt.sign(loginInfo, this.jwtConfig.secretOrPrivateKey, {
      expiresIn: this.jwtConfig.expiresIn,
    });
    loginInfo.token = token;
    return loginInfo;
  }
  /**
   * 修改密码(用户主动)
   */
  async changePasswordByUser(params: ChangePasswordByUserDto) {
    const { oldPassword, newPassword } = params;
    const { id } = this.ctx.tokenInfo;
    if (!validatePassword(newPassword)) {
      return throwError(1007, '密码至少8位，并且必须包含数字和字母');
    }
    const userInfo = await this.userModel.findOne({ _id: id });
    const hash = createHash('md5');
    hash.update((oldPassword + userInfo.salt).slice(2));
    const hashPassword = hash.digest('hex');
    if (userInfo.password !== hashPassword) {
      return throwError(2009, '原密码错误');
    }

    const newHash = createHash('md5');
    const newHashPassword = newHash.update((newPassword + userInfo.salt).slice(2)).digest('hex');
    await this.userModel.findByIdAndUpdate({ _id: id }, { $set: { password: newHashPassword }});
  }
}
