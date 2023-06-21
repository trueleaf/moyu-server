import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 新增客户端菜单
 */
export class AddClientMenuDto {
  /**
   * 菜单名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 前端跳转路径
   */
  @Rule(RuleType.string().required())
    path: string;
  /**
   * 路由类型( inline前端自己路由  link外部链接 )
   */
  @Rule(RuleType.string().valid('link', 'inline'))
    type: 'link' | 'inline';
  /**
   * 父级菜单id
   */
  @Rule(RuleType.string())
    pid: string;
}
