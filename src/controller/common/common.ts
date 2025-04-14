import { Inject, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Project } from '../../entity/project/project.js';
import { LoginTokenInfo } from '../../types/types.js';
import { throwError } from '../../utils/utils.js';
import { Group } from '../../entity/security/group.js';
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
  @InjectEntityModel(Group)
  private groupModel: ReturnModelType<typeof Group>;


  async checkDocOperationPermissions(projectId: string) {
    const method = this.ctx.request.method.toLowerCase();
    const URL = this.ctx.request.URL;
    const projectInfo = await this.projectModel.findById({ _id: projectId });
    if (!projectInfo) {
      //项目不存在
      return throwError(4002, '暂无当前项目权限');
    }

    const matchedProject = await this.projectModel.findOne({ _id: projectId }).lean();
    if (!matchedProject) {
      return throwError(1011, '项目不存在')
    }
    const members = matchedProject.members;
    const userMembers = members.filter(v => v.type === 'user');
    const groupIds = members.filter(v => v.type === 'group').map(v => v.id);
    const matchedGroups = await this.groupModel.find({ _id: { $in: groupIds } }, { members: 1 }).lean();
    matchedGroups.forEach(group => {
      group.members.forEach(groupMember => {
        userMembers.push({
          name: groupMember.loginName,
          id: groupMember.userId,
          type: 'user',
          permission: groupMember.permission
        });
      })
    })
    const matchedUsers = userMembers.filter(v => v.id === this.ctx.tokenInfo.id);
    if (matchedUsers.length === 0) {
      return throwError(1012, '暂无操作权限')
    }
    let permission: 'readOnly' | 'admin' | 'readAndWrite' = 'readOnly';
    //取最大权限
    for(let i = 0; i < matchedUsers.length; i++) {
      if (matchedUsers[i].permission === 'admin') {
        permission = 'admin';
        break;
      } else if (matchedUsers[i].permission === 'readAndWrite') {
        permission = 'readAndWrite';
        break;
      }
    }
    //如果用户为只读用户，那么限制用户对于文档操作，只有白名单里面接口允许用户操作
    const accessableReadonlyUrl = ReadOnlyUrl.find(
      urlInfo =>
        urlInfo.method === method && URL.pathname.startsWith(urlInfo.url)
    );
   if (permission === 'readOnly' && !accessableReadonlyUrl) {
      return throwError(1012, '只读用户不允许当前操作');
    }
  }
}
