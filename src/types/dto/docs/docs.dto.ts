import { Rule, RuleType } from '@midwayjs/validate';

/*
|--------------------------------------------------------------------------
| 文档DOT
|--------------------------------------------------------------------------
*/
//基础请求参数元信息
class BaseProperty {
  @Rule(RuleType.string().required())
    _id: string;
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
   * 是否必填
   */
  @Rule(RuleType.boolean().required())
    required: boolean;
  /**
   * 业务参数，是否选中
   */
  @Rule(RuleType.boolean().required())
    select: boolean;
  /**
   * 子元素
   */
  @Rule(RuleType.array().items(RuleType.object<BaseProperty>()))
    children: BaseProperty[];
}
//文档基本信息
class DocBaseInfo {
  /**
   * 文档名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 文档描述
   */
  @Rule(RuleType.string().default(''))
    description: string;
  /**
   * 文档版本信息
   */
  @Rule(RuleType.string())
    version: string;
  /**
   * 文档类型,   1.文件夹 2.普通文档 3.markdown文档
   */
  @Rule(RuleType.string().valid('folder', 'api', 'markdown'))
    type: 'folder' | 'api' | 'markdown';
  /**
   * 创建者
   */
  @Rule(RuleType.string())
    creator: string;
  /**
   * 维护人员，最近一次更新人员
   */
  @Rule(RuleType.string())
    maintainer: string;
  /**
   * 删除文档的人
   */
  @Rule(RuleType.string())
    deletePerson: string;
  /**
   * 录入接口花费时间
   */
  @Rule(RuleType.string())
    spendTime: string;
}
class FileInfo {
  @Rule(RuleType.string())
    url: string;
}
class ResonseValue {
  @Rule(RuleType.string())
    dataType: string;
  @Rule(RuleType.string())
    strJson: string;
  @Rule(RuleType.string())
    text: string;
  @Rule(RuleType.object<FileInfo>())
    file: FileInfo;
}
//返回参数
class ResponseParams {
  @Rule(RuleType.string())
    title: string;
  @Rule(RuleType.number().default(200))
    statusCode: number;
  @Rule(RuleType.object<ResonseValue>())
    value: ResonseValue;
}
//请求脚本信息
class RequestScript {
  /**
   * 请求脚本信息
   */
  @Rule(RuleType.string().default(''))
    raw: string;
}
class DocRule {
  /**
   * 父元素id
   */
  @Rule(RuleType.string().default(''))
    pid: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 是否为文件夹
   */
  @Rule(RuleType.boolean().required())
    isFolder: boolean;
  /**
   * 排序字段，时间戳
   */
  @Rule(RuleType.number().required().default(Date.now()))
    sort: number;
  /**
   * 文档基本信息
   */
  @Rule(RuleType.object<DocBaseInfo>())
    info: DocBaseInfo;
  /**
   * 前置脚本信息
   */
  @Rule(RuleType.object<RequestScript>())
    preRequest: RequestScript;
  /**
   * 后置脚本信息
   */
  @Rule(RuleType.object<RequestScript>())
    afterRequest: RequestScript;
  /**
   * 公共请求头
   */
  @Rule(RuleType.array().items(RuleType.object<BaseProperty>()))
    commonHeaders: BaseProperty[];
  /**
   * 接口相关元素
   */
  @Rule(RuleType.object<RequestInfo>())
    item: RequestInfo;
  /**
   * 返回参数
   */
  @Rule(
    RuleType.array().items(RuleType.object<ResponseParams>())
  )
    responseParams: ResponseParams[];
}

/**
 * 修改项目脚本代码
 */
export class AddEmptyDocDto {
  /**
   * 文档名称
   */
  @Rule(RuleType.string().required())
    name: string;
  /**
   * 文档类型
   */
  @Rule(RuleType.string().valid('folder', 'api', 'markdown').required())
    type: string;
  /**
   * 父元素id
   */
  @Rule(RuleType.string())
    pid: string;
  /**
   * 所属项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}

/**
 * 拷贝一个节点
 */
export class GenerateDocCopyDto {
  /**
   * 节点id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}
/**
 * 粘贴文档
 */
export class PasteDocsDto {
  /**
   * 当前项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 来源项目id
   */
  @Rule(RuleType.string().required())
    fromProjectId: string;
  /**
   * 挂载节点id
   */
  @Rule(RuleType.string())
    mountedId: string;
  /**
   * docs
   */
  @Rule(RuleType.array().items(RuleType.object(DocRule)).required())
    docs: DocRule[];
}
