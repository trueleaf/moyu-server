/**
 * 0 正确返回
 * 1001 请求参数错误
 */
export type ResponseWrapper<T = unknown> = {
  code:
    | 0
    | 1001
    | 1003
    | 1006
    | 1007
    | 2001
    | 2002
    | 2003
    | 2004
    | 2005
    | 2008
    | 2009
    | 2010
    | 4001
    | 4002
    | 4004
    | 5000;
  msg: string;
  data?: T;
};

export type TableResponseWrapper<T = unknown> = {
  rows: T[];
  total: number;
};
