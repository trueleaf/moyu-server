/**
 * 0 正确返回
 * 1001 请求参数错误
 */
export type ResponseWrapper<T = any> = {
  code: 0 | 1001 | 5000;
  msg: string;
  data?: T;
};
