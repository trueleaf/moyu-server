import { ResponseWrapper } from '../common/common';

/**
 * 验证码返回参数
 */
export type ResSMSCode = ResponseWrapper<{
  code: string;
}>;
