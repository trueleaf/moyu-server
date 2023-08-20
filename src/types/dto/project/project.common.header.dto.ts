import { Rule, RuleType, getSchema } from '@midwayjs/validate';

/**
 * 根据id获取某个请求头
 */
export class GetProjectCommonHeaderByIdDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 文档id
   */
  @Rule(RuleType.string().required())
    id: string;
}

class HeaderProperty {
  @Rule(RuleType.string().required())
    key: string;
  @Rule(RuleType.string().required())
    value: string;
  @Rule(RuleType.string().required())
    description: string;
}
/**
 * 新增或修改公共请求头
 */
export class UpsertProjectCommonHeaderDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 文档或目录id
   */
  @Rule(RuleType.string().required())
    id: string;
  /**
   * 文档id
   */
  @Rule(RuleType.array().items(getSchema(HeaderProperty)))
    commonHeaders: HeaderProperty[];
}
/**
 * 获取所有公共请求头
 */
export class GetProjectCommonHeadersDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}
