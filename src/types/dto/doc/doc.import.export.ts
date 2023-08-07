import { Rule, RuleType, getSchema } from '@midwayjs/validate';
import { DocInfo } from './doc.dto';

/**
 * 导出为html
 */
export class ExportAsHTMLDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 当前选中文档
   */
  @Rule(RuleType.array().items(RuleType.string()))
    selectedNodes: string[];
}

/**
 * 导出为word
 */
export class ExportAsWordDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 当前选中文档
   */
  @Rule(RuleType.array().items(RuleType.string()))
    selectedNodes: string[];
}

/**
 * 导出为apiflow
 */
export class ExportAsApiflowDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 当前选中文档
   */
  @Rule(RuleType.array().items(RuleType.string()))
    selectedNodes: string[];
}

class DocPrefixInfo {
  @Rule(RuleType.string().required())
    projectId: string;
  @Rule(RuleType.string().required())
    _id: string;
  @Rule(RuleType.string().required())
    name: string;
  @Rule(RuleType.string().required())
    url: string;
}
class ApiflowDocInfo {
  /**
   * 文档信息
   */
  @Rule(RuleType.array().items(getSchema(DocInfo)).required())
    docs: DocInfo[];
  /**
   * 接口前缀信息
   */
  @Rule(RuleType.array().items(getSchema(DocPrefixInfo)))
    hosts: DocPrefixInfo[];
}
/**
 * 导入apiflow文档
 */
export class ImportApiflowDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 是否覆盖原文档
   */
  @Rule(RuleType.boolean().required())
    cover: boolean;
  /**
   * 导入文档信息
   */
  @Rule(getSchema(ApiflowDocInfo))
    moyuData: ApiflowDocInfo;
}
