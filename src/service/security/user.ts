import { Config, Provide } from '@midwayjs/core';
import { RegisterByPhoneDot, SMSDto } from '../../types/dto/security/user.dto';
import { getRandomNumber } from '../../utils/utils';
import { GlobalConfig } from '../../types/types';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

@Provide()
export class UserService {
  @Config('smsConfig')
  smsConfig: GlobalConfig['smsConfig'];

  async getSMSCode(params: SMSDto) {
    const { phone } = params;
    const code = getRandomNumber(100000, 999999);
    const config = new $OpenApi.Config({
      accessKeyId: this.smsConfig.accessKeyId,
      accessKeySecret: this.smsConfig.accessKeySecret,
    });
    config.endpoint = `dysmsapi.aliyuncs.com`;
    const client = new Dysmsapi20170525(config)
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: this.smsConfig.SignName,
      templateCode: this.smsConfig.templateCode,
    });
    await client.sendSmsWithOptions(sendSmsRequest, new $Util.RuntimeOptions({ }));
    console.log(code, OpenApi)
  }

  async registerByPhone(params: RegisterByPhoneDot) {
    // const { loginName, realName, phone, password, smsCode } = params;
    console.log(params);
  }
}
