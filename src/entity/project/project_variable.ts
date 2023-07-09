import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true, collection: 'project_variable' },
})
export class ProjectVariable {
  /**
   * 项目id
   */
  @prop()
  public projectId: string;
  /**
   * 变量名称
   */
  @prop()
  public name: string;
  /**
   * 变量类型
   */
  @prop({ enum: ['string', 'number', 'boolean', 'array', 'object'] })
  public type: string;
  /**
   * 变量值
   */
  @prop()
  public value: string;
  /**
   * 创建者信息
   */
  @prop()
  public creator: string;
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
