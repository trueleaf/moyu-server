import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'project' },
})
/*
|--------------------------------------------------------------------------
| 创建者信息
|--------------------------------------------------------------------------
*/
class Creator {
  /**
   * 用户id
   */
  @prop()
  public id: string;
  /**
   * 用户名称
   */
  @prop()
  public name: string;
}
/*
|--------------------------------------------------------------------------
| 成员信息
|--------------------------------------------------------------------------
*/
enum PermissionEnum {
  readOnly = 'readOnly',
  readAndWrite = 'readAndWrite',
  admin = 'admin',
}
class Member {
  /**
   * 用户id
   */
  @prop()
  public userId: string;
  /**
   * 登录名称(冗余字段)
   */
  @prop()
  public loginName: string;
  /**
   * 真实姓名(冗余字段)
   */
  @prop()
  public realName: string;
  /**
   * 权限
   */
  @prop({ type: PermissionEnum })
  public permission: string;
}

export class Project {
  /**
   * 项目名称
   */
  @prop({ minlength: 1, maxlength: 30, trim: true })
  public projectName: string;
  /**
   * 文档数量
   */
  @prop()
  public docNum: number;
  /**
   * 创建者
   */
  @prop({ type: () => Creator })
  public owner: Creator;
  /**
   * 成员信息
   */
  @prop({ type: () => [Member] })
  public members: Member[];
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
