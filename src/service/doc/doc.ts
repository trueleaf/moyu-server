import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Doc } from '../../entity/doc/doc';
import { CommonController } from '../../controller/common/common';
import { LoginTokenInfo } from '../../types/types';
import { AddEmptyDocDto } from '../../types/dto/docs/docs.dto';
import { throwError } from '../../utils/utils';
import { Project } from '../../entity/project/project';


@Provide()
export class DocService {
  @InjectEntityModel(Doc)
    docModel: ReturnModelType<typeof Doc>;
  @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
  @Inject()
    commonControl: CommonController
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 新增空白文档
   */
  async addEmptyDoc(params: AddEmptyDocDto) {
    const { name, type, pid, projectId} = params;
    const userInfo = this.ctx.tokenInfo;
    await this.commonControl.checkDocOperationPermissions(projectId);
    if (pid) { //不允许在非folder类型文档下面插入文档
      const parentDoc = await this.docModel.findOne({ _id: pid });
      if (parentDoc.info.type !== 'folder') {
        throwError(4001, '操作不被允许，文件下面不允许嵌套文件夹')
      }
    }
    const doc = {
      pid,
      projectId,
      isFolder: type === 'folder',
      sort: Date.now(),
      info: {
        name,
        type,
        version: '1.0',
        creator: userInfo.realName || userInfo.loginName,
      },
      item: {
        method: 'GET'
      }
    }
    const result = await this.docModel.create(doc);
    const docLen = await this.docModel.find({ projectId, isFolder: false, enabled: true }).countDocuments();
    //=====================================添加历史记录====================================//
    if (type !== 'folder') {
      await this.projectModel.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }});
    }
    //=========================================================================//
    return {
      _id: result._id,
      pid: result.pid,
      sort: result.sort,
      name: result.info.name,
      type: result.info.type,
      method: result.item.method,
      url: result.item.url ? result.item.url.path : '',
      maintainer: result.info.maintainer,
      updatedAt: result.updatedAt,
      isFolder: result.isFolder,
    };
  }
}
