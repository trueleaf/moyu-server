import { modelOptions, prop } from '@typegoose/typegoose';
import { Timestamps } from '../common/common.js';
@modelOptions({
  schemaOptions: { timestamps: true, collection: 'security_groups' },
})
export class Group extends Timestamps {
  /**
   * 组名称
   */
  @prop()
  public groupName: string;
  /**
   * 是否启用
   */
  @prop({ default: true })
  public isEnabled?: boolean;
}
