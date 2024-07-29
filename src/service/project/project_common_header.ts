import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommonController } from '../../controller/common/common';
import { GetProjectCommonHeaderByIdDto, UpsertProjectCommonHeaderDto, GetProjectCommonHeadersDto } from '../../types/dto/project/project.common.header.dto';
import { Doc } from '../../entity/doc/doc';
import { Types } from 'mongoose';

@Provide()
export class ProjectCommonHeaderService {
  @InjectEntityModel(Doc)
    docModel: ReturnModelType<typeof Doc>;
  @Inject()
    commonControl: CommonController
  /**
   * 根据id获取某个请求头
   */
  async getProjectCommonHeaderById(params: GetProjectCommonHeaderByIdDto) {
    const { id, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result = await this.docModel.findOne({ _id: id }, { commonHeaders: 1 }).lean();
    return {
      _id: result._id,
      commonHeaders: result.commonHeaders.map(v => ({
        ...v,
        _id: new Types.ObjectId().toString()
      }))
    };
  }
  /**
   * 修改公共请求头
   */
  async upsertProjectCommonHeader(params: UpsertProjectCommonHeaderDto) {
    const { commonHeaders, projectId, id  } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    await this.docModel.findByIdAndUpdate({ _id: id }, {
      $set: {
        commonHeaders
      }
    });
    return;
  }
  /**
   * 获取公共请求头
   */
  async getProjectCommonHeaders(params: GetProjectCommonHeadersDto) {
    const { projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result = [];
    const docsInfo = await this.docModel.find({
      projectId,
      enabled: true,
    }, {
      pid: 1,
      info: 1,
      isFolder: 1,
      sort: 1,
      commonHeaders: 1,
      children: 1,
    }).sort({
      isFolder: -1,
      sort: 1
    }).lean();
    const pickedData =  docsInfo.map(val => {
      if (val.isFolder) {
        return {
          _id: val._id,
          pid: val.pid,
          isFolder: val.isFolder,
          commonHeaders: val.commonHeaders,
          children: [],
        };
      } else {
        return {
          _id: val._id,
          pid: val.pid,
          isFolder: val.isFolder,
          commonHeaders: val.commonHeaders,
          children: [],
        };
      }
    })
    for (let i = 0; i < pickedData.length; i++) {
      const docInfo = pickedData[i];
      if (!docInfo.pid) { //根元素
        docInfo.children = [];
        result.push(docInfo);
      }
      const id = docInfo._id.toString();
      for (let j = 0; j < pickedData.length; j++) {
        if (id === pickedData[j].pid) { //项目中新增的数据使用标准id
          if (docInfo.children == null) {
            docInfo.children = [];
          }
          docInfo.children.push(pickedData[j]);
        }
      }
    }
    return result;
  }
}
