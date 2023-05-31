import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 短信验证码DTO
 */
export class SMSDto {
  @Rule(RuleType.string().required())
  phone: string;
}

/**
 * 图形验证码DTO
 */
export class SvgCaptchaDto {
  @Rule(RuleType.number().default(100))
  width: number;

  @Rule(RuleType.number().default(100))
  height: number;
}

/**
 * 手机号用户注册
 */

export class RegisterByPhoneDto {
  /**
   * 登录名称
   */
  @Rule(RuleType.string().required())
  loginName: string;
  /**
   * 密码
   */
  @Rule(RuleType.string().required())
  password: string;
  /**
   * 手机验证码
   */
  @Rule(RuleType.string().required())
  smsCode: string;
  /**
   * 手机号码(非必填)
   */
  @Rule(RuleType.string())
  phone?: string;
  /**
   * 真实姓名(非必填)
   */
  @Rule(RuleType.string())
  realName: string;
}
/**
 * 用户名加密码登录
 */
export class LoginByPasswordDto {
  /**
   * 登录名称
   */
  @Rule(RuleType.string().required())
  loginName: string;
  /**
   * 密码
   */
  @Rule(RuleType.string().required())
  password: string;
  /**
   * 验证码
   */
  @Rule(RuleType.string())
  captcha?: string;
}

/**
 * 手机号码登录
 */
export class LoginByPhoneDto {
  /**
   * 手机号码
   */
  @Rule(RuleType.string().required())
  phone: string;
  /**
   * 验证码
   */
  @Rule(RuleType.string().required())
  smsCode: string;
}
/**
 * 修改用户密码
 */
export class ChangePasswordByUserDto {
  /**
   * 原密码
   */
  @Rule(RuleType.string().required())
  oldPassword: string;
  /**
   * 新密码
   */
  @Rule(RuleType.string().required())
  newPassword: string;
}
