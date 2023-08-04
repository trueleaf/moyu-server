import { prop } from '@typegoose/typegoose';

export class DocPrefix {
  /**
   * 前缀名称
   */
  @prop()
  public name: string;
  /**
   * 前缀值
   */
  @prop()
  public url: string;
  /**
   * 项目id
   */
  @prop()
  public projectId: number;
  /**
   * 维护人名称
   */
  @prop()
  public maintainerName: string;
  /**
   * 维护人id
   */
  @prop()
  public maintainerId: string;
  /**
   * 使能
   */
  @prop()
  public enabled: boolean;
}
