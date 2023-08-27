import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { LoginTokenInfo } from '../../types/types';
import { CommonController } from '../../controller/common/common';
import { ProjectRules } from '../../entity/project/project_rules';
import { GetProjectRulesByIdDto, UpdateProjectRulesDto } from '../../types/dto/project/project.rules.dto';

const BASE_RULES = {
  fileInFolderLimit: 255, //单个文件夹默认限制文件个数
  requestMethods: [
    {
      name: 'GET',
      value: 'GET',
      enabled: true,
      iconColor: '#28a745',
      enabledContenTypes: ['path', 'params'],
    },
    {
      name: 'POST',
      value: 'POST',
      enabled: true,
      iconColor: '#ffc107',
      enabledContenTypes: ['params', 'json', 'formData'],
    },
    {
      name: 'PUT',
      value: 'PUT',
      enabled: true,
      iconColor: '#409EFF',
      enabledContenTypes: ['params', 'json'],
    },
    {
      name: 'DEL',
      value: 'DELETE',
      enabled: true,
      iconColor: '#f56c6c',
      enabledContenTypes: ['params'],
    },
    {
      name: 'OPTIONS',
      value: 'OPTIONS',
      enabled: false,
      iconColor: '#17a2b8',
      enabledContenTypes: ['params', 'json'],
    },
    {
      name: 'PATCH',
      value: 'PATCH',
      enabled: true,
      iconColor: '#17a2b8',
      enabledContenTypes: ['params', 'json'],
    },
  ],
};
@Provide()
export class ProjectRulesService {
  @InjectEntityModel(ProjectRules)
    projectRulesModel: ReturnModelType<typeof ProjectRules>;
  @Inject()
    commonControl: CommonController
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 修改项目规则
   */
  async updateProjectRules(params: UpdateProjectRulesDto) {
    const { projectId, fileInFolderLimit, requestMethods } = params;
    const doc: Partial<ProjectRules> = {};
    doc.projectId = projectId;
    if (fileInFolderLimit) {
      doc.fileInFolderLimit = fileInFolderLimit || BASE_RULES.fileInFolderLimit;
    }
    if (requestMethods) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.requestMethods = requestMethods || (BASE_RULES.requestMethods as any);
    }
    await this.projectRulesModel.updateOne({ projectId }, doc, {
      upsert: true
    });
    return;
  }
  /**
   * 根据id查询项目规则
   */
  async getProjectRulesById(params: GetProjectRulesByIdDto) {
    const { projectId } = params;
    console.log(this.projectRulesModel)
    const result = await this.projectRulesModel.findOne({
      projectId,
    }).lean();
    return result || BASE_RULES;
  }
}
