import { Rule, RuleType, getSchema } from '@midwayjs/validate';
import { TableSearchParams } from '../common/common.dto';

class BaseProperty {
  /**
   * 字段名称
   */
  @Rule(RuleType.string().required())
    key: string;
  /**
   * 字段类型
   */
  @Rule(RuleType.string().valid('string', 'number', 'boolean', 'array', 'object', 'file').required())
    type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  /**
   * 字段描述
   */
  @Rule(RuleType.string().required())
    description: string;
  /**
   * 字段值
   */
  @Rule(RuleType.string().required())
    value: string;
  /**
   * 参数位置
   */
  @Rule(RuleType.string().valid('path', 'queryParams', 'requestBody', 'responseParams').required())
    paramsPosition: 'path' | 'queryParams' | 'requestBody' | 'responseParams';
}
/**
 * 新增文档联想参数
 */
export class AddDocMindParamsDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 联想参数
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)).required())
    mindParams: BaseProperty[];
}
/**
 * 删除文档联想参数
 */
export class DeleteDocMindParams {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 文档联想参数名称
   */
  @Rule(RuleType.array().items(RuleType.string()).required())
    ids: string[];
}
/**
 * 以列表形式获取文档联想参数
 */
export class GetDocMindParamsList extends TableSearchParams {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}
