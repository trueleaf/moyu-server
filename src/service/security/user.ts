import { Config, Provide } from '@midwayjs/core';
import { SMSDTO } from '../../types/dto/security/user.dto';
import { getRandomNumber } from '../../utils/utils';
import { GlobalConfig } from '../../types/types';

@Provide()
export class UserService {

  @Config('smsConfig')
  smsConfig: GlobalConfig;

  async getSMSCode(params: SMSDTO) {
    const { phone } = params;
    const code = getRandomNumber(100000, 999999);
    console.log(this.smsConfig, phone, code) 
    // const client = new Sms({
    //     ...smsConfig.base
    // });
    // const msgConfig = {
    //     ...smsConfig.template,
    //     PhoneNumbers: phone,
    //     TemplateParam: `{code: ${code}}`
    // };
    // const requestOption = {
    //     method: "POST"
    // };
    // await this.ctx.model.Security.Sms.updateOne({ phone }, { $set: { phone, smsCode: code }}, { upsert: true });
    // await client.request("SendSms", msgConfig, requestOption);
  }
}
