import { Catch } from '@midwayjs/core';
import { MidwayValidationError } from '@midwayjs/validate';
import { ResponseWrapper } from '../types/response/common/common';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError): Promise<ResponseWrapper> {
    return {
      code: 1001,
      msg: `校验参数错误${err.message}`,
    };
  }
}
