import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 验证码dot
 */
export class SMSDTO {
  @Rule(RuleType.string().required())
  phone: string;
}