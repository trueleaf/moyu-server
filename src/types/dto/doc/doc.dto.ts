import { Rule, RuleType, getSchema } from '@midwayjs/validate';
import { RequestMethod, ContentType } from '../../types';

/*
|--------------------------------------------------------------------------
| 通用校验
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
  @Rule(RuleType.array().items(getSchema(BaseProperty)))
    children: BaseProperty[];
}
class MockImage {
  @Rule(RuleType.valid('png', 'jpg', 'gif', 'svg').required())
    type: 'png' | 'jpg' | 'gif' | 'svg';
  @Rule(RuleType.number())
    width: number;
  @Rule(RuleType.number())
    height: number;
  /**
   * 图片额外大小,可以mock较大数据图片来测试网络延迟
   */
  @Rule(RuleType.number().required())
    size: number;
  @Rule(RuleType.number().required())
    fontSize: number;
  @Rule(RuleType.string().required().allow(''))
    color: string;
  @Rule(RuleType.string().required().allow(''))
    backgroundColor: string;
}

class MockFile {
  @Rule(RuleType.valid('doc', 'docx', 'xls', 'xlsx', 'pdf', 'zip', 'custom'))
    type: 'doc' | 'docx' | 'xls' | 'xlsx' | 'pdf' | 'zip' | 'custom';
  /**
   * 自定义mock文件路径
   */
  @Rule(RuleType.string().allow(''))
    filePath: string;
}

class MockInfo {
  /**
   * mock地址
   */
  @Rule(RuleType.string().required().allow(''))
    path: string;
  /**
   * http状态码
   */
  @Rule(RuleType.number().required())
    httpStatusCode: number;
  /**
   * 自定义返回头
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)).required())
    responseHeaders: BaseProperty[];
  /**
   * 返回延时
   */
  @Rule(RuleType.number().required())
    responseDelay: number;
  /**
   * 返回数据类型
   */
  @Rule(RuleType.valid('json', 'image', 'file', 'text', 'customJson').required())
    responseType: 'json' | 'image' | 'file' | 'text' | 'customJson';
  /**
   * 返回json数据
   */
  @Rule(RuleType.string().required().allow(''))
    json: string;
  /**
   * 图片返回
   */
  @Rule(getSchema(MockImage).required())
    image: MockImage;
  /**
   * 文件相关数据
   */
  @Rule(getSchema(MockFile).required())
    file: MockFile;
  /**
   * 纯文本，html，css等
   */
  @Rule(RuleType.string().required().allow(''))
    text: string;
  /**
   * 自定义json返回
   */
  @Rule(RuleType.string().required().allow(''))
    customResponseScript: string;
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
  @Rule(RuleType.string().allow(''))
    description: string;
  /**
   * 文档版本信息
   */
  @Rule(RuleType.string())
    version: string;
  /**
   * 文档类型,   1.文件夹 2.普通文档 3.markdown文档
   */
  @Rule(RuleType.string().valid('folder', 'api', 'markdown').required())
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
  @Rule(RuleType.number())
    spendTime: number;
}
class FileInfo {
  @Rule(RuleType.string().required().allow(''))
    url: string;
}
class ResonseValue {
  @Rule(RuleType.string())
    dataType: string;
  @Rule(RuleType.string())
    strJson: string;
  @Rule(RuleType.string())
    text: string;
  @Rule(getSchema(FileInfo))
    file: FileInfo;
}
//返回参数
class ResponseParams {
  @Rule(RuleType.string())
    title: string;
  @Rule(RuleType.number().allow(200))
    statusCode: number;
  @Rule(getSchema(ResonseValue))
    value: ResonseValue;
}
//请求脚本信息
class RequestScript {
  /**
   * 请求脚本信息
   */
  @Rule(RuleType.string().allow(''))
    raw: string;
}
class RequestUrl {
  /**
   * 接口路径
   */
  @Rule(RuleType.string().allow(''))
  public path: string;
  /**
   * 接口前缀
   */
  @Rule(RuleType.string().allow(''))
  public host: string;
}
class RawBody {
  /**
   * 原始数据值
   */
  @Rule(RuleType.string().required().allow(''))
  public data: string;
  /**
   * 原始数据类型
   */
  @Rule(RuleType.string().required().allow(''))
  public dataType: string;
}
class RequestBody {
  /**
   * 请求模式
   */
  @Rule(RuleType.string().valid('json', 'raw', 'formdata', 'urlencoded', 'binary', 'none'))
  public mode: 'json' | 'raw' | 'formdata' | 'urlencoded' | 'binary' | 'none';
  /**
   * 原始json数据(字符串)
   */
  @Rule(RuleType.string().required())
  public rawJson: string;
  /**
   * formData数据
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)).required())
  public formdata: BaseProperty[];
  /**
   * urlencoded数据
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)).required())
  public urlencoded: BaseProperty[];
  /**
   * raw数据
   */
  @Rule(getSchema(RawBody).required())
  public raw: RawBody;
  /**
   * file数据
   */
  @Rule(getSchema(FileInfo).required())
  public file: FileInfo;
}
class ItemInfo {
  /**
   * 请求方法
   */
  @Rule(RuleType.string().valid('GET','POST','PUT','DELETE','OPTIONS','PATCH','HEAD','CONNECTION','TRACE').default('GET'))
  public method: RequestMethod;
  /**
   * 请求地址信息
   */
  @Rule(getSchema(RequestUrl))
  public url: RequestUrl;
  /**
   * 路径参数
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)))
  public paths: BaseProperty[];
  /**
   * query参数
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)))
  public queryParams: BaseProperty[];
  /**
   * body参数
   */
  @Rule(getSchema(RequestBody).required())
  public requestBody: RequestBody;
  /**
   * 请求头
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)))
  public headers: BaseProperty[];
  /**
   * contentType
   */
  @Rule(RuleType.string().valid('application/json','application/x-www-form-urlencoded','multipart/form-data','text/plain','application/xml','text/html',''))
  public contentType: ContentType;
}
class DocInfo {
  /**
   * 文档id
   */
  @Rule(RuleType.string())
    _id: string;
  /**
   * 父元素id
   */
  @Rule(RuleType.string())
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
  @Rule(getSchema(DocBaseInfo))
    info: DocBaseInfo;
  /**
   * 前置脚本信息
   */
  @Rule(getSchema(RequestScript))
    preRequest: RequestScript;
  /**
   * 后置脚本信息
   */
  @Rule(getSchema(RequestScript))
    afterRequest: RequestScript;
  /**
   * 公共请求头
   */
  @Rule(RuleType.array().items(getSchema(BaseProperty)))
    commonHeaders: BaseProperty[];
  /**
   * 接口相关元素
   */
  @Rule(getSchema(ItemInfo))
    item: ItemInfo;
  /**
   * 返回参数
   */
  @Rule(RuleType.array().items(getSchema(ResponseParams)))
    responseParams: ResponseParams[];
}

