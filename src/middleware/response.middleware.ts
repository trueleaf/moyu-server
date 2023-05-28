import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class ResponseWrapperMiddleware
  implements IMiddleware<Context, NextFunction>
{
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      if (result?.isCustomError) {
        return result;
      }
      return {
        code: 0,
        msg: '操作成功',
        data: result,
      };
    };
  }

  static getName(): string {
    return 'responseWrapper';
  }
}
