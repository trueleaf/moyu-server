import { Rule, RuleType } from '@midwayjs/validate';
import { TableSearchParams } from '../common/common.dto';

/**
 * 新增项目
 */
export class AddProjectDto {
  /**
   * 项目名称
   */
  @Rule(RuleType.string().required())
    projectName: string;
  /**
   * 备注
   */
  @Rule(RuleType.string())
    remark: string;
  /**
   * 用户列表
   */
  @Rule(RuleType.array().items(RuleType.object().keys({
    userId: RuleType.string(),
    loginName: RuleType.string(),
    realName: RuleType.string(),
    permission: RuleType.string().valid('readOnly', 'readAndWrite', 'admin'),
  })))
    members: {
      userId: string;
      loginName: string;
      realName: string;
      permission: 'readOnly' | 'readAndWrite' | 'admin';
    }[];
}
/**
 * 给项目添加用户
 */
export class AddUserToProjectDto {
  /**
   * 用户id
   */
  @Rule(RuleType.string().required())
    userId: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 用户名称
   */
  @Rule(RuleType.string().required())
    loginName: string;
  /**
   * 真实姓名
   */
  @Rule(RuleType.string())
    realName: string;
  /**
   * 用户权限
   */
  @Rule(RuleType.string().valid('readOnly', 'readAndWrite', 'admin'))
    permission: string;
}
/**
 * 从项目中删除用户
 */
export class DeleteUserFromProjectDto {
  /**
   * 用户id
   */
  @Rule(RuleType.string().required())
    userId: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}

/**
 * 删除项目
 */
export class DeleteProjectDto {
  /**
   * 项目id集合
   */
  @Rule(RuleType.array().items(RuleType.string()))
    ids: string[];
}
/**
 * 修改项目
 */
export class EditProjectDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 项目名称
   */
  @Rule(RuleType.string())
    projectName: string;
  /**
   * 备注
   */
  @Rule(RuleType.string())
    remark: string;
}
/**
 * 改变用户在项目中的权限
 */
export class ChangeUserPermissionInProjectDto {
  /**
   * 用户id
   */
  @Rule(RuleType.string().required())
    userId: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 权限
   */
  @Rule(RuleType.string().valid('readOnly', 'readAndWrite', 'admin'))
    permission: string;
}

/**
 * 列表形式获取项目
 */
export class GetProjectListDto extends TableSearchParams {
  /**
   * 项目名称
   */
  @Rule(RuleType.string())
    projectName: string;
  // /**
  //  * 项目类型
  //  */
  // @Rule(RuleType.string())
  //   projectType: string;
}

/**
 * 根据id获取项目基本信息
 */
export class GetProjectInfoByIdDto {
  /**
   * 项目id
   */
  @Rule(RuleType.number().required())
    _id: string;
}
/**
 * 根据id获取项目完整信息
 */
export class GetProjectFullInfoByIdDto {
  /**
   * 项目id
   */
  @Rule(RuleType.number().required())
    _id: string;
}
/**
 * 根据id获取项目成员信息
 */
export class GetProjectMembersByIdDto {
  /**
   * 项目id
   */
  @Rule(RuleType.number().required())
    _id: string;
}
/**
 * 根据项目信息过滤项目
 */
export class FilterProjectDto {
  /**
   * 项目内接口url
   */
  @Rule(RuleType.number())
    url: string;
}
