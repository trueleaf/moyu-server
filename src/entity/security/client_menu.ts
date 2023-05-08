import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_client_menu' },
})
export class ClientMenu {
  /**
   * 菜单名称
   */
  @prop()
  public name: string;
  /**
   * 前端跳转路径
   */
  @prop()
  public path: string;
  /**
   * 父级菜单id
   */
  @prop()
  public pid: string;
  /**
   * 路由类型inline内部路由  link外部链接(未使用)
   */
  @prop()
  public type: 'inline' | 'link';
  /**
   * 排序，数字越大越靠前
   */
  @prop({ default: Date.now() })
  public sort: number;
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
