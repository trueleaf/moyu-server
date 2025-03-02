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
  // 校验用户权限
  private async checkGroupAdminPermission(group: Group, userId: string) {
    const member = group.members.find(m => m.userId === userId);
    if (!member) {
      throwError(4001, '用户不在团队中');
    }
    // 允许 admin 权限修改
    const hasPermission = member.permission === 'admin';
    if (!hasPermission) {
      throwError(4001, '用户无修改权限');
    }
  }
  // 校验组名唯一性
  private async validateGroupNameUnique(name: string, excludeId?: string) {
    const matchedGroup = await this.groupModel.findOne({ groupName: name, _id: { $ne: excludeId } });
    if (matchedGroup) {
      throwError(1003, '组名称已存在');
    }
  }
  // 更新组信息
  async updateGroup(id: string, params: {
    groupName?: string;
    description?: string;
    isEnabled?: boolean;
  }) {
    // 1. 获取组信息
    const group = await this.getGroupById(id);
    // 2. 权限校验
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    // 3. 组名校验
    await this.validateGroupNameUnique(params.groupName, id);
    // 4. 更新字段
    const updateObj: Partial<Group> = {}
    if (params.groupName) updateObj.groupName = params.groupName;
    if (params.description !== undefined) updateObj.description = params.description;
    if (params.isEnabled !== undefined) updateObj.isEnabled = params.isEnabled;

    return await this.groupModel.findByIdAndUpdate({ _id: id }, updateObj);
  }

  // 获取组详情
  async getGroupById(id: string) {
    const group = await this.groupModel.findOne({ _id: id });
    if (!group) {
      throwError(1003, '组不存在');
    };
    return group;
  }

  // 分页查询组列表
  async getGroupList(query: {
    page?: number;
    pageSize?: number;
    groupName?: string;
    creatorId?: string;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    
    console.log(page, pageSize)

    return { };
  }

  // 添加组成员
  async addMember(groupId: string, member: {
    userId: string;
    userName: string;
    permission: 'readOnly' | 'readAndWrite' | 'admin';
    expireAt?: Date;
  }) {
    const group = await this.getGroupById(groupId);
    
    // 检查是否已存在
    if (group.members.some(m => m.userId === member.userId)) {
      throw new Error('用户已在组中');
    }

    group.members.push(member);
    return await this.groupModel.create(group);
  }

  // 移除组成员
  async removeMember(groupId: string, userId: string) {
    const group = await this.getGroupById(groupId);
    const index = group.members.findIndex(m => m.userId === userId);
    
    if (index === -1) throw new Error('用户不在组中');
    
    group.members.splice(index, 1);
    return await this.groupModel.create(group);
  }

  // 更新成员权限
  async updateMemberPermission(groupId: string, userId: string, permission: 'readOnly' | 'readAndWrite' | 'admin') {
    const group = await this.getGroupById(groupId);
    const member = group.members.find(m => m.userId === userId);
    
    if (!member) throw new Error('用户不在组中');
    
    member.permission = permission;
    return await this.groupModel.create(group);
  }
}