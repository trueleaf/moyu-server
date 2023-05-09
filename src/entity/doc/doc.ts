import { modelOptions, prop } from '@typegoose/typegoose';

/**
 * 文档信息
 */
class Info {
  /**
   * 文档名称
   */
  @prop({ required: true })
  public name: string;
  /**
   * 文档描述
   */
  @prop({ default: '' })
  public description: string;
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
  public maintainer: string;
  /**
   * 删除文档的人
   */
  @prop()
  public deletePerson: string;
  /**
   * 录入接口花费时间
   */
  @prop()
  public spendTime: string;
}
/**
 * 请求脚本
 */
class RequestScript {
  /**
   * 请求脚本信息
   */
  @prop({ default: '' })
  public raw: string;
}

@modelOptions({
  schemaOptions: { timestamps: true, collection: 'doc' },
})
export class Doc {
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
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
