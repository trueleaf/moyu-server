import { Config, Inject, Provide } from '@midwayjs/core';
import {
  AddUserDto,
  ChangePasswordByUserDto,
  ChangeUserInfoDto,
  ChangeUserStateDto,
  DisableUserDto,
  GetUserInfoByIdDto,
  GetUserListByNameDto,
  GetUserListDto,
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterByPhoneDto,
  ResetPasswordDto,
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
import { TableResponseWrapper } from '../../types/response/common/common';
import { escapeRegExp } from 'lodash';

@Provide()
export class UserService {
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };

  @Config('smsConfig')
    smsConfig: GlobalConfig['smsConfig'];
  @Config('jwtConfig')
    jwtConfig: GlobalConfig['jwtConfig'];
  @Config('security')
    securityConfig: GlobalConfig['security']
  @Config('pagination')
    paginationConfig: GlobalConfig['pagination']

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
      return throwError(2008, '用户被禁止登录，管理员可以启用当前用户');
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

  /**
   * 批量禁用用户
   */
  async disableUser(params: DisableUserDto) {
    const { ids } = params;
    await this.userModel.updateMany({ _id: { $in: ids }}, { $set: { enable: false }});
  }

  /**
   * 管理员重置密码
   */
  async resetPasswordByAdmin(params: ResetPasswordDto) {
    const { userId, password = this.securityConfig.defaultUserPassword } = params;
    const hash = createHash('md5');
    const salt = getRandomNumber(10000, 9999999).toString();
    hash.update((password + salt).slice(2));
    const hashPassword = hash.digest('hex');
    await this.userModel.updateOne({ _id: userId }, { $set: { salt, password: hashPassword } });
    return;
  }
  /**
   * 手动添加用户
   */
  async addUser(params: AddUserDto) {
    const { loginName, realName, phone, password = '111111', roleIds, roleNames } = params;
    const hasUser = await this.userModel.findOne({ loginName });
    const hasPhone = await this.userModel.findOne({ phone });
    if (loginName.match(/guest/)) { //用于统计访客，内部部署可忽略
      return throwError(2010, '用户名不能以包含guest')
    }
    if (hasUser) {
      return throwError(1003, '账号已存在')
    }
    if (hasPhone) {
      return throwError(1003, '该手机号已经绑定')
    }
    const doc: Pick<User, 'loginName' | 'realName' | 'phone' | 'password' | 'salt' | 'roleIds' | 'roleNames'> = {
      loginName: '',
      realName: '',
      phone: '',
      password: '',
      salt: '',
      roleIds: [],
      roleNames: [],
    };
    const hash = createHash('md5');
    const salt = getRandomNumber(10000, 9999999).toString();
    hash.update((password + salt).slice(2));
    const hashPassword = hash.digest('hex');
    doc.loginName = loginName;
    doc.realName = realName;
    doc.phone = phone;
    doc.password = hashPassword;
    doc.salt = salt;
    doc.roleIds = roleIds || [];
    doc.roleNames = roleNames || [];
    await this.userModel.create(doc);
    return;
  }
  /**
   * 获取用户列表
   */
  async getUserList(params: GetUserListDto) {
    const { pageNum, pageSize, startTime, endTime, loginName, realName, phone } = params;
    const query = {} as {
      loginName?: RegExp;
      realName?: RegExp;
      phone?: RegExp;
      createdAt?: {
        $gt?: number,
        $lt?: number,
      };
    };
    let skipNum = 0;
    let limit = this.paginationConfig.max;
    if (pageSize != null && pageNum != null) {
      skipNum = (pageNum - 1) * pageSize;
      limit = pageSize;
    }
    if (startTime != null && endTime != null) {
      query.createdAt = { $gt: startTime, $lt: endTime };
    }
    if (loginName) {
      query.loginName = new RegExp(escapeRegExp(loginName));
    }
    if (realName) {
      query.realName = new RegExp(escapeRegExp(realName));
    }
    if (phone) {
      query.phone = new RegExp(escapeRegExp(phone));
    }
    const rows = await this.userModel.find(query,
      {
        password: 0,
        salt: 0,
        clientRoutes: 0,
        clinetMenus: 0,
        serverRoutes: 0,
        starProjects: 0
      }
    ).sort({
      loginTimes: -1
    }).skip(skipNum).limit(limit);
    const total = await this.userModel.find(query).countDocuments();
    const result: TableResponseWrapper = {
      rows: [],
      total: 0
    };
    result.rows = rows;
    result.total = total;
    return result;
  }
  /**
   * 禁用启用用户
   */
  async changeUserState(params: ChangeUserStateDto) {
    const { _id, enable } = params;
    //admin用户无法被禁用
    await this.userModel.findOneAndUpdate({ _id, loginName: { $ne: 'admin' } }, { $set: { enable }});
    return;
  }
  /**
   * 根据id获取用户信息
   */
  async getUserInfoById(params: GetUserInfoByIdDto) {
    const { _id } = params;
    const result = await this.userModel.findById({ _id }, {
      accessProjects: 0,
      enable: 0,
      password: 0,
      salt: 0,
      clientRoutes: 0,
      clinetMenus: 0,
      serverRoutes: 0,
      starProjects: 0,
    });
    return result;
  }
  /**
   * 获取自身登录用户信息
   */
  async getLoggedInUserInfo() {
    const { id } = this.ctx.tokenInfo
    const result = await this.userModel.findById(
      { _id: id },
      {
        enable: 0,
        roleIds: 0,
        roleNames: 0,
        loginTimes: 0,
        password: 0,
        salt: 0,
        clientRoutes: 0,
        clinetMenus: 0,
        serverRoutes: 0,
        starProjects: 0,
      }
    );
    return result;
  }
  /**
   * 获取自身登录用户信息
   */
  async getUserListByName(params: GetUserListByNameDto) {
    const { name } = params;
    if (!name) {
      return [];
    }
    const escapeName = new RegExp(escapeRegExp(name));
    const userList = await this.userModel.find({ $or: [
      {
        realName: { $regex: escapeName },
      },
      {
        loginName: { $regex: escapeName }
      }
    ] }, { realName: 1, loginName: 1 }).lean();
    const result = userList.map(val => {
      return {
        realName: val.realName,
        loginName: val.loginName,
        userId: val._id,
      };
    });
    return result;
  }
  /**
   * 改变用户权限，手机号，登录名称，真实姓名
   */
  async changeUserInfo(params: ChangeUserInfoDto) {
    const { _id, roleIds, roleNames, loginName, phone, realName } = params;
    const updateDoc: Record<string, any> = {};
    if (roleIds) {
      updateDoc.roleIds = roleIds;
    }
    if (roleNames) {
      updateDoc.roleNames = roleNames;
    }
    if (loginName) {
      updateDoc.loginName = loginName;
    }
    if (phone) {
      updateDoc.phone = phone;
    }
    if (realName) {
      updateDoc.realName = realName;
    }
    await this.userModel.findByIdAndUpdate({ _id }, updateDoc);
    return;
  }
}
