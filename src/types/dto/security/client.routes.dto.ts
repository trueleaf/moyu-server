import { Rule, RuleType } from '@midwayjs/validate';
import { TableSearchParams } from '../common/common.dto';

/**
 * 新增前端路由
 */
export class AddClientRoutesDto {
  /**
   * 路由名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 前端路由路径
   */
  @Rule(RuleType.string().required())
    path: string;
  /**
   * 分组名称
   */
  @Rule(RuleType.string())
    groupName: string;
}
/**
 * 修改前端路由
 */
export class EditClientMenuDto {
  /**
   * 路由id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 路由名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 前端路由路径
   */
  @Rule(RuleType.string().required())
    path: string;
  /**
   * 分组名称
   */
  @Rule(RuleType.string())
    groupName: string;
}
/**
 * 删除前端路由
 */
export class DeleteClientRoutesDto {
  /**
   * 需要删除的路由id集合
   */
  @Rule(RuleType.array().items(RuleType.string()).required())
    ids: string[];
}
/**
 * 批量修改前端路由分组名称
 */
export class ChangeGroupNameByIds {
  /**
   * 需要修改的路由id集合
   */
  @Rule(RuleType.array().items(RuleType.string()).required())
    ids: string[];
  /**
   * 分组名称
   */
  @Rule(RuleType.string())
    groupName: string;
}

/**
 * 以列表形式获取客户端路由
 */
export class GetClientRoutesListDto extends TableSearchParams {}
