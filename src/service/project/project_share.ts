import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ProjectShare } from '../../entity/project/project_share';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommonController } from '../../controller/common/common';
import { LoginTokenInfo } from '../../types/types';
import { GenerateSharedProjectLinkDto, GetSharedProjectLinkListDto, DeleteSharedProjectLinkDto, GetSharedLinkInfoDto, CheckOnlineProjectPasswordDto, GetSharedProjectBannerDto, GetSharedProjectInfoDto, GetSharedDocDetailDto, EditSharedProjectLinkDto } from '../../types/dto/project/project.share.dto';
import { Project } from '../../entity/project/project';
import { nanoid } from 'nanoid'
import { throwError } from '../../utils/utils';
import { DocService } from '../doc/doc';
import { ProjectService } from '../project/project';
import { Doc } from '../../entity/doc/doc';
import { DocPrefix } from '../../entity/doc/doc_prefix';
import { ProjectVariable } from '../../entity/project/project_variable';

@Provide()
export class ProjectShareService {
  @InjectEntityModel(ProjectShare)
    projectShareModel: ReturnModelType<typeof ProjectShare>;
  @InjectEntityModel(DocPrefix)
    docPrefixModel: ReturnModelType<typeof DocPrefix>;
  @InjectEntityModel(Doc)
    docModel: ReturnModelType<typeof Doc>;
  @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
  @InjectEntityModel(ProjectVariable)
    projectVariableModel: ReturnModelType<typeof ProjectVariable>;
  @Inject()
    docService: DocService;
  @Inject()
    projectService: ProjectService;
  @Inject()
    commonControl: CommonController;
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 生成在线链接
   */
  async generateSharedProjectLink(params: GenerateSharedProjectLinkDto) {
    const { shareName, projectId, password, maxAge = 86400000, selectedDocs = [] } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    let expire = Date.now();
    if (!maxAge || maxAge > 31536000000 * 5) {
      expire += 31536000000 * 5; //五年后过期
    } else {
      expire += maxAge
    }
    const projectInfo = await this.projectModel.findOne({ _id: projectId }, { projectName: 1 }).lean();
    const shareInfo = {
      shareId: nanoid(),
      shareName,
      projectId,
      password,
      projectName: projectInfo.projectName,
      expire,
      selectedDocs
    }
    const result = await this.projectShareModel.create(shareInfo);
    return result.shareId;
  }
  /**
   * 修改在线链接
   */
  async editSharedProjectLink(params: EditSharedProjectLinkDto) {
    const { shareName, projectId, _id, password, maxAge = 86400000, selectedDocs = [] } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    let expire = Date.now();
    if (!maxAge || maxAge > 31536000000 * 5) {
      expire += 31536000000 * 5; //五年后过期
    } else {
      expire += maxAge
    }
    await this.projectShareModel.findByIdAndUpdate({ _id }, {
      $set: {
        shareName,
        password,
        expire,
        selectedDocs
      }
    });
    return;
  }
  /**
   * 分页获取在线链接
   */
  async getSharedProjectLinkList(params: GetSharedProjectLinkListDto) {
    const { projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const rows = await this.projectShareModel.find({ projectId, enabled: true }, { enabled: 0, createdAt: 0, updatedAt: 0 });
    const total = await this.projectShareModel.find({ projectId, enabled: true }).countDocuments();
    return {
      rows,
      total
    };
  }
  /**
   * 删除在线链接
   */
  async deleteSharedProjectLink(params: DeleteSharedProjectLinkDto) {
    const { projectId, _id } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    await this.projectShareModel.updateOne({ projectId, _id }, { $set: { enabled: false } });
    return;
  }
  /**
   * 获取分享项目链接基本信息
   */
  async getSharedLinkInfo(params: GetSharedLinkInfoDto) {
    const { shareId } = params;
    const result = await this.projectShareModel.findOne({ shareId, enabled: true }, { projectName: 1, shareName: 1, expire: 1, password: 1 }).lean();
    if (!result) {
      throwError(101003, '文档不存在')
    }
    return {
      projectName: result.projectName,
      shareName: result.shareName,
      expire: result.expire,
      needPassword: !!result.password,
    };
  }
  /**
   * 分享链接密码校验
   */
  async checkSharedProjectPassword(params: CheckOnlineProjectPasswordDto) {
    const { shareId, password } = params;
    const projectShare = await this.projectShareModel.findOne({ shareId }).lean();
    if (!projectShare) {
      throwError(101003, '文档不存在')
    }
    const projectPassword = projectShare.password;
    const expire = projectShare.expire;
    const nowTime = Date.now();
    const isExpire = nowTime > expire;
    const hasPassword = projectPassword != null && projectPassword !== '';
    const passwordIsEqual = password === projectPassword;
    if (hasPassword && !passwordIsEqual) { //密码错误
      throwError(101001, '密码错误');
    }  else if (isExpire) { //文档过期
      throwError(101002, '文档已过期')
    } else if ((hasPassword && passwordIsEqual && !isExpire) || (!hasPassword && !isExpire)) {
      return true;
    } else {
      throwError(101003, '文档错误')
    }
  }
  checkPassword(params: { expire: number; password: string; projectPassword: string; }) {
    const { expire, password, projectPassword } = params;
    const nowTime = Date.now();
    const isExpire = nowTime > expire;
    const hasPassword = projectPassword != null && projectPassword !== '';
    const passwordIsEqual = password === projectPassword;
    if ((hasPassword && passwordIsEqual && !isExpire) || (!hasPassword && !isExpire)) { //密码正确并且没有过期
      return true;
    }
    return false;
  }
  /**
 * 根据id和密码获取分享文档的banner信息
 */
  async getSharedProjectBanner(params: GetSharedProjectBannerDto) {
    const sharedProjectInfo = await this.projectShareModel.findOne({ shareId: params.shareId }).lean();
    if (!sharedProjectInfo) {
      throwError(101005, '无效的的id和密码')
    }
    const checkParams = {
      expire: sharedProjectInfo.expire,
      password:  params.password,
      projectPassword: sharedProjectInfo.password,
    };
    const valid = this.checkPassword(checkParams);
    if (!valid) {
      throwError(101005, '无效的的id和密码')
    }
    const result = await this.docService.getDocsAsTree({ projectId: sharedProjectInfo.projectId }, true);
    return result;
  }
  /**
   * 获取分享项目基本信息
   */
  async getSharedProjectInfo(params: GetSharedProjectInfoDto) {
    const sharedProjectInfo = await this.projectShareModel.findOne({ shareId: params.shareId }).lean();
    if (!sharedProjectInfo) {
      throwError(101005, '无效的的id和密码')
    }
    const checkParams = {
      expire: sharedProjectInfo.expire,
      password:  params.password,
      projectPassword: sharedProjectInfo.password,
    };
    const valid = await this.checkPassword(checkParams);
    if (!valid) {
      throwError(101005, '无效的的id和密码')
    }
    const hosts = await this.docPrefixModel.find({ projectId: sharedProjectInfo.projectId, enabled: true }, { name: 1, url: 1 });
    const variables = await this.projectVariableModel.find({ projectId: sharedProjectInfo.projectId, enabled: true }, { name: 1, type: 1, value: 1 });
    const projectInfo = await this.projectModel.findById(
      {
        _id: sharedProjectInfo.projectId,
        enabled: true
      },
      {
        projectName: 1,
      },
    );
    const result = {
      projectName: projectInfo.projectName,
      _id: projectInfo._id,
      hosts,
      variables,
    }
    return result;
  }
  /**
   * 获取分享项目接口详情
   */
  async getSharedDocDetail(params: GetSharedDocDetailDto) {
    const sharedProjectInfo = await this.projectShareModel.findOne({ shareId: params.shareId }).lean();
    if (!sharedProjectInfo) {
      throwError(101005, '无效的的id和密码')
    }
    const checkParams = {
      expire: sharedProjectInfo.expire,
      password:  params.password,
      projectPassword: sharedProjectInfo.password,
    };
    const valid = await this.checkPassword(checkParams);
    if (!valid) {
      throwError(101005, '无效的的id和密码')
    }
    const result = await this.docModel.findOne({ _id: params._id }, { pid: 0, isFolder: 0, sort: 0, enabled: 0 });
    if (!result) {
      throwError(4001, '暂无文档信息')
    }
    return result;
  }
}
