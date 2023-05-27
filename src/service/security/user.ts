import { Config, Provide } from '@midwayjs/core';
import { RegisterByPhoneDot, SMSDto } from '../../types/dto/security/user.dto';
import { getRandomNumber } from '../../utils/utils';
import { GlobalConfig } from '../../types/types';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { Sms } from '../../entity/security/sms';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Provide()
export class UserService {
  @Config('smsConfig')
  smsConfig: GlobalConfig['smsConfig'];

  @InjectEntityModel(Sms)
  smsModel: ReturnModelType<typeof Sms>;

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
    });
    await client.sendSmsWithOptions(
      sendSmsRequest,
      new $Util.RuntimeOptions({})
    );
    console.log(code, OpenApi);
  }

  /**
   * 使用手机号码注册账号
   */
  async registerByPhone(params: RegisterByPhoneDot) {
    const { phone } = params;
    // const { loginName, realName, phone, password, smsCode } = params;
    const smsInfo = await this.smsModel.findOne({ phone });
    console.log(smsInfo);
    if (!smsInfo) {
      return {
        code: 200,
      };
    }
    // const isExpire = (Date.now() - new Date(smsInfo ? smsInfo.updatedAt : 0).getTime()) > smsConfig.maxAge;
    // const hasSmsPhone = !!smsInfo;
  }
}
