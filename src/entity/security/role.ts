import { modelOptions, prop } from '@typegoose/typegoose';
import { Timestamps } from '../common/common';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_role' },
})
export class Role extends Timestamps {
  /**
   * 角色名称
   */
  @prop()
  public roleName: string;
  /**
   * 前端路由
   */
  @prop({ type: () => [String] })
  public clientRoutes: string[];
  /**
   * 前端菜单
   */
  @prop({ type: () => [String] })
  public clientBanner: string[];
  /**
   * 服务端路由
   */
  @prop({ type: () => [String] })
  public serverRoutes: string[];
  /**
   * 备注信息
   */
  @prop()
  public remark: string;
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
