import { modelOptions, prop } from '@typegoose/typegoose';

class BaseProperty {
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
   * 参数位置
   */
  @prop()
  public paramsPosition: 'path' | 'queryParams' | 'requestBody' | 'responseParams';

}
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'docs_params_mind' },
})
export class DocMindParams {
  /**
   * 项目id
   */
  @prop()
  public projectId: string;
  /**
   * 联想参数
   */
  @prop({ type: () => [BaseProperty] })
  public mindParams: BaseProperty[];
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
