import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseWrapper } from '../types/response/common/common';
import { MidwayValidationError } from '@midwayjs/validate';
import { MultipartInvalidFilenameError } from '@midwayjs/upload';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context): Promise<ResponseWrapper> {
    console.log(ctx.request.method, ctx.request.url, '耗时', Date.now() - ctx.__logStartTime, ctx.origin)
    return {
      code: 1001,
      msg: `校验参数错误${err.message}`,
    };
  }
}
@Catch()
export class AllServerErrorFilter {
  async catch(err: MidwayHttpError & { isCustomError?: boolean }, ctx: Context) {
    ctx.logger.error(err);
    console.log(ctx.request.method, ctx.request.url, '耗时', Date.now() - ctx.__logStartTime, ctx.origin)
    if (err?.isCustomError) {
      return err;
    }
    if (err instanceof MultipartInvalidFilenameError) {
      return {
        code: 5000,
        msg: `附件格式错误`,
      };
    }
    if (err instanceof TokenExpiredError) {
      return {
        code: 4100,
        msg: `登录已过期`,
      };
    }
    return {
      code: 5000,
      msg: `内部错误：${err.message}`,
    };
  }
}
