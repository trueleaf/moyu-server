import { prop } from '@typegoose/typegoose';
// const userSchema = new Schema({
//   phone: { //手机号码
//     type: String
//   },
//   loginTimes: { //登录次数
//     type: Number,
//     default: 0,
//   },
//   lastLogin: { //上次登录时间
//     type: Date,
//   },
//   email: { //邮箱
//     type: String
//   },
//   enable: { //使能
//     type: Boolean,
//     default: true
//   },
//   roleIds: { //角色id
//     type: Array,
//     default: []
//   },
//   roleNames: {
//     type: Array, //角色名称，仅供前端显示方便，避免一次查询,
//     default: []
//   },
//   clientRoutes: { //前端路由，权限管理时候进行修改避免用户登录时多次查询
//     type: Array,
//     default: [],
//   },
//   clinetMenus: { //前端菜单，权限管理时候进行修改避免用户登录时多次查询
//     type: Array,
//     default: []
//   },
//   serverRoutes: { //后端路由，权限管理时候进行修改避免用户登录时多次查询
//     type: Array,
//     default: []
//   },
//   recentVisitProjects: { //最近访问的项目
//     type: Array,
//     default: []
//   },
//   starProjects: { //收藏项目
//     type: Array,
//     default: []
//   },
//   couldVisitProjects: { //可以访问的项目列表id集合
//     type: Array,
//     default: []
//   }
// }, {
//   timestamps: true,
// });
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
  @prop({default: ""})
  public phone: string;
}