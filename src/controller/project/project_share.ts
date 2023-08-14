import { Inject, Controller, Body, Post, Put, Get, Del } from '@midwayjs/core';
import { ProjectService } from '../../service/project/project';
import { GenerateSharedProjectLinkDto, EditSharedProjectLinkDto, GetSharedProjectLinkListDto, DeleteSharedProjectLinkDto, GetSharedLinkInfoDto, CheckOnlineProjectPasswordDto, GetSharedProjectBannerDto, GetSharedProjectInfoDto, GetSharedDocDetailDto } from '../../types/dto/project/project.share.dto';

@Controller('/api')
export class ProjectShareController {
  @Inject()
    projectService: ProjectService;
  /**
   * 生成在线链接
   */
  @Post('/project/export/online')
  async generateSharedProjectLink(@Body() params: GenerateSharedProjectLinkDto) {
    const data = await this.projectService.generateSharedProjectLink(params);
    return data;
  }
  /**
   * 修改在线链接
   */
  @Put('/project/export/online')
  async editSharedProjectLink(@Body() params: EditSharedProjectLinkDto) {
    const data = await this.projectService.editSharedProjectLink(params);
    return data;
  }
  /**
   * 分页获取在线链接
   */
  @Get('/project/export/online')
  async getSharedProjectLinkList(@Body() params: GetSharedProjectLinkListDto) {
    const data = await this.projectService.getSharedProjectLinkList(params);
    return data;
  }
  /**
   * 删除在线链接
   */
  @Del('/project/export/online')
  async deleteSharedProjectLink(@Body() params: DeleteSharedProjectLinkDto) {
    const data = await this.projectService.deleteSharedProjectLink(params);
    return data;
  }
  /**
   * 根据分享id获取分享项目链接基本信息
   */
  @Get('/project/share_info')
  async getSharedLinkInfo(@Body() params: GetSharedLinkInfoDto) {
    const data = await this.projectService.getSharedLinkInfo(params);
    return data;
  }
  /**
   * 分享链接密码校验
   */
  @Get('/project/share_check')
  async checkSharedProjectPassword(@Body() params: CheckOnlineProjectPasswordDto) {
    const data = await this.projectService.checkSharedProjectPassword(params);
    return data;
  }
  /**
   * 根据id和密码获取分享文档的banner信息
   */
  @Get('/project/export/share_banner')
  async getSharedProjectBanner(@Body() params: GetSharedProjectBannerDto) {
    const data = await this.projectService.getSharedProjectBanner(params);
    return data;
  }
  /**
   * 获取分享项目基本信息
   */
  @Get('/project/export/share_project_info')
  async getSharedProjectInfo(@Body() params: GetSharedProjectInfoDto) {
    const data = await this.projectService.getSharedProjectInfo(params);
    return data;
  }
  /**
   * 获取分享项目接口详情
   */
  @Get('/project/share_doc_detail')
  async getSharedDocDetail(@Body() params: GetSharedDocDetailDto) {
    const data = await this.projectService.getSharedDocDetail(params);
    return data;
  }

}