/*
|--------------------------------------------------------------------------
| DTO
|--------------------------------------------------------------------------
*/

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
    type: 'folder' | 'api' | 'markdown';
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
class IdMap {
  @Rule(RuleType.string().required())
    _id: string;
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
  @Rule(RuleType.array().items(getSchema(IdMap)).required())
    docs: IdMap[];
}
/**
 * 改变文档位置信息 todo 迁移前用于历史记录
 */
// class DropInfo {
//   /**
//    * 被drag节点名称
//    */
//   @Rule(RuleType.string().required())
//     nodeName: string;
//   /**
//    * 被drag节点id
//    */
//   @Rule(RuleType.string().required())
//     nodeId: string;
//   /**
//    * 文档drop时候相对的那个节点id
//    */
//   @Rule(RuleType.string().required())
//     dropNodeId: string;
//   /**
//    * 文档drop时候相对的那个节点名称
//    */
//   @Rule(RuleType.string().required())
//     dropNodeName: string;
//   /**
//    * 文档drop时候类型，
//    */
//   @Rule(RuleType.string().valid('before', 'after', 'inner').required())
//     dropType: 'before' | 'after' | 'inner';
// }
export class ChangeDocPositionDto {
  /**
   * 当前项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 需要改变的文档id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 需要改变的文档父级id
   */
  @Rule(RuleType.string().allow(''))
    pid: string;
  /**
   * 文档排序
   */
  @Rule(RuleType.number())
    sort: number;
}
/**
 * 改变文档基本信息
 */
export class ChangeDocBaseInfoDto {
  /**
   * 文档id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 文档所属项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 文档名称
   */
  @Rule(RuleType.string())
    name?: number;
}
/**
 * 更新文档
 */
export class UpdateDoc {
  /**
   * 文档id
   */
  @Rule(RuleType.string().required())
    _id: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
  /**
   * 录入耗时
   */
  @Rule(RuleType.number())
    spendTime: number;
  /**
   * 文档信息
   */
  @Rule(getSchema(DocBaseInfo).required())
    info: DocBaseInfo;
  /**
   * 接口信息
   */
  @Rule(getSchema(ItemInfo).required())
    item: ItemInfo;
  /**
   * 前置脚本信息
   */
  @Rule(getSchema(RequestScript).required())
    preRequest: RequestScript;
  /**
   * 后置脚本信息
   */
  @Rule(getSchema(RequestScript).required())
    afterRequest: RequestScript;
  /**
   * mock信息
   */
  @Rule(getSchema(MockInfo))
    mockInfo: MockInfo;
}

/**
 * 创建文档(保存文档)
 */
export class ReplaceFullDocDto {
  /**
   * 文档
   */
  @Rule(getSchema(DocInfo))
    docInfo: DocInfo;
}

/**
 * 获取文档详情
 */
export class GetDocDetailDto {
  /**
   * 文档id
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
 * 删除文档
 */
export class DeleteDocDto {
  /**
   * 需要删除文档的id集合
   */
  @Rule(RuleType.array().items(RuleType.string()).required())
    ids: string;
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}

/**
 * 获取文档mock数据
 */
export class GetMockDataDto {
  /**
   * 文档id
   */
  @Rule(RuleType.string().required())
    _id: string;
}
/**
 * 以树形结构获取文档
 */
export class GetDocsAsTreeDto {
  /**
   * 项目id
   */
  @Rule(RuleType.string().required())
    projectId: string;
}
