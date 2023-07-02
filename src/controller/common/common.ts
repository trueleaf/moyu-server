import { Inject, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Project } from '../../entity/project/project';
import { LoginTokenInfo } from '../../types/types';
import { throwError } from '../../utils/utils';
const ReadOnlyUrl = [
  {
    url: '/api/project/project_list',
    method: 'get',
  },
  {
    url: '/api/project/project_info',
    method: 'get',
  },
  {
    url: '/api/project/project_full_info',
    method: 'get',
  },
  {
    url: '/api/project/project_members',
    method: 'get',
  },
  {
    url: '/api/project/visited',
    method: 'put',
  },
  {
    url: '/api/project/star',
    method: 'put',
  },
  {
    url: '/api/project/unstar',
    method: 'put',
  },
  {
    url: '/api/project/share_info',
    method: 'get',
  },
  {
    url: '/api/project/share',
    method: 'get',
  },
  {
    url: '/api/apidoc/project/project_rules',
    method: 'get',
  },
  {
    url: '/api/project/doc_tree_node',
    method: 'get',
  },
  {
    url: '/api/project/doc_tree_folder_node',
    method: 'get',
  },
  {
    url: '/api/project/doc_detail',
    method: 'get',
  },
  {
    url: '/api/project/doc_mock',
    method: 'get',
  },
  {
    url: '/api/project/export/html',
    method: 'post',
  },
  {
    url: '/api/project/export/moyu',
    method: 'post',
  },
  {
    url: '/api/project/export/online',
    method: 'post',
  },
  {
    url: '/api/docs/docs_history',
    method: 'post',
  },
  {
    url: '/api/docs/docs_records',
    method: 'get',
  },
  {
    url: '/api/docs/docs_history_operator_enum',
    method: 'get',
  },
  {
    url: '/api/docs/docs_deleted_list',
    method: 'get',
  },
  {
    url: '/api/project/project_variable',
    method: 'get',
  },
  {
    url: '/api/project/project_variable_enum',
    method: 'get',
  },
  {
    url: '/api/project/doc_preset_params_list',
    method: 'get',
  },
  {
    url: '/api/project/doc_preset_params_enum',
    method: 'get',
  },
  {
    url: '/api/project/doc_preset_params',
    method: 'get',
  },
  {
    url: '/api/project/doc_service',
    method: 'get',
  },
  {
    url: '/api/project/doc_service_info',
    method: 'get',
  },
];

@Provide()
export class CommonController {
  @Inject()
  private ctx: Context & { tokenInfo: LoginTokenInfo };

  @InjectEntityModel(Project)
  private projectModel: ReturnModelType<typeof Project>;

  async checkDocOperationPermissions(projectId: string) {
    const userInfo = this.ctx.tokenInfo;
    const method = this.ctx.request.method.toLocaleLowerCase();
    const URL = this.ctx.request.URL;
    const projectInfo = await this.projectModel.findById({ _id: projectId });
    if (!projectInfo) {
      //项目不存在
      return throwError(4002, '暂无当前项目权限');
    }
    const accessUsers = projectInfo.members; //不是当前项目成员
    const currentUserPermission = accessUsers.find(
      user => user.userId === userInfo.id
    );
    //如果用户为只读用户，那么限制用户对于文档操作，只有白名单里面接口允许用户操作
    const accessableReadonlyUrl = ReadOnlyUrl.find(
      urlInfo =>
        urlInfo.method === method && URL.pathname.startsWith(urlInfo.url)
    );
    if (!currentUserPermission) {
      return throwError(4002, '暂无当前项目权限');
    } else if (
      currentUserPermission.permission === 'readOnly' &&
      !accessableReadonlyUrl
    ) {
      return throwError(4002, '暂无当前操作权限');
    }
  }
}
