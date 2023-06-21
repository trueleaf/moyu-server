import { Provide } from '@midwayjs/core';
import { AddClientMenuDto } from '../../types/dto/security/client.menu.dto';
import { throwError } from '../../utils/utils';
import { ClientMenu } from '../../entity/security/client_menu';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Provide()
export class ClientMenuService {
  @InjectEntityModel(ClientMenu)
    clientMenuModel: ReturnModelType<typeof ClientMenu>;
  /**
   * 新增前端菜单
   */
  async addClientMenu(params: AddClientMenuDto) {
    const { name, path, pid, type } = params;
    const doc: Partial<ClientMenu> = {};
    doc.name = name;
    doc.path = path;
    doc.pid = pid;
    if (type) {
      doc.type = type;
    }
    const hasClientMenu = await this.clientMenuModel.findOne({ name });
    if (hasClientMenu) {
      return throwError(1003, '当前菜单名称已存在')
    }
    const result = await this.clientMenuModel.create(doc);
    return { _id: result._id };
  }
}
