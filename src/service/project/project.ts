import { Context, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AddProjectDto, AddMemberToProjectDto, ChangeMemberPermissionInProjectDto, DeleteProjectDto, DeleteMemberFromProjectDto, EditProjectDto, FilterProjectDto, GetProjectByKeywordDto, GetProjectFullInfoByIdDto, GetProjectInfoByIdDto, GetProjectListDto, GetProjectMembersByIdDto } from '../../types/dto/project/project.dto.js';
import { Project } from '../../entity/project/project.js';
import { Doc } from '../../entity/doc/doc.js';
import { LoginTokenInfo } from '../../types/types.js';
import { User } from '../../entity/security/user.js';
import { throwError } from '../../utils/utils.js';
import { CommonController } from '../../controller/common/common.js';
import lodash from 'lodash';
import { DocMindParams } from '../../entity/doc/doc_mind_params.js';
import { DocMindParamsServer } from '../doc/doc_mind_params.js';
import { DocPrefixServer } from '../doc/doc_prefix.js';
import { ProjectVariableService } from './project_variable.js';
import { ProjectRulesService } from './project_rules.js';
import { Group } from '../../entity/security/group.js';

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
  @InjectEntityModel(Group)
    groupModel: ReturnModelType<typeof Group>;
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
      name: this.ctx.tokenInfo.loginName,
      id: this.ctx.tokenInfo.id,
      type: 'user',
      permission: 'admin'
    });
    projectInfo.owner = {
      id: this.ctx.tokenInfo.id,
      name: this.ctx.tokenInfo.loginName
    };
    const result = await this.projectModel.create(projectInfo);
    const allUsers = members.filter(v => v.type === 'user').map(v => v.id).concat([this.ctx.tokenInfo.id]);
    const uniqueUserIds = Array.from(new Set(allUsers));
    await this.userModel.updateMany({ _id: { $in: uniqueUserIds } }, { $push: { couldVisitProjects: result._id.toString() } });
    return result._id;
  }
  /**
   * 给项目添加成员
   */
  async addMemberToProject(params: AddMemberToProjectDto) {
    const { projectId, name, type, permission, id } = params;
    const memberInfo = {
      name,
      type,
      id,
      permission,
    };
    const matchedProject = await this.projectModel.findOne({ _id: projectId }).lean();
    if (!matchedProject) {
      return throwError(1011, '项目不存在')
    }
    const members = matchedProject.members;
    const userMembers = members.filter(v => v.type === 'user');
    const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
    const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
    matchedGroups.forEach(group => {
      group.members.forEach(groupMember => {
        userMembers.push({
          name: groupMember.loginName,
          id: groupMember.userId,
          type: 'user',
          permission: groupMember.permission
        });
      })
    })
    const hasPermission = userMembers.filter(v => v.permission === 'admin' && v.id === this.ctx.tokenInfo.id).length > 0;
    if (!hasPermission) {
      return throwError(1012, '角色为管理员才允许修改权限')
    }
    await this.userModel.updateOne({ _id: id }, { $push: { couldVisitProjects: projectId } });
    await this.projectModel.findByIdAndUpdate({ _id: projectId }, {
      $push: { members: memberInfo }
    });
  }
  /**
   * 从项目中删除成员
   */
  async deleteMemberFromProject(params: DeleteMemberFromProjectDto) {
    const { projectId, id } = params;
    const isDeleteSelf = this.ctx.tokenInfo.id === id;
    const matchedProject = await this.projectModel.findOne({ _id: projectId }).lean();
    if (!matchedProject) {
      return throwError(1011, '项目不存在')
    }
    const members = matchedProject.members;
    const userMembers = members.filter(v => v.type === 'user');
    const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
    const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
    matchedGroups.forEach(group => {
      group.members.forEach(groupMember => {
        userMembers.push({
          name: groupMember.loginName,
          id: groupMember.userId,
          type: 'user',
          permission: groupMember.permission
        });
      })
    })
    const hasPermission = userMembers.filter(v => v.permission === 'admin' && v.id === this.ctx.tokenInfo.id).length > 0;
    const hasAdminUser = (userMembers.filter(v => v.permission === 'admin').length > 1) && isDeleteSelf; //删除自身时候，项目至少保留一个管理员

    if (!hasPermission) {
      return throwError(1012, '角色为管理员才允许修改权限')
    }
    if (!hasAdminUser) {
      return throwError(1013, '至少保留一个管理员')
    }
    await this.userModel.updateOne({ _id: id }, { $pull: { couldVisitProjects: projectId } });
    await this.projectModel.findByIdAndUpdate({ _id: projectId }, {
      $pull: {
        members: { id },
      }
    });
    return;
  }
  /**
   * 改变用户在项目中的权限
   */
  async changeMemberPermissionInProject(params: ChangeMemberPermissionInProjectDto) {
    const { projectId, id, permission } = params;
    const isChangeSelf = this.ctx.tokenInfo.id === id;
    const matchedProject = await this.projectModel.findOne({ _id: projectId }).lean();
    if (!matchedProject) {
      return throwError(1011, '项目不存在')
    }
    const members = matchedProject.members;
    const userMembers = members.filter(v => v.type === 'user');
    const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
    const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
    matchedGroups.forEach(group => {
      group.members.forEach(groupMember => {
        userMembers.push({
          name: groupMember.loginName,
          id: groupMember.userId,
          type: 'user',
          permission: groupMember.permission
        });
      })
    })
    const hasPermission = userMembers.filter(v => v.permission === 'admin' && v.id === this.ctx.tokenInfo.id).length > 0;
    const hasAdminUser = (userMembers.filter(v => v.permission === 'admin').length > 1) && isChangeSelf; //改变自身时候，项目至少保留一个管理员

    if (!hasPermission) {
      return throwError(1012, '角色为管理员才允许修改权限')
    }
    if (!hasAdminUser) {
      return throwError(1013, '至少保留一个管理员')
    }
    await this.projectModel.updateOne({ _id: projectId, 'members.userId': id }, {
      $set: { 'members.$.permission': permission }
    });
  }
  /**
   * 删除项目
   */
  async deleteProject(params: DeleteProjectDto) {
    const { ids } = params;
    for(let i = 0; i < ids.length; i ++) {
      await this.commonControl.checkDocOperationPermissions(ids[i]);
    }
    const delProjects = await this.projectModel.find({ _id: { $in: ids }}, { members: 1 });
    for (let i = 0; i < delProjects.length; i++) {
      const projectInfo = delProjects[i];
      const members = projectInfo.members;
      const userMembers = members.filter(v => v.type === 'user');
      const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
      const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
      matchedGroups.forEach(group => {
        group.members.forEach(groupMember => {
          userMembers.push({
            name: groupMember.loginName,
            id: groupMember.userId,
            type: 'user',
            permission: groupMember.permission
          });
        })
      })
      const hasPermission = userMembers.filter(v => v.permission === 'admin' && v.id === this.ctx.tokenInfo.id).length > 0;
      if (!hasPermission) {
        return throwError(1012, '角色为管理员才允许修改权限')
      }
    }
    const result = await this.projectModel.updateMany(
      { _id: { $in: ids }},
      { $set: { isEnabled: false }}
    );
    //同时删除每个用户可访问项目
    const members: string[] = []
    delProjects.forEach(projectInfo => {
      projectInfo.members.forEach(member => {
        members.push(member.id)
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
    const matchedProject = await this.projectModel.findOne({ _id }).lean();
    if (!matchedProject) {
      return throwError(1011, '项目不存在')
    }
    const members = matchedProject.members;
    const userMembers = members.filter(v => v.type === 'user');
    const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
    const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
    matchedGroups.forEach(group => {
      group.members.forEach(groupMember => {
        userMembers.push({
          name: groupMember.loginName,
          id: groupMember.userId,
          type: 'user',
          permission: groupMember.permission
        });
      })
    })
    const hasPermission = userMembers.filter(v => v.permission === 'admin' && v.id === this.ctx.tokenInfo.id).length > 0;
    if (!hasPermission) {
      return throwError(1012, '角色为管理员才允许修改权限')
    }
    await this.projectModel.findByIdAndUpdate({ _id }, updateDoc);
    return;
  }
  /**
   * 列表形式获取项目
   */
  async getProjectList(params: GetProjectListDto) {
    const { pageNum, pageSize, startTime, endTime, projectName } = params;
    const query = { isEnabled: true } as {
      projectName?: RegExp;
      isEnabled: boolean;
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
      query.projectName = new RegExp(lodash.escapeRegExp(projectName));
    }
    query.$or = [
      {
        'members.userId': this.ctx.tokenInfo.id
      }
    ];
    const tokenInfo = this.ctx.tokenInfo;
    const visitAndStar = await this.userModel.findOne({ _id: tokenInfo.id }, { recentVisitProjects: 1, starProjects: 1 }).lean();
    const result: {
      list: Omit<Project, 'isEnabled' | 'createdAt'>[];
      recentVisitProjects: string[];
      starProjects: string[];
    } = {
      list: [],
      recentVisitProjects: [],
      starProjects: [],
    };
    result.list = await this.projectModel.find(query, { isEnabled: 0, createdAt: 0 }).skip(skipNum).limit(limit).sort({ updatedAt: -1 });
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
      { _id, isEnabled: true },
      { createdAt: 0, updatedAt: 0, apidocs: 0, isEnabled: 0 }
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
        isEnabled: true
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
      { _id, isEnabled: true },
      { members: 1 }
    );
    return result.members;
  }
  /**
   * 以枚举方式获取项目
   */
  async getProjectEnum() {
    const query = {
      isEnabled: true
    } as {
      isEnabled: boolean;
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
      'item.url.path': new RegExp(lodash.escapeRegExp(url))
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
  /**
   * 根据关键字获取项目列表
   */
  async getProjectListByKeyword(params: GetProjectByKeywordDto) {
    const { keyword } = params;
    const query: {
      isEnabled: boolean;
      $or: Record<string, string>[]
    } = { isEnabled: true, $or: [] }
    const limit = 100;
    // if (projectName != null) {
    //   query.projectName = new RegExp(lodash.escapeRegExp(projectName));
    // }
    query.$or = [
      {
        'members.userId': this.ctx.tokenInfo.id
      }
    ];
    const allProjects = await this.projectModel.find(query, { isEnabled: 0, createdAt: 0 }).limit(limit).sort({ updatedAt: -1 }).lean();
    const projectIds = allProjects.map(v => v._id);

    const docs = await this.docModel.find({
      projectId: { $in: projectIds },
      'item.url.path': new RegExp(lodash.escapeRegExp(keyword))
    }, {
      projectId: 1,
    }).lean();

    const filteredProjects = allProjects.filter(project => {
      return docs.find(docInfo => docInfo.projectId === project._id.toString()) 
    });
    const tokenInfo = this.ctx.tokenInfo;
    const visitAndStar = await this.userModel.findOne({ _id: tokenInfo.id }, { recentVisitProjects: 1, starProjects: 1 }).lean();
    const result: {
      list: Omit<Project, 'isEnabled' | 'createdAt'>[];
      recentVisitProjects: string[];
      starProjects: string[];
    } = {
      list: [],
      recentVisitProjects: [],
      starProjects: [],
    };
    result.list = filteredProjects;
    result.recentVisitProjects = visitAndStar.recentVisitProjects || [];
    result.starProjects = visitAndStar.starProjects || [];
    return result;
  }
}
