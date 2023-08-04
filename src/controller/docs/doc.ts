import { Inject, Controller, Body, Post, Del, Get, Put, Query } from '@midwayjs/core';
import { AddEmptyDocDto, ChangeDocBaseInfoDto, ChangeDocPositionDto, UpdateDoc, GenerateDocCopyDto, PasteDocsDto, ReplaceFullDocDto, GetDocDetailDto, DeleteDocDto, GetMockDataDto, GetDocsAsTreeDto } from '../../types/dto/doc/doc.dto';
import { DocService } from '../../service/doc/doc';

@Controller('/api')
export class DocController {
  @Inject()
    docService: DocService;

  /**
   * 新增空白文档
   */
  @Post('/project/new_doc')
  async addEmptyDoc(@Body() params: AddEmptyDocDto) {
    const data = await this.docService.addEmptyDoc(params);
    return data;
  }
  /**
   * 生成文档副本
   */
  @Post('/project/copy_doc')
  async generateDocCopy(@Body() params: GenerateDocCopyDto) {
    const data = await this.docService.generateDocCopy(params);
    return data;
  }
  /**
   * 粘贴文档
   */
  @Post('/project/paste_docs')
  async pasteDocs(@Body() params: PasteDocsDto) {
    const data = await this.docService.pasteDocs(params);
    return data;
  }
  /**
   * 改变文档位置信息
   */
  @Put('/project/change_doc_pos')
  async changeDocPosition(@Body() params: ChangeDocPositionDto) {
    const data = await this.docService.changeDocPosition(params);
    return data;
  }
  /**
   * 修改文档基础信息
   */
  @Put('/project/change_doc_info')
  async changeDocBaseInfo(@Body() params: ChangeDocBaseInfoDto) {
    const data = await this.docService.changeDocBaseInfo(params);
    return data;
  }
  /**
   *更新文档
   */
  @Post('/project/fill_doc')
  async updateDoc(@Body() params: UpdateDoc) {
    const data = await this.docService.updateDoc(params);
    return data;
  }
  /**
   * 覆盖文档
   */
  @Post('/project/save_doc')
  async replaceFullDoc(@Body() params: ReplaceFullDocDto) {
    const data = await this.docService.replaceFullDoc(params);
    return data;
  }
  /**
   * 获取文档详情
   */
  @Get('/project/doc_detail')
  async getDocDetail(@Query() params: GetDocDetailDto) {
    const data = await this.docService.getDocDetail(params);
    return data;
  }
  /**
   * 删除文档
   */
  @Del('/project/doc')
  async deleteDoc(@Body() params: DeleteDocDto) {
    const data = await this.docService.deleteDoc(params);
    return data;
  }
  /**
   * 获取mock文档数据
   */
  @Get('/project/doc_mock')
  async getMockData(@Query() params: GetMockDataDto) {
    const data = await this.docService.getMockData(params);
    return data;
  }
  /**
   * 以树形结构获取文档
   */
  @Get('/project/doc_tree_node')
  async getDocsAsTree(@Query() params: GetDocsAsTreeDto) {
    const data = await this.docService.getDocsAsTree(params);
    return data;
  }
}
