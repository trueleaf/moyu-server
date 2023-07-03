import { modelOptions, prop } from '@typegoose/typegoose';
import { Timestamps } from '../common/common';
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
  @prop({ enum: ['readOnly', 'readAndWrite', 'admin'] })
  public permission: 'readOnly' | 'readAndWrite' | 'admin';
}

@modelOptions({
  schemaOptions: { timestamps: true, collection: 'project' },
})
export class Project extends Timestamps {
  /**
   * 项目名称
   */
  @prop({ minlength: 1, maxlength: 30, trim: true })
  public projectName: string;
  /**
   * 备注
   */
  @prop()
  public remark: string;
  /**
   * 文档数量
   */
  @prop()
  public docNum: number;
  /**
   * 创建者
   */
  @prop()
  public owner: Creator;
  /**
   * 成员信息
   */
  @prop({type: () => [Member]})
  public members: Member[];
  /**
   * 使能
   */
  @prop({ default: true })
  public enabled: boolean;
}
