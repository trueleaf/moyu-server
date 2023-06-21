import {
  Inject,
  Controller,
  Post,
  Body,
} from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ClientMenu } from '../../entity/security/client_menu';
import { AddClientMenuDto } from '../../types/dto/security/client.menu.dto';
import { ClientMenuService } from '../../service/security/client_menu';

@Controller('/api')
export class ClientMenuController {
  @Inject()
    clientMenuService: ClientMenuService;
  @InjectEntityModel(ClientMenu)
    clientMenuModel: ReturnModelType<typeof ClientMenu>;
  /**
   * 新增前端菜单
   */
  @Post('/security/client_menu')
  async addClientMenu(@Body() params: AddClientMenuDto) {
    const data = await this.clientMenuService.addClientMenu(params);
    return data;
  }

}
