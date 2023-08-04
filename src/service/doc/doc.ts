import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Doc } from '../../entity/doc/doc';
import { CommonController } from '../../controller/common/common';
import { LoginTokenInfo, RequestMethod } from '../../types/types';
import { AddEmptyDocDto, ChangeDocBaseInfoDto, ChangeDocPositionDto, ReplaceFullDocDto, DeleteDocDto, GenerateDocCopyDto, GetDocDetailDto, GetMockDataDto, PasteDocsDto, UpdateDoc, GetDocsAsTreeDto } from '../../types/dto/doc/doc.dto';
import { throwError } from '../../utils/utils';
import { Project } from '../../entity/project/project';
import { Types } from 'mongoose';
import { filterXSS } from 'xss';

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
  /**
   * 生成文档副本
   */
  async generateDocCopy(params: GenerateDocCopyDto) {
    const { _id, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const doc = await this.docModel.findOne({ _id }).lean();
    doc.item.method = doc.item.method.toUpperCase() as RequestMethod;
    doc.info.name = '副本-' + doc.info.name;
    doc._id = new Types.ObjectId();
    doc.sort += 1;
    const result = await this.docModel.create(doc);
    if (!doc.isFolder) {
      await this.projectModel.findByIdAndUpdate({ _id: doc.projectId }, { $inc: { docNum: 1 }});
    }
    return {
      _id: result._id,
      pid: result.pid,
      sort: result.sort,
      isFolder: result.isFolder,
      updatedAt: result.updatedAt,
      type: result.info.type,
      name: result.info.name,
      maintainer: result.info.maintainer,
      method: result.item.method,
      url: result.item.url.path,
    };
  }
  /**
   * 粘贴文档
   */
  async pasteDocs(params: PasteDocsDto) {
    const { projectId, docs, mountedId = '', fromProjectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    await this.commonControl.checkDocOperationPermissions(fromProjectId);
    const docIds = docs.map(v => v._id);
    const matchedDocs = await this.docModel.find({ projectId: fromProjectId, _id: { $in: docIds } }).lean();
    const idMap: {
      newId: string;
      oldId: string;
      newPid: string;
    }[] = [];
    //先重新绑定pid
    matchedDocs.forEach((docInfo) => {
      const newId = new Types.ObjectId().toString();
      const oldId = docInfo._id.toString();
      const oldPid = docInfo.pid;
      docInfo.sort = Date.now();
      const mapInfo = {
        newId,
        newPid: '',
        oldId,
        oldPid,
      };
      matchedDocs.forEach((docInfo2) => {
        const pid2 = docInfo2.pid;
        if (pid2 === oldId) { //说明这个是子元素
          docInfo2.pid = newId;
          mapInfo.newPid = newId;
        }
      })
      const hasParent = matchedDocs.find((v) => v._id.toString() === docInfo.pid);
      if (!hasParent) {
        docInfo.pid = mountedId;
        mapInfo.newPid = mountedId;
      }
      idMap.push(mapInfo);
      docInfo._id = new Types.ObjectId(newId);
      docInfo.projectId = projectId;
      docInfo.sort = Date.now();
    })
    await this.docModel.insertMany(matchedDocs);
    return idMap;
  }
  /**
   * 改变文档位置信息
   */
  async changeDocPosition(params: ChangeDocPositionDto) {
    const { _id, pid, sort, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const updateDoc = { $set: {
      pid: '',
      sort: 0
    }};
    let parentDoc = null;
    let isFolder = null;
    updateDoc.$set.pid = pid;
    updateDoc.$set.sort = sort;
    if (pid) {
      parentDoc = await this.docModel.findById({ _id: pid });
      isFolder = parentDoc.isFolder;
    }
    if (parentDoc && !isFolder) {
      throwError(4001, '操作不被允许，pid对应的父元素不是文件夹')
    }
    await this.docModel.findByIdAndUpdate({ _id }, updateDoc);
    return;
  }
  /**
   * 修改文档基础信息
   */
  async changeDocBaseInfo(params: ChangeDocBaseInfoDto) {
    const { _id, name, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    await this.docModel.findByIdAndUpdate({ _id }, { $set: { 'info.name': name }});
    return { _id };
  }
  /**
   * 改变文档请求相关数据
   */
  async updateDoc(params: UpdateDoc) {
    const { _id, info, item, preRequest, afterRequest, projectId, mockInfo, spendTime = 0 } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const { tokenInfo } = this.ctx;
    const description = filterXSS(info.description);
    const updateInfo = {
      $set: {
        preRequest,
        afterRequest,
        item,
        mockInfo,
        'info.description': description,
        'info.maintainer': tokenInfo.realName || tokenInfo.loginName,
      },
      $inc: {
        'info.spendTime': spendTime
      }
    }
    await this.docModel.findByIdAndUpdate({ _id }, updateInfo);
    return;
  }
  /**
   * 覆盖文档
   */
  async replaceFullDoc(params: ReplaceFullDocDto) {
    const { docInfo } = params;
    await this.commonControl.checkDocOperationPermissions(docInfo.projectId);
    const _id = new Types.ObjectId().toString();
    docInfo._id = _id
    const result = await this.docModel.create(docInfo);
    return result._id;
  }
  /**
   * 获取文档详情
   */
  async getDocDetail(params: GetDocDetailDto) {
    const { _id, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result = await this.docModel.findOne({ _id }, { pid: 0, sort: 0, enabled: 0 }).lean();
    if (!result) {
      throwError(4001, '暂无文档信息')
    }
    result.preRequest = result.preRequest ? result.preRequest : {
      raw: ''
    }
    result.afterRequest = result.afterRequest ? result.afterRequest : {
      raw: ''
    }
    return result;
  }
  /**
   * 删除文档
   */
  async deleteDoc(params: DeleteDocDto) {
    const { ids, projectId } = params;
    const { tokenInfo } = this.ctx;
    const result = await this.docModel.updateMany({
      projectId,
      _id: { $in: ids }
    }, {
      $set: {
        enabled: false,
        'info.deletePerson': tokenInfo.realName || tokenInfo.loginName
      }
    }); //文档祖先包含删除元素，那么该文档也需要被删除
    const docLen = await this.docModel.find({ projectId, isFolder: false, enabled: true }).countDocuments();
    await this.projectModel.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }});
    return result;
  }
  /**
   * 获取mock文档数据
   */
  async getMockData(params: GetMockDataDto) {
    // const { _id } = params;
    // const doc = await this.docModel.findOne({ _id, enabled: true }).lean();
    // const result = this.convertPlainParamsToTreeData(doc.item.responseParams);
    return params;
  }
  /**
   * 以树形结构获取文档
   */
  async getDocsAsTree(params: GetDocsAsTreeDto, ignorePermission?: boolean) {
    const { projectId } = params;
    if (!ignorePermission) {
      await this.commonControl.checkDocOperationPermissions(projectId);
    }
    const result: Partial<Doc>[] = [];
    const docsInfo = await this.docModel.find({
      projectId: projectId,
      enabled: true
    }, {
      pid: 1,
      info: 1,
      'item.method': 1,
      'item.url': 1,
      'mockInfo.path': 1,
      isFolder: 1,
      sort: 1,
      updatedAt: 1,
    }).sort({
      isFolder: -1,
      sort: 1
    }).lean();
    const pickedData =  docsInfo.map(val => {
      if (val.isFolder) {
        return {
          _id: val._id,
          pid: val.pid,
          sort: val.sort,
          name: val.info.name,
          type: val.info.type,
          maintainer: val.info.maintainer,
          updatedAt: val.updatedAt,
          isFolder: val.isFolder,
          children: [],
        };
      } else {
        return {
          _id: val._id,
          pid: val.pid,
          sort: val.sort,
          name: val.info.name,
          type: val.info.type,
          method: val.item.method,
          url: val.item.url ? val.item.url.path : '',
          customMockUrl: val.mockInfo?.path || '',
          maintainer: val.info.maintainer,
          updatedAt: val.updatedAt,
          isFolder: val.isFolder,
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
  /**
   * 以树形结构获取文件夹信息(仅获取文件夹信息，用于一个项目向另一个项目导入)
   */
  async getFoldersAsTree(params: GetDocsAsTreeDto) {
    const { projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result: Partial<Doc>[] = [];
    const docsInfo = await this.docModel.find({
      projectId: projectId,
      isFolder: true,
      enabled: true,
    }).sort({
      isFolder: -1,
      sort: 1
    }).lean();
    const pickedData =  docsInfo.map(val => {
      if (val.isFolder) {
        return {
          _id: val._id,
          pid: val.pid,
          sort: val.sort,
          name: val.info.name,
          type: val.info.type,
          maintainer: val.info.maintainer,
          isFolder: val.isFolder,
          children: [],
        };
      } else {
        return {
          _id: val._id,
          pid: val.pid,
          sort: val.sort,
          name: val.info.name,
          type: val.info.type,
          method: val.item.method,
          maintainer: val.info.maintainer,
          isFolder: val.isFolder,
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
