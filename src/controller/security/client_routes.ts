import {
  Inject,
  Controller,
  Post,
  Body,
  Put,
  Del,
  Get,
  Query,
} from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ClientRoutes } from '../../entity/security/client_routes';
import { AddClientRoutesDto, AddMultiClientRoutesDto, ChangeGroupNameByIds, DeleteClientRoutesDto, EditClientRoutesDto, GetClientRoutesListDto } from '../../types/dto/security/client.routes.dto';
import { ClientRoutesService } from '../../service/security/client_routes';

@Controller('/api')
export class ClientRoutesController {
  @Inject()
    clientRoutesService: ClientRoutesService;
  @InjectEntityModel(ClientRoutes)
    clientRoutes: ReturnModelType<typeof ClientRoutes>;
  /**
   * 新增前端路由
   */
  @Post('/security/client_routes')
  async addClientRoutes(@Body() params: AddClientRoutesDto) {
    const data = await this.clientRoutesService.addClientRoutes(params);
    return data;
  }
  /**
   * 批量新增前端路由
   */
  @Post('/security/client_routes_multi')
  async addMultiClientRoutes(@Body() params: AddMultiClientRoutesDto) {
    const data = await this.clientRoutesService.addMultiClientRoutes(params);
    return data;
  }
  /**
   * 修改前端路由
   */
  @Put('/security/client_routes')
  async editClientMenu(@Body() params: EditClientRoutesDto) {
    const data = await this.clientRoutesService.editClientMenu(params);
    return data;
  }
  /**
   * 删除前端路由
   */
  @Del('/security/client_routes')
  async deleteClientRoutes(@Body() params: DeleteClientRoutesDto) {
    const data = await this.clientRoutesService.deleteClientRoutes(params);
    return data;
  }
  /**
   * 批量修改前端路由分组名称
   */
  @Del('/security/client_routes_type')
  async changeGroupNameByIds(@Body() params: ChangeGroupNameByIds) {
    const data = await this.clientRoutesService.changeGroupNameByIds(params);
    return data;
  }
  /**
   * 以列表形式获取前端路由
   */
  @Get('/security/client_routes_list')
  async getClientRoutesList(@Query() params: GetClientRoutesListDto) {
    const data = await this.clientRoutesService.getClientRoutesList(params);
    return data;
  }
  /**
   * 获取全部客户端路由
   */
  @Get('/security/client_routes')
  async getAllServerRoutesList() {
    const data = await this.clientRoutesService.getAllServerRoutesList();
    return data;
  }
}
