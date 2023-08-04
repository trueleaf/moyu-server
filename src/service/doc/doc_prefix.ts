import { Provide, Inject, Context } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommonController } from '../../controller/common/common';
import { DocPrefix } from '../../entity/doc/doc_prefix';
import { LoginTokenInfo } from '../../types/types';
import { AddDocPrefixDto, DeleteDocPrefix, GetDocPrefixList, GetDocPrefixInfo, EditDocPrefix } from '../../types/dto/doc/doc.prefix.dto';

@Provide()
export class DocPrefixServer {
  @InjectEntityModel(DocPrefix)
    docPrefixModel: ReturnModelType<typeof DocPrefix>;
  @Inject()
    commonControl: CommonController;
  @Inject()
    ctx: Context & { tokenInfo: LoginTokenInfo };
  /**
   * 新增接口前缀
   */
  async addDocPrefix(params: AddDocPrefixDto) {
    console.log(params);
  }
  /**
   * 删除接口前缀
   */
  async deleteDocPrefix(params: DeleteDocPrefix) {
    console.log(params);
  }
  /**
   * 列表形式获取前缀
   */
  async getDocPrefixList(params: GetDocPrefixList) {
    console.log(params);
  }
  /**
   * 获取前缀详情
   */
  async getDocPrefixInfo(params: GetDocPrefixInfo) {
    console.log(params);
  }
  /**
   * 修改前缀信息
   */
  async editDocPrefix(params: EditDocPrefix) {
    console.log(params);
  }
}
