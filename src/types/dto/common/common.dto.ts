import { Rule, RuleType } from '@midwayjs/validate';

export class TableSearchParams {
  /**
   * 页码
   */
  @Rule(RuleType.number())
    pageNum: number;
  /**
   * 每页数量
   */
  @Rule(RuleType.number())
    pageSize: number;
  /**
   * 开始日期
   */
  @Rule(RuleType.number())
    startTime: number;
  /**
   * 结束日期
   */
  @Rule(RuleType.number())
    endTime: number;
}
