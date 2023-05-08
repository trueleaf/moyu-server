import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_sms' },
})
export class Sms {
  /**
   * 手机号
   */
  @prop()
  public phone: string;
  /**
   * 验证码
   */
  @prop()
  public smsCode: string;
}
