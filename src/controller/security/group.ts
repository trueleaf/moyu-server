import { Controller, Post, Get, Put, Del, Query, Body,Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

import {
  CreateGroupDTO,
  UpdateGroupDTO,
  PaginationDTO,
  AddMemberDTO,
  RemoveMemberDTO,
  UpdatePermissionDTO,
  GroupDetailDTO
} from '../../types/dto/security/group.dto.js';
import { GroupService } from '../../service/security/group.js';
import { LoginTokenInfo } from '../../types/types.js';

@Controller('/api/group')
export class GroupController {
  @Inject()
  ctx: Context & { tokenInfo: LoginTokenInfo };

  @Inject()
  groupService: GroupService;

  // 创建组
  @Post('/create')
  async createGroup(@Body() params: CreateGroupDTO) {
    return this.groupService.createGroup(params);
  }

  // 更新组信息
  @Put('/update')
  async updateGroup(@Body() params: UpdateGroupDTO) {
    return this.groupService.updateGroup(params.id, params);
  }

  // 获取组详情
  @Get('/detail')
  async getGroupDetail(@Query() query: GroupDetailDTO) {
    return this.groupService.getGroupById(query.id);
  }

  // 分页查询组列表
  @Get('/list')
  async getGroupList(@Query() query: PaginationDTO) {
    return this.groupService.getGroupList(query);
  }

  // 添加组成员
  @Post('/member/add')
  async addMember(@Body() params: AddMemberDTO) {
    return this.groupService.addMember(params.groupId, {
      userId: params.userId,
      loginName: params.loginName,
      permission: params.permission,
      expireAt: params.expireAt
    });
  }

  // 移除组成员
  @Del('/member/remove')
  async removeMember(@Body() params: RemoveMemberDTO) {
    return this.groupService.removeMember(params.groupId, params.userId);
  }

  // 更新成员权限
  @Put('/member/permission')
  async updateMemberPermission(@Body() params: UpdatePermissionDTO) {
    return this.groupService.updateMemberPermission(
      params.groupId,
      params.userId,
      params.permission
    );
  }
}