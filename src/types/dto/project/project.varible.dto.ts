import { Rule, RuleType } from '@midwayjs/validate';
import { TableSearchParams } from '../common/common.dto';

/**
 * 新增变量
 */
export class AddProjectVariableDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 变量名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 变量类型
   */
  @Rule(RuleType.string().valid('string', 'number', 'boolean', 'array', 'object').required())
    type: string;
  /**
   * 变量值
   */
  @Rule(RuleType.string().required())
    value: string;
}
/**
 * 修改项目变量
 */
export class EditProjectVariableDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 变量id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 变量名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 变量类型
   */
  @Rule(RuleType.string().valid('string', 'number', 'boolean', 'array', 'object').required())
    type: string;
  /**
   * 变量值
   */
  @Rule(RuleType.string().required())
    value: string;
}

/**
 * 删除变量
 */
export class DeleteProjectVariableDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 需要删除id集合
   */
  @Rule(RuleType.array().items(RuleType.string()).required())
    ids: string;
}
/**
 * 获取变量列表
 */
export class GetProjectVariableListDto extends TableSearchParams {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}
/**
 * 枚举方式获取变量列表
 */
export class GetProjectVariableEnumDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}

