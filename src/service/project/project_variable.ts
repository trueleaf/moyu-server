import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ProjectVariable } from '../../entity/project/project_variable';
import { ReturnModelType } from '@typegoose/typegoose';
import { LoginTokenInfo } from '../../types/types';
import { CommonController } from '../../controller/common/common';
import { AddProjectVariableDto, DeleteProjectVariableDto, EditProjectVariableDto, GetProjectVariableEnumDto, GetProjectVariableListDto } from '../../types/dto/project/project.varible.dto';
import { throwError } from '../../utils/utils';


@Provide()
export class ProjectVariableService {
  @InjectEntityModel(ProjectVariable)
    projectVariableModel: ReturnModelType<typeof ProjectVariable>;
  @Inject()
    commonControl: CommonController
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 新增变量
   */
  async addProjectVariable(params: AddProjectVariableDto) {
    const { name, type, value, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const doc: Partial<ProjectVariable> = {};
    doc.name = name;
    doc.type = type;
    doc.value = value;
    doc.projectId = projectId;
    doc.creator = this.ctx.tokenInfo.realName;
    const hasName = await this.projectVariableModel.findOne({
      projectId,
      name,
    });
    if (hasName) {
      return throwError(1003, '变量名称重复')
    }
    await this.projectVariableModel.create(doc);
    return;
  }
  /**
   * 修改全局变量
   */
  async editProjectVariable(params: EditProjectVariableDto) {
    const { _id, name, type, value, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const updateDoc: Partial<ProjectVariable> = {};
    if (name) {
      updateDoc.name = name;
    }
    if (type) {
      updateDoc.type = type;
    }
    if (value) {
      updateDoc.value = value;
    }
    const hasName = await this.projectVariableModel.findOne({
      projectId,
      _id: { $ne: _id },
      name,
    });
    if (hasName) {
      return throwError(1003, '变量名称重复')
    }
    await this.projectVariableModel.findByIdAndUpdate({ _id }, updateDoc);
    return;
  }
  /**
   * 删除全局变量
   */
  async deleteProjectVariable(params: DeleteProjectVariableDto) {
    const { ids, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result = await this.projectVariableModel.deleteMany({ _id: { $in: ids }});
    return result;
  }
  /**
   * 列表方式获取全局变量
   */
  async getProjectVariableList(params: GetProjectVariableListDto) {
    const { pageNum, pageSize, startTime, endTime, projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const query = {
      enabled: true,
      projectId,
    } as {
      projectId: string;
      enabled: boolean;
      createdAt?: {
        $gt?: number,
        $lt?: number,
      };
    };
    let skipNum = 0;
    let limit = 100;
    if (pageSize != null && pageNum != null) {
      skipNum = (pageNum - 1) * pageSize;
      limit = pageSize;
    }
    if (startTime != null && endTime == null) {
      query.createdAt = { $gt: startTime, $lt: Date.now() };
    } else if (startTime != null && endTime != null) {
      query.createdAt = { $gt: startTime, $lt: endTime };
    }
    const rows = await this.projectVariableModel.find(query, { projectId: 0, createdAt: 0, updatedAt: 0, __v: 0 }).skip(skipNum).limit(limit);
    const total = await this.projectVariableModel.find(query).countDocuments();
    const result = {
      rows,
      total,
    };
    return result;
  }
  /**
   * 枚举方式获取变量
   */
  async getProjectVariableEnum(params: GetProjectVariableEnumDto) {
    const { projectId } = params;
    await this.commonControl.checkDocOperationPermissions(projectId);
    const result = await this.projectVariableModel.find({ projectId }, { name: 1, type: 1, value: 1 });
    return result;
  }
}
