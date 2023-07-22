import { modelOptions, prop } from '@typegoose/typegoose';
import { Timestamps } from '../common/common';
import { RequestMethod } from '../../types/types';

class FileInfo {
  /**
   * 文件路径
   */
  @prop()
  public url: string;
}
/*
|--------------------------------------------------------------------------
| 文档参数
|--------------------------------------------------------------------------
*/
class BaseProperty {
  @prop()
  public _id: string;
  /**
   * 字段名称
   */
  @prop()
  public key: string;
  /**
   * 字段类型
   */
  @prop()
  public type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  /**
   * 字段描述
   */
  @prop()
  public description: string;
  /**
   * 字段值
   */
  @prop()
  public value: string;
  /**
   * 是否必填
   */
  @prop()
  public required: boolean;
  /**
   * 业务参数，是否选中
   */
  @prop()
  public select: boolean;
  /**
   * 子元素
   */
  @prop({ ref: () => BaseProperty })
  public children: BaseProperty[];
}
/*
|--------------------------------------------------------------------------
| 文档信息
|--------------------------------------------------------------------------
*/
class Info {
  /**
   * 文档名称
   */
  @prop({ required: true })
  public name: string;
  /**
   * 文档版本信息
   */
  @prop()
  public version: string;
  /**
   * 文档类型,   1.文件夹 2.普通文档 3.markdown文档
   */
  @prop()
  public type: 'folder' | 'api' | 'markdown';
  /**
   * 创建者
   */
  @prop()
  public creator: string;
  /**
   * 维护人员，最近一次更新人员
   */
  @prop()
  public maintainer?: string;
  /**
   * 删除文档的人
   */
  @prop()
  public deletePerson?: string;
  /**
   * 录入接口花费时间
   */
  @prop()
  public spendTime?: string;
}
/*
|--------------------------------------------------------------------------
| 请求脚本
|--------------------------------------------------------------------------
*/
class RequestScript {
  /**
   * 请求脚本信息
   */
  @prop({ default: '' })
  public raw: string;
}
/*
|--------------------------------------------------------------------------
| 基本请求参数
|--------------------------------------------------------------------------
*/
class RequestUrl {
  /**
   * host地址(目前理解为接口前缀，可以是任意字符串)
   */
  @prop({ default: '' })
  public host: string;
  /**
   * 请求路径
   */
  @prop({ default: '' })
  public path: string;
}
/*
|--------------------------------------------------------------------------
| 请求body
|--------------------------------------------------------------------------
*/
class RawBody {
  /**
   * 数据
   */
  @prop()
  public data: string;
  /**
   * 数据类型
   */
  @prop()
  public dataType: string;
}
class RequestBody {
  /**
   * 请求模式
   */
  @prop({ default: 'json' })
  public mode: 'json' | 'raw' | 'formdata' | 'urlencoded' | 'binary' | 'none';
  /**
   * 原始json数据(字符串)
   */
  @prop({ default: 'json' })
  public rawJson: string;
  /**
   * formData数据
   */
  @prop({ type: () => [BaseProperty] })
  public formdata: BaseProperty[];
  /**
   * formData数据
   */
  @prop({ type: () => [BaseProperty] })
  public urlencoded: BaseProperty[];
  /**
   * raw数据
   */
  @prop({ default: { data: '', dataType: 'text/plain' } })
  public raw: RawBody;
  /**
   * file数据
   */
  @prop()
  public file: FileInfo;
}
class RequestInfo {
  /**
   * 请求方法
   */
  @prop({ default: 'GET' })
  public method: RequestMethod;
  /**
   * 请求地址信息
   */
  @prop({ default: { path: '', host: '' } })
  public url: RequestUrl;
  /**
   * 路径参数
   */
  @prop({ type: () => [BaseProperty] })
  public paths: BaseProperty[];
  /**
   * query参数
   */
  @prop({ type: () => [BaseProperty] })
  public queryParams: BaseProperty[];
  /**
   * body参数
   */
  @prop()
  public requestBody: RequestBody;
  /**
   * 请求头
   */
  @prop({ type: () => [BaseProperty] })
  public headers: BaseProperty[];
  /**
   * contentType
   */
  @prop({ default: '' })
  public contentType:
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'
    | 'application/xml'
    | 'text/html'
    | '';
}
/*
|--------------------------------------------------------------------------
| 返回参数
|--------------------------------------------------------------------------
*/
class ResonseValue {
  @prop()
  public dataType: string;
  @prop()
  public strJson: string;
  @prop()
  public text: string;
  @prop()
  public file: FileInfo;
}
class ResponseParams {
  @prop()
  public title: string;
  @prop({ default: 200 })
  public statusCode: number;
  @prop()
  public value: ResonseValue;
}

@modelOptions({
  schemaOptions: { timestamps: true, collection: 'doc' },
})
export class Doc extends Timestamps {
  /**
   * 父元素id
   */
  @prop({ default: '' })
  public pid: string;
  /**
   * 项目id
   */
  @prop({ required: true })
  public projectId: string;
  /**
   * 是否为文件夹
   */
  @prop({ required: true })
  public isFolder: boolean;
  /**
   * 排序字段，时间戳
   */
  @prop({ required: true, default: Date.now() })
  public sort: number;
  /**
   * 文档基本信息
   */
  @prop()
  public info: Info;
  /**
   * 前置脚本信息
   */
  @prop()
  public preRequest: RequestScript;
  /**
   * 后置脚本信息
   */
  @prop()
  public afterRequest: RequestScript;
  /**
   * 公共请求头
   */
  @prop({ type: () => [BaseProperty] })
  public commonHeaders: BaseProperty[];
  /**
   * 接口相关元素
   */
  @prop()
  public item: RequestInfo;
  /**
   * 返回参数
   */
  @prop({
    type: () => [ResponseParams],
    default: [
      {
        title: '成功返回',
        statusCode: 200,
        value: {
          dataType: 'application/json',
          strJson: null,
          file: {
            url: '',
            raw: '',
          },
          text: '',
        },
      },
    ],
  })
  public responseParams: ResponseParams[];
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
