import { Provide, Inject, Context } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommonController } from '../../controller/common/common';
import { DocPrefix } from '../../entity/doc/doc_prefix';
import { LoginTokenInfo } from '../../types/types';
import { AddDocPrefixDto, DeleteDocPrefix, GetDocPrefixList, GetDocPrefixInfo, EditDocPrefix } from '../../types/dto/doc/doc.prefix.dto';
import { throwError } from '../../utils/utils';
import { TableResponseWrapper } from '../../types/response/common/common';

@Provide()
export class DocPrefixServer {
  @InjectEntityModel(DocPrefix)
    docPrefixModel: ReturnModelType<typeof DocPrefix>;
  @Inject()
    commonControl: CommonController;
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 新增接口前缀
   */
  async addDocPrefix(params: AddDocPrefixDto) {
    const { name, url, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId)
    const updateDOc: Partial<DocPrefix> = {};
    updateDOc.name = name;
    updateDOc.url = url;
    updateDOc.projectId = projectId;
    const hasService = await this.docPrefixModel.findOne({ projectId, url, enabled: true });
    if (hasService) {
      throwError(1003, '当前接口前缀url已存在')
    }
    await this.docPrefixModel.create(updateDOc);
    return;
  }
  /**
   * 删除接口前缀
   */
  async deleteDocPrefix(params: DeleteDocPrefix) {
    const { ids, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId)
    const result = await this.docPrefixModel.updateMany(
      { _id: { $in: ids }},
      { $set: { enabled: false }}
    );
    return result;
  }
  /**
   * 列表形式获取前缀
   */
  async getDocPrefixList(params: GetDocPrefixList) {
    const { pageNum, pageSize, startTime, endTime, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId)
    const query = { enabled: true, projectId } as {
      projectId: string;
      enabled: boolean;
      createdAt?: {
        $gt?: number,
        $lt?: number,
      };
      $or: Record<string, string>[]
    };
    let skipNum = 0;
    let limit = 100;
    //基础查询
    if (pageSize != null && pageNum != null) {
      skipNum = (pageNum - 1) * pageSize;
      limit = pageSize;
    }
    if (startTime != null && endTime == null) {
      query.createdAt = { $gt: startTime, $lt: Date.now() };
    } else if (startTime != null && endTime != null) {
      query.createdAt = { $gt: startTime, $lt: endTime };
    }
    const result: TableResponseWrapper = {
      rows: [],
      total: 0
    };
    result.rows = await this.docPrefixModel.find(query, { name: 1, url: 1 }).skip(skipNum).limit(limit);
    result.total = await this.docPrefixModel.find(query).countDocuments();
    return result;
  }
  /**
   * 获取前缀详情
   */
  async getDocPrefixInfo(params: GetDocPrefixInfo) {
    const { id, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId)
    const result = await this.docPrefixModel.findOne({ id, projectId, enabled: true });
    return result;
  }
  /**
   * 修改前缀信息
   */
  async editDocPrefix(params: EditDocPrefix) {
    const { _id, name, url, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId)
    const updateDoc: Partial<EditDocPrefix> = {};
    if (name) {
      updateDoc.name = name;
    }
    if (url) {
      updateDoc.url = url;
    }
    await this.docPrefixModel.findOneAndUpdate({ _id }, updateDoc);
    return;
  }
}
