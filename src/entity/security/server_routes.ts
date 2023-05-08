import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_server_routes' },
})
export class ServerRoutes {
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
   * 请求方法
   */
  @prop()
  public method: string;
  /**
   * 分组名称，只用于前端过滤
   */
  @prop()
  public groupName: string;
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
