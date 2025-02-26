import { Controller, Post, Inject, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FileUploadDTO } from '../../types/dto/attachment/attachment.dto.js';
import { AttachmentService } from '../../service/attachment/attachment.js';
import { LoginTokenInfo } from '../../types/types.js';
import { UploadFileInfo } from '@midwayjs/upload';

@Controller('/api/attachment')
export class AttachmentController {
  @Inject()
  ctx: Context & { tokenInfo: LoginTokenInfo };

  @Inject()
  attachmentService: AttachmentService;

  // 文件上传
  @Post('/upload')
  async upload(
    @Files() files: UploadFileInfo<string>[],
    @Fields() body: FileUploadDTO
  ) {
    const file = files[0];
    const { tokenInfo } = this.ctx;
    return this.attachmentService.create({
      file,
      fileName: body.fileName,
      projectId: body.projectId,
      uploader: {
        userId: tokenInfo.id,
        userName: tokenInfo.loginName
      }
    });
  }

  // 其他接口见下方补充
}