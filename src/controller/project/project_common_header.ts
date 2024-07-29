import { Inject, Controller, Body, Get, Put, Query } from '@midwayjs/core';
import { GetProjectCommonHeaderByIdDto, UpsertProjectCommonHeaderDto, GetProjectCommonHeadersDto } from '../../types/dto/project/project.common.header.dto';
import { ProjectCommonHeaderService } from '../../service/project/project_common_header';

@Controller('/api')
export class ProjectCommonHeaderController {
  @Inject()
    projectCommonHeaderService: ProjectCommonHeaderService
  /**
   * 根据id获取某个请求头
   */
  @Get('/project/common_header_by_id')
  async getProjectCommonHeaderById(@Query() params: GetProjectCommonHeaderByIdDto) {
    const data = await this.projectCommonHeaderService.getProjectCommonHeaderById(params);
    return data;
  }
  /**
   * 新增或修改公共请求头
   */
  @Put('/project/common_header')
  async upsertProjectCommonHeader(@Body() params: UpsertProjectCommonHeaderDto) {
    const data = await this.projectCommonHeaderService.upsertProjectCommonHeader(params);
    return data;
  }
  /**
   * 获取公共请求头
   */
  @Get('/project/common_headers')
  async getProjectCommonHeaders(@Query() params: GetProjectCommonHeadersDto) {
    const data = await this.projectCommonHeaderService.getProjectCommonHeaders(params);
    return data;
  }
}
