import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseWrapper } from '../types/response/common/common';
import { MidwayValidationError } from '@midwayjs/validate';
import { MultipartInvalidFilenameError } from '@midwayjs/upload';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError): Promise<ResponseWrapper> {
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
    console.log(err instanceof MultipartInvalidFilenameError)
    if (err?.isCustomError) {
      return err;
    }
    if (err instanceof MultipartInvalidFilenameError) {
      return {
        code: 5000,
        msg: `附件格式错误`,
      };
    }
    return {
      code: 5000,
      msg: `内部错误：${err.message}`,
    };
  }
}
