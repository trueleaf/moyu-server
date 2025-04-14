import { Context, Inject, Provide } from '@midwayjs/core';
import { Group } from '../../entity/security/group.js';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { throwError } from '../../utils/utils.js';
import { LoginTokenInfo } from '../../types/types.js';
import { CreateGroupDTO, UpdateGroupDTO } from '../../types/dto/security/group.dto.js';

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
  async createGroup(params: CreateGroupDTO) {
    const creator = {
      userId: this.ctx.tokenInfo.id,
      userName: this.ctx.tokenInfo.loginName
    };
    const { groupName, description, members } = params;
    if (await this.groupModel.findOne({ groupName })) {
      throwError(1003, '组名称已存在');
    }
    const newGroup = new Group();
    newGroup.groupName = groupName;
    newGroup.description = description;
    newGroup.creator = {
      userId: creator.userId,
      userName: creator.userName
    };
    newGroup.updator = {
      userId: creator.userId,
      userName: creator.userName
    };
    newGroup.members = [{
      userId: creator.userId,
      loginName: creator.userName,
      permission: 'admin' // 创建者默认拥有admin权限
    }, ...members];
    await this.groupModel.create(newGroup);
    return
  }

  // 更新组信息
  async updateGroup(params: UpdateGroupDTO) {
    const { _id, groupName, description, isEnabled } = params;
    const updator = {
      userId: this.ctx.tokenInfo.id,
      userName: this.ctx.tokenInfo.loginName
    };
    // 获取组信息
    const group = await this.groupModel.findOne({ _id, isEnabled: true });
    if (!group) {
      throwError(1003, '组不存在');
    };
    // 权限校验
    await this.checkGroupAdminPermission(group, this.ctx.tokenInfo.id);
    // 组名校验
    await this.validateGroupNameUnique(groupName, _id);
    // 更新字段
    const updateObj: Partial<Group> = {}
    if (groupName) updateObj.groupName = groupName;
    if (description !== undefined) updateObj.description = description;
    if (isEnabled !== undefined) updateObj.isEnabled = isEnabled;
    updateObj.updator = updator;
    return await this.groupModel.findByIdAndUpdate({ _id }, updateObj);
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
  async getGroupList() {
    const userId = this.ctx.tokenInfo.id;
    //分页查找
    const result = await this.groupModel.find({ isEnabled: true, members: {
      $elemMatch: {
        userId
      }
    } }, { groupName: 1, description: 1, creator: 1, updator: 1, members: 1, createdAt: 1, updatedAt: 1 }).sort({ updatedAt: -1 });
    return result;
  }

  // 添加组成员
  async addMember(groupId: string, member: {
    userId: string;
    loginName: string;
    permission: 'readOnly' | 'readAndWrite' | 'admin';
    expireAt?: Date;
  }) {
    const updator = {
      userId: this.ctx.tokenInfo.id,
      userName: this.ctx.tokenInfo.loginName
    };
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
    group.updator = updator;
    await this.groupModel.create(group);
    return 
  }

  // 移除组成员
  async removeMember(groupId: string, userId: string) {
    const group = await this.groupModel.findOne({ _id: groupId, isEnabled: true });
    const updator = {
      userId: this.ctx.tokenInfo.id,
      userName: this.ctx.tokenInfo.loginName
    };
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
    group.updator = updator;
    return await this.groupModel.create(group);
  }

  // 更新成员权限
  async updateMemberPermission(groupId: string, userId: string, permission: 'readOnly' | 'readAndWrite' | 'admin') {
    const updator = {
      userId: this.ctx.tokenInfo.id,
      userName: this.ctx.tokenInfo.loginName
    };
    const operatorId = this.ctx.tokenInfo.id;
    const group = await this.groupModel.findOne({ _id: groupId, isEnabled: true });
    const targetUser = group.members.find(m => m.userId === userId);
    const operator = group.members.find(m => m.userId === operatorId);
    if (!operator || operator.permission !== 'admin') {
      throwError(1009, '暂无操作权限')
    }
    if (!targetUser) {
      throwError(1010, '被操作成员不存在')
    }
    // 检查是否最后一个管理员
    const adminCount = group.members.filter(m => 
      m.permission === 'admin'
    ).length;
    const targetUserIsOperator = operatorId === userId;
    if (adminCount <= 1 && targetUserIsOperator && permission !== 'admin') {
      throwError(1008,'组内必须至少保留一个管理员');
    }
    targetUser.permission = permission;
    group.updator = updator;
    return group.save();
  }
}