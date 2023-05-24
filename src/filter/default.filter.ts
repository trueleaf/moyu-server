import { Catch } from '@midwayjs/core';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error) {
    // 所有的未分类错误会到这里
    return {
      success: false,
      message: err.message,
    };
  }
}
