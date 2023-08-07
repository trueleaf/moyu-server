import {
  Controller,
  Body,
  Post,
  Query,
  Inject,
} from '@midwayjs/core';
import { ExportAsApiflowDto, ExportAsHTMLDto, ExportAsWordDto, ImportApiflowDto } from '../../types/dto/doc/doc.import.export';
import { DocImportAndExportService } from '../../service/doc/doc_import_export';

@Controller('/api')
export class DocImportAndExport {
  @Inject()
    docImportAndExportService: DocImportAndExportService;

  /**
   * 导出为html
   */
  @Post('/project/export/html')
  async exportAsHTML(@Body() params: ExportAsHTMLDto) {
    const data = await this.docImportAndExportService.exportAsHTML(params);
    return data;
  }
  /**
   * 导出为word
   */
  @Post('/project/export/word')
  async exportAsWord(@Query() params: ExportAsWordDto) {
    const data = await this.docImportAndExportService.exportAsWord(params);
    return data;
  }
  /**
   * 导出为apiflow文档
   */
  @Post('/project/export/moyu')
  async exportAsApiflow(@Query() params: ExportAsApiflowDto) {
    const data = await this.docImportAndExportService.exportAsApiflow(params);
    return data;
  }
  /**
   * 导入文档
   */
  @Post('/project/import/moyu')
  async importApiflow(@Body() params: ImportApiflowDto) {
    const data = await this.docImportAndExportService.importApiflow(params);
    return data;
  }
}
