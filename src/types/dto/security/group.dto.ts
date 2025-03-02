import { Rule, RuleType } from '@midwayjs/validate';

// 创建组 DTO
export class CreateGroupDTO {
  @Rule(RuleType.string().required().max(50).error(new Error('组名称不能为空且不超过50字符')))
  groupName: string;

  @Rule(RuleType.string().max(255).error(new Error('描述不超过255字符')))
  description?: string;
}

// 更新组 DTO
export class UpdateGroupDTO {
  @Rule(RuleType.string().required().error(new Error('组ID不能为空')))
  id: string;

  @Rule(RuleType.string().max(50).optional().error(new Error('组名称不超过50字符')))
  groupName?: string;

  @Rule(RuleType.string().max(200).optional().error(new Error('描述不超过200字符')))
  description?: string;

  @Rule(RuleType.boolean().optional().error(new Error('启用状态需为布尔值')))
  isEnabled?: boolean;
}

// 分页查询 DTO
export class PaginationDTO {
  @Rule(RuleType.number().min(1).default(1).error(new Error('页码需大于0')))
  page?: number;

  @Rule(RuleType.number().min(1).max(100).default(10).error(new Error('每页数量1-100')))
  pageSize?: number;

  @Rule(RuleType.string().max(50).optional().error(new Error('组名称不超过50字符')))
  groupName?: string;

  @Rule(RuleType.string().optional().error(new Error('创建者ID需为字符串')))
  creatorId?: string;
}

// 添加成员 DTO
export class AddMemberDTO {
  @Rule(RuleType.string().required().error(new Error('组ID不能为空')))
  groupId: string;

  @Rule(RuleType.string().required().error(new Error('用户ID不能为空')))
  userId: string;

  @Rule(RuleType.string().required().error(new Error('用户名不能为空')))
  userName: string;

  @Rule(
    RuleType.string()
      .valid('readOnly', 'readAndWrite', 'admin')
      .required()
      .error(new Error('权限类型不合法'))
  )
  permission: 'readOnly' | 'readAndWrite' | 'admin';

  @Rule(RuleType.date().min(new Date()).optional().error(new Error('过期时间需为未来时间')))
  expireAt?: Date;
}

// 移除成员 DTO
export class RemoveMemberDTO {
  @Rule(RuleType.string().required().error(new Error('组ID不能为空')))
  groupId: string;

  @Rule(RuleType.string().required().error(new Error('用户ID不能为空')))
  userId: string;
}

// 更新权限 DTO
export class UpdatePermissionDTO {
  @Rule(RuleType.string().required().error(new Error('组ID不能为空')))
  groupId: string;

  @Rule(RuleType.string().required().error(new Error('用户ID不能为空')))
  userId: string;

  @Rule(
    RuleType.string()
      .valid('readOnly', 'readAndWrite', 'admin')
      .required()
      .error(new Error('权限类型不合法'))
  )
  permission: 'readOnly' | 'readAndWrite' | 'admin';
}

// 组详情查询 DTO
export class GroupDetailDTO {
  @Rule(RuleType.string().required().error(new Error('组ID不能为空')))
  id: string;
}