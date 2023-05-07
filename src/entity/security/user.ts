import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_users' },
})
export class User {
  /**
   * 用户名称(登录名称)
   */
  @prop()
  public loginName: string;
  /**
   * 真实姓名
   */
  @prop()
  public realName: string;
  /**
   * 加密盐
   */
  @prop()
  public salt: string;
  /**
   * 密码
   */
  @prop()
  public password: string;
  /**
   * 手机号码
   */
  @prop({ default: '' })
  public phone: string;
  /**
   * 登录次数
   */
  @prop({ default: 0 })
  public loginTimes: number;
  /**
   * 上次登录时间
   */
  @prop()
  public lastLogin: Date;
  /**
   * 邮箱
   */
  @prop()
  public email: string;
  /**
   * 角色id列表
   */
  @prop({ type: () => [String] })
  public roleIds: string[];
  /**
   * 角色名称，仅供前端显示方便，避免一次查询
   */
  @prop({ type: () => [String] })
  public roleNames: string[];
  /**
   * 前端路由，权限管理时候进行修改避免用户登录时多次查询
   */
  @prop({ type: () => [String] })
  public clientRoutes: string[];
  /**
   * 前端菜单，权限管理时候进行修改避免用户登录时多次查询
   */
  @prop({ type: () => [String] })
  public clinetMenus: string[];
  /**
   * 后端路由，权限管理时候进行修改避免用户登录时多次查询
   */
  @prop({ type: () => [String] })
  public serverRoutes: string[];
  /**
   * 最近访问的项目id集合
   */
  @prop({ type: () => [String] })
  public recentVisitProjects: string[];
  /**
   * 收藏的项目id集合
   */
  @prop({ type: () => [String] })
  public starProjects: string[];
  /**
   * 允许访问项目的id集合
   */
  @prop({ type: () => [String] })
  public couldVisitProjects: string[];
  /**
   * 使能
   */
  @prop({ default: true })
  public enable: boolean;
}
