import { Inject, Controller, Body, Post } from '@midwayjs/core';
import { ProjectService } from '../../service/project/project';
import { AddProjectDto } from '../../types/dto/project/project.dto';

@Controller('/api')
export class ProjectShareController {
  @Inject()
    projectService: ProjectService;

  /**
   * 新增项目
   */
  @Post('/project/add_project2')
  async addProject(@Body() params: AddProjectDto) {
    const data = await this.projectService.addProject(params);
    return data;
  }
}
