import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ProjectShare } from '../../entity/project/project_share';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommonController } from '../../controller/common/common';
import { LoginTokenInfo } from '../../types/types';
import { GenerateSharedProjectLinkDto, GetSharedProjectLinkListDto, DeleteSharedProjectLinkDto, GetSharedLinkInfoDto, CheckOnlineProjectPasswordDto, GetSharedProjectBannerDto, GetSharedProjectInfoDto, GetSharedDocDetailDto, EditSharedProjectLinkDto } from '../../types/dto/project/project.share.dto';
import { Project } from '../../entity/project/project';
import { uniqueId } from 'lodash';

@Provide()
export class ProjectShareService {
  @InjectEntityModel(ProjectShare)
    projectShareModel: ReturnModelType<typeof ProjectShare>;
  @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
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
      shareId: uniqueId(),
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
    // const { shareName, projectId, password, maxAge = 86400000, selectedDocs = [] } = params;
    // await this.commonControl.checkDocOperationPermissions(projectId);
    // let expire = Date.now();
    // if (!maxAge || maxAge > 31536000000 * 5) {
    //   expire += 31536000000 * 5; //五年后过期
    // } else {
    //   expire += maxAge
    // }
    // await this.projectShareModel.findByIdAndUpdate({ _id }, {
    //     $set: {
    //         shareName,
    //         password,
    //         expire,
    //         selectedDocs
    //     }
    // });
    // return;
  }
  /**
   * 分页获取在线链接
   */
  async getSharedProjectLinkList(params: GetSharedProjectLinkListDto) {}
  /**
   * 删除在线链接
   */
  async deleteSharedProjectLink(params: DeleteSharedProjectLinkDto) {}
  /**
   * 根据分享id获取分享项目链接基本信息
   */
  async getSharedLinkInfo(params: GetSharedLinkInfoDto) {}
  /**
   * 分享链接密码校验
   */
  async checkSharedProjectPassword(params: CheckOnlineProjectPasswordDto) {}
  /**
   * 根据id和密码获取分享文档的banner信息
   */
  async getSharedProjectBanner(params: GetSharedProjectBannerDto) {}
  /**
   * 获取分享项目基本信息
   */
  async getSharedProjectInfo(params: GetSharedProjectInfoDto) {}
  /**
   * 获取分享项目接口详情
   */
  async getSharedDocDetail(params: GetSharedDocDetailDto) {}
}
