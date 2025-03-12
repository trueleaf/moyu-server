import { modelOptions, prop } from '@typegoose/typegoose';
import { Timestamps } from '../common/common.js';

class UserInfo {
  @prop({ required: true })
  userName: string;

  @prop({ required: true })
  userId: string;
}
class Member {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  userName: string;

  //管理员无法过期
  @prop({
    default: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 10);
      return date;
    }
  })
  expireAt?: Date; 
  /**
   * 权限
   */
  @prop({ enum: ['readOnly', 'readAndWrite', 'admin'] })
  public permission: 'readOnly' | 'readAndWrite' | 'admin';
}


@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_groups' },
})
export class Group extends Timestamps {
  /**
   * 组名称
   */
  @prop({ required: true, maxlength: 50 })
  public groupName: string;
  /**
   * 组描述
   */
  @prop({ maxlength: 255 })
  public description: string; // 组描述（可选）
  /**
   * 组成员
   */
  @prop({ type: () => [Member] })
  members: Member[]; 
  /**
   * 创建者
   */
  @prop({ required: true })
  creator: UserInfo; // 创建者
  /**
   * 是否启用
   */
  @prop({ default: true })
  public isEnabled?: boolean;
}
