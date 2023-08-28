import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { FilterQuery } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AddProjectDto, AddUserToProjectDto, ChangeUserPermissionInProjectDto, DeleteProjectDto, DeleteUserFromProjectDto, EditProjectDto, FilterProjectDto, GetProjectFullInfoByIdDto, GetProjectInfoByIdDto, GetProjectListDto, GetProjectMembersByIdDto } from '../../types/dto/project/project.dto';
import { Project } from '../../entity/project/project';
import { Doc } from '../../entity/doc/doc';
import { User } from '../../entity/security/user';
import { LoginTokenInfo } from '../../types/types';
import { throwError } from '../../utils/utils';
import { CommonController } from '../../controller/common/common';
import { escapeRegExp } from 'lodash';
import { DocMindParams } from '../../entity/doc/doc_mind_params';
import { DocMindParamsServer } from '../doc/doc_mind_params';
import { DocPrefixServer } from '../doc/doc_prefix';
import { ProjectVariableService } from './project_variable';
import { ProjectRulesService } from './project_rules';

@Provide()
export class ProjectService {
  @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
  @InjectEntityModel(DocMindParams)
    docMindParamsModel: ReturnModelType<typeof DocMindParams>;
  @InjectEntityModel(Doc)
    docModel: ReturnModelType<typeof Doc>;
  @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;
  @Inject()
    docMindParamsService: DocMindParamsServer;
  @Inject()
    projectRulesService: ProjectRulesService;
  @Inject()
    projectVariableService: ProjectVariableService;
  @Inject()
    docPrefixService: DocPrefixServer;
  @Inject()
    commonControl: CommonController
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 新增项目
   */
  async addProject(params: AddProjectDto) {
    const { projectName, remark, members = [] } = params;
    const projectInfo: Partial<Project> = {};
    projectInfo.projectName = projectName;
    projectInfo.remark = remark;
    projectInfo.members = members;
    //创建者默认为管理员
    projectInfo.members.unshift({
      loginName: this.ctx.tokenInfo.loginName,
      realName: this.ctx.tokenInfo.realName,
      userId: this.ctx.tokenInfo.id,
      permission: 'admin'
    });
    projectInfo.owner = {
      id: this.ctx.tokenInfo.id,
      name: this.ctx.tokenInfo.realName || this.ctx.tokenInfo.loginName
    };
    const result = await this.projectModel.create(projectInfo);
    const allUsers = members.map(v => v.userId).concat([this.ctx.tokenInfo.id]);
    const uniqueUsers = Array.from(new Set(allUsers));
    await this.projectModel.updateMany({ _id: { $in: uniqueUsers } }, { $push: { couldVisitProjects: result._id.toString() } });
    return result._id;
  }
  /**
   * 给项目添加用户
   */
  async addUserToProject(params: AddUserToProjectDto) {
    const { projectId, loginName, realName, permission, userId } = params;
    const userInfo = {
      loginName,
      realName,
      userId,
      permission,
    };
    //是否拥有权限
    const query: FilterQuery<{
      _id: string;
      $or: {
        members: {
          $elemMatch: {
            userId: string;
            permission: 'readOnly' | 'readAndWrite' | 'admin'
          }
        }
      }[]
    }> = {
      _id: projectId,
    };
    query.$or = [
      {
        members: {
          $elemMatch: {
            userId: this.ctx.tokenInfo.id,
            permission: 'admin',
          }
        }
      }
    ];
    const hasPermission = await this.projectModel.findOne(query);
    if (!hasPermission) {
      return throwError(4002, '角色为管理员才允许修改权限')
    }
    await this.userModel.updateOne({ _id: userId }, { $push: { couldVisitProjects: projectId } });
    await this.projectModel.findByIdAndUpdate({ _id: projectId }, {
      $push: { members: userInfo }
    });
  }
  /**
   * 从项目中删除用户
   */
  async deleteUserFromProject(params: DeleteUserFromProjectDto) {
    const { projectId, userId } = params;
    const isDeleteSelf = userId === this.ctx.tokenInfo.id;
    //是否拥有权限
    const query: FilterQuery<{
      _id: string;
      $or: {
        members: {
          $elemMatch: {
            userId: string;
            permission: 'readOnly' | 'readAndWrite' | 'admin'
          }
        }
      }[]
    }> = {
      _id: projectId,
    };
    query.$or = [
      {
        members: {
          $elemMatch: {
            userId: this.ctx.tokenInfo.id,
            permission: 'admin',
          }
        }
      }
    ];
    //是否为admin，只有admin拥有删除权限
    const hasPermission = await this.projectModel.findOne(query);
    if (!hasPermission && !isDeleteSelf) {
      return throwError(4002, '管理员才允许删除用户')
    }
    //一个团队至少保留一个管理员
    const projectInfo = await this.projectModel.findOne({ _id: projectId }, { members: 1 });
    const members = projectInfo.members;
    const hasAdmin = members.find((memberInfo) => {
      if (memberInfo.userId !== userId && memberInfo.permission === 'admin') {
        return true
      }
      return false;
    });
    if (!hasAdmin) {
      return throwError(4002, '一个团队至少保留一个管理员')
    }
    await this.userModel.updateOne({ _id: userId }, { $pull: { couldVisitProjects: projectId } });
    await this.projectModel.findByIdAndUpdate({ _id: projectId }, {
      $pull: {
        members: { userId },
      }
    });
    return;
  }
  /**
   * 改变用户在项目中的权限
   */
  async changeUserPermissionInProject(params: ChangeUserPermissionInProjectDto) {
    const { projectId, userId, permission } = params;
    //是否拥有权限
    const query: FilterQuery<{
      _id: string;
      $or: {
        members: {
          $elemMatch: {
            userId: string;
            permission: 'readOnly' | 'readAndWrite' | 'admin'
          }
        }
      }[]
    }> = {
      _id: projectId,
    };
    query.$or = [
      {
        members: {
          $elemMatch: {
            userId: this.ctx.tokenInfo.id,
            permission: 'admin',
          }
        }
      }
    ];
    const hasPermission = await this.projectModel.findOne(query);
    if (!hasPermission) {
      return throwError(4002, '管理员才允许修改权限')
    }
    //一个团队至少保留一个管理员
    const projectInfo = await this.projectModel.findOne({ _id: projectId }, { members: 1 });
    const members = projectInfo.members;
    const hasAdmin = members.find((memberInfo) => {
      if (permission === 'admin') {
        return true;
      }
      if (memberInfo.userId !== userId && memberInfo.permission === 'admin') {
        return true
      }
      return false;
    });
    if (!hasAdmin) {
      return throwError(4002, '一个团队至少保留一个管理员')
    }
    await this.projectModel.updateOne({ _id: projectId, 'members.userId': userId }, {
      $set: { 'members.$.permission': permission }
    });
  }
  /**
   * 删除项目
   */
  async deleteProject(params: DeleteProjectDto) {
    const { ids } = params;
    const userInfo = this.ctx.tokenInfo;
    for(let i = 0; i < ids.length; i ++) {
      await this.commonControl.checkDocOperationPermissions(ids[i]);
    }
    const delProjects = await this.projectModel.find({ _id: { $in: ids }}, { members: 1 });
    for (let i = 0; i < delProjects.length; i++) {
      const projectInfo = delProjects[i];
      const matchedPermissionInfo = projectInfo.members.find(memberInfo => memberInfo.userId === userInfo.id)
      if (matchedPermissionInfo.permission !== 'admin') {
        return throwError(4002, '管理员才允许删除项目')
      }
    }
    const result = await this.projectModel.updateMany(
      { _id: { $in: ids }},
      { $set: { enabled: false }}
    );
    //同时删除每个用户可访问项目
    const members: string[] = []
    delProjects.forEach(projectInfo => {
      projectInfo.members.forEach(member => {
        members.push(member.userId)
      })
    })
    await this.userModel.updateMany({ _id: { $in: members } }, { $pull: { couldVisitProjects: { $in: ids } } });
    return result;
  }
  /**
   * 修改项目
   */
  async editProject(params: EditProjectDto) {
    const { _id, projectName, remark } = params;
    const updateDoc: Partial<Project> = {};
    if (projectName) {
      updateDoc.projectName = projectName;
    }
    if (remark) {
      updateDoc.remark = remark;
    }
    //是否拥有权限
    const query: FilterQuery<{
      _id: string;
      $or: {
        members: {
          $elemMatch: {
            userId: string;
            permission: 'readOnly' | 'readAndWrite' | 'admin'
          }
        }
      }[]
    }> = {
      _id,
    };
    query.$or = [
      {
        members: {
          $elemMatch: {
            userId: this.ctx.tokenInfo.id,
            permission: 'admin',
          }
        }
      }
    ];
    const hasPermission = await this.projectModel.findOne(query);
    if (!hasPermission) {
      return throwError(4002, '暂无权限')
    }
    await this.projectModel.findByIdAndUpdate({ _id }, updateDoc);
    return;
  }
  /**
   * 列表形式获取项目
   */
  async getProjectList(params: GetProjectListDto) {
    const { pageNum, pageSize, startTime, endTime, projectName } = params;
    const query = { enabled: true } as {
      projectName?: RegExp;
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
    if (projectName != null) {
      query.projectName = new RegExp(escapeRegExp(projectName));
    }
    query.$or = [
      {
        'members.userId': this.ctx.tokenInfo.id
      }
    ];
    const tokenInfo = this.ctx.tokenInfo;
    const visitAndStar = await this.userModel.findOne({ _id: tokenInfo.id }, { recentVisitProjects: 1, starProjects: 1 }).lean();
    const result: {
      list: Omit<Project, 'enabled' | 'createdAt'>[];
      recentVisitProjects: string[];
      starProjects: string[];
    } = {
      list: [],
      recentVisitProjects: [],
      starProjects: [],
    };
    result.list = await this.projectModel.find(query, { enabled: 0, createdAt: 0 }).skip(skipNum).limit(limit).sort({ updatedAt: -1 });
    result.recentVisitProjects = visitAndStar.recentVisitProjects || [];
    result.starProjects = visitAndStar.starProjects || [];
    return result;
  }
  /**
   * 根据id获取项目基本信息
   */
  async getProjectInfoById(params: GetProjectInfoByIdDto) {
    const { _id } = params;
    await this.commonControl.checkDocOperationPermissions(_id);
    const result = await this.projectModel.findById(
      { _id, enabled: true },
      { createdAt: 0, updatedAt: 0, apidocs: 0, enabled: 0 }
    );
    return result;
  }
  /**
   * 根据id获取项目完整信息
   */
  async getProjectFullInfoById(params: GetProjectFullInfoByIdDto) {
    const { _id } = params;
    await this.commonControl.checkDocOperationPermissions(_id);
    const mindParams = await this.docMindParamsService.geMindParams({ projectId: _id });
    const hosts = await this.docPrefixService.getDocPrefixEnum({ projectId: _id });
    const variables = await this.projectVariableService.getProjectVariableEnum({ projectId: _id });
    const rules = await this.projectRulesService.getProjectRulesById({ projectId: _id });
    const projectInfo = await this.projectModel.findById(
      {
        _id,
        enabled: true
      },
      {
        projectName: 1,
      },
    );
    const result = {
      mindParams,
      projectName: projectInfo.projectName,
      _id: projectInfo._id,
      hosts,
      variables,
      rules,
    }
    return result;
  }
  /**
   * 根据id获取项目成员信息
   */
  async getProjectMembersById(params: GetProjectMembersByIdDto) {
    const { _id } = params;
    await this.commonControl.checkDocOperationPermissions(_id);
    const result = await this.projectModel.findById(
      { _id, enabled: true },
      { members: 1 }
    );
    return result.members;
  }
  /**
   * 以枚举方式获取项目
   */
  async getProjectEnum() {
    const query = {
      enabled: true
    } as {
      enabled: boolean;
      $or: Record<string, string>[]
    };
    //是否为创建者或者为成员
    query.$or = [
      {
        'members.userId': this.ctx.tokenInfo.id
      }
    ];
    const limit = 100;
    const result = await this.projectModel.find(query, { projectName: 1 }).limit(limit);
    return result;
  }
  /**
   * 根据项目信息过滤项目
   */
  async filterProject(params: FilterProjectDto) {
    const { url } = params;
    const userId = this.ctx.tokenInfo.id;
    const userInfo = await this.userModel.findOne({ _id: userId }, { couldVisitProjects: 1 });
    const docs = await this.docModel.find({
      projectId: { $in: userInfo.couldVisitProjects },
      'item.url.path': new RegExp(escapeRegExp(url))
    }, {
      'info.name': 1,
      'item.url.path': 1,
      'item.method': 1,
      projectId: 1,
    }).lean();
    const result = docs.map(v => {
      return {
        projectId: v.projectId,
        path: v.item.url.path,
        name: v.info.name,
        method: v.item.method,
      }
    })
    return result
  }
}
