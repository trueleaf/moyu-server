import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_client_routes' },
})
export class ClientRoutes {
  /**
   * 路由名称
   */
  @prop()
  public name: string;
  /**
   * 路由地址
   */
  @prop()
  public path: string;
  /**
   * 分组名称，仅用于前端分组无其他实际意义
   */
  @prop()
  public groupName: string;
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
