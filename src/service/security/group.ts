import { Context, Inject, Provide } from '@midwayjs/core';
import { Group } from '../../entity/security/group.js';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { throwError } from '../../utils/utils.js';
import { LoginTokenInfo } from '../../types/types.js';

@Provide()
export class GroupService {
  @InjectEntityModel(Group)
    groupModel: ReturnModelType<typeof Group>;
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };

  // 校验用户是否存在管理员权限
  private async checkGroupAdminPermission(group: Group, userId: string) {
    const member = group.members.find(m => m.userId === userId);
    if (!member) {
      throwError(4001, '用户不在团队中');
    }
    // 允许 admin 权限修改
    const hasPermission = member.permission === 'admin';
    if (!hasPermission) {
      throwError(4001, '用户无权限');
    }
  }
  // 校验组名唯一性
  private async validateGroupNameUnique(name: string, excludeId?: string) {
    const matchedGroup = await this.groupModel.findOne({ groupName: name, _id: { $ne: excludeId } });
    if (matchedGroup) {
      throwError(1003, '组名称已存在');
    }
  }
  // 创建组
  async createGroup(creator: { userId: string; userName: string }, params: {
    groupName: string;
    description?: string;
  }) {
    if (await this.groupModel.findOne({ groupName: params.groupName })) {
      throwError(1003, '组名称已存在');
    }
    const newGroup = new Group();
    newGroup.groupName = params.groupName;
    newGroup.description = params.description;
    newGroup.creator = {
      userId: creator.userId,
      userName: creator.userName
    };
    newGroup.members = [{
      userId: creator.userId,
      userName: creator.userName,
      permission: 'admin' // 创建者默认拥有admin权限
    }];
    await this.groupModel.create(newGroup);
    return
  }

  // 更新组信息
  async updateGroup(id: string, params: {
    groupName?: string;
    description?: string;
    isEnabled?: boolean;
  }) {
    // 获取组信息
    const group = await this.groupModel.findOne({ _id: id, isEnabled: true });
    if (!group) {
      throwError(1003, '组不存在');
    };
    // 权限校验
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    // 组名校验
    await this.validateGroupNameUnique(params.groupName, id);
    // 更新字段
    const updateObj: Partial<Group> = {}
    if (params.groupName) updateObj.groupName = params.groupName;
    if (params.description !== undefined) updateObj.description = params.description;
    if (params.isEnabled !== undefined) updateObj.isEnabled = params.isEnabled;

    return await this.groupModel.findByIdAndUpdate({ _id: id }, updateObj);
  }

  // 获取组详情
  async getGroupById(id: string) {
    const group = await this.groupModel.findOne({ _id: id, isEnabled: true }, { groupName: 1, description: 1, creator: 1, members: 1 });
    if (!group) {
      throwError(1003, '组不存在');
    };
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    return group;
  }

  // 分页查询组列表
  async getGroupList(query: {
    pageNum?: number;
    pageSize?: number;
  }) {
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;
    //分页查找
    const rows = await this.groupModel.find({ isEnabled: true }, { groupName: 1, description: 1, creator: 1, members: 1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const total =  await this.groupModel.countDocuments({ isEnabled: true });
    return {
      rows,
      total
    };
  }

  // 添加组成员
  async addMember(groupId: string, member: {
    userId: string;
    userName: string;
    permission: 'readOnly' | 'readAndWrite' | 'admin';
    expireAt?: Date;
  }) {
    const group = await this.groupModel.findOne({ _id: groupId, isEnabled: true });
    if (!group) {
      throwError(1003, '组不存在');
    };
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    // 检查是否已存在
    if (group.members.some(m => m.userId === member.userId)) {
      throwError(1003, '用户已存在组内');
    }
    group.members.push(member);
    await this.groupModel.create(group);
    return 
  }

  // 移除组成员
  async removeMember(groupId: string, userId: string) {
    const group = await this.groupModel.findOne({ _id: groupId, isEnabled: true });
    if (!group) {
      throwError(1003, '组不存在');
    };
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    // 检查是否最后一个管理员
    const adminCount = group.members.filter(m => 
      m.permission === 'admin'
    ).length;
    const target = group.members.find(m => m.userId === userId);
    if (target?.permission === 'admin' && adminCount <= 1) {
      throwError(1003, '至少保留一个管理员');
    }
    const index = group.members.findIndex(m => m.userId === userId);
    if (index === -1) {
      throwError(1003, '用户不在组中');
    };
    group.members.splice(index, 1);
    return await this.groupModel.create(group);
  }

  // 更新成员权限
  async updateMemberPermission(groupId: string, userId: string, permission: 'readOnly' | 'readAndWrite' | 'admin') {
    const group = await this.groupModel.findOne({ _id: groupId, isEnabled: true });
    const member = group.members.find(m => m.userId === userId);
    if (!member) throw new Error('成员不存在');
    
    // 检查是否最后一个管理员
    if (member.permission === 'admin' && permission !== 'admin') {
      const adminCount = group.members.filter(m => 
        m.permission === 'admin'
      ).length;
      if (adminCount <= 1) throw new Error('组内必须至少保留一个管理员');
    }
    
    member.permission = permission;
    return group.save();
  }
}