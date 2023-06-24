import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './security/user';
import { ServerRoutes } from './security/server_routes';
import { ClientRoutes } from './security/client_routes';
import { Role } from './security/role';
import { ClientMenu } from './security/client_menu';

/*
|--------------------------------------------------------------------------
| 初始化数据
|--------------------------------------------------------------------------
*/
const INITIAL_USER = [
  {
    clientRoutes: [] as User['clientRoutes'],
    clinetMenus: [] as User['clinetMenus'],
    enable: true,
    loginName: 'admin',
    password: '98b2f89fe0f8ac91bbdab35f9a170b82',
    realName: '管理员',
    lastLogin: new Date(),
    roleIds: [
      '5edf71f2193c7d5fa0ec9b98',
      '5ede0ba06f76185204584700',
      '5ee980553c63cd01a49952e4',
    ],
    roleNames: ['权限管理-完全控制', 'api文档-完全控制', '公共基础权限'],
    salt: '3219317',
    serverRoutes: [] as User['serverRoutes'],
    starProjects: [] as User['starProjects'],
  },
  {
    clientRoutes: [],
    clinetMenus: [],
    enable: true,
    loginName: 'moyu',
    lastLogin: new Date(),
    password: '84d748e1ac5c09a425d463d18ac08b86',
    realName: '快乐摸鱼',
    roleIds: ['5ede0ba06f76185204584700', '5ee980553c63cd01a49952e4'],
    roleNames: ['api文档-完全控制', '公共基础权限'],
    salt: '2841279',
    serverRoutes: [],
    starProjects: [],
  },
];
const INITIAL_SERVER_ROUTES = [
  {
    _id: '5edd91af5fcdf3111671cb15',
    groupName: 'api文档-项目相关',
    method: 'post',
    name: '新增项目',
    path: '/api/project/add_project',
  },
  {
    _id: '5edd91af5fcdf3111671cb17',
    groupName: 'api文档-项目相关',
    method: 'get',
    name: '获取项目列表',
    path: '/api/project/project_list',
  },
  {
    _id: '5edd91af5fcdf3111671cb19',
    groupName: 'api文档-项目相关',
    method: 'get',
    name: '获取项目列表枚举',
    path: '/api/project/project_enum',
  },
  {
    _id: '5edd91af5fcdf3111671cb1b',
    groupName: 'api文档-项目相关',
    method: 'delete',
    name: '删除项目',
    path: '/api/project/delete_project',
  },
  {
    _id: '5edd91af5fcdf3111671cb1d',
    groupName: 'api文档-项目相关',
    method: 'put',
    name: '修改项目',
    path: '/api/project/edit_project',
  },
  {
    _id: '5edd91af5fcdf3111671cb29',
    groupName: 'api文档-文档操作',
    method: 'post',
    name: '新增空白文档',
    path: '/api/project/new_doc',
  },
  {
    _id: '5edd91af5fcdf3111671cb2b',
    groupName: 'api文档-文档操作',
    method: 'post',
    name: '拷贝文档',
    path: '/api/project/copy_doc',
  },
  {
    _id: '5edd91af5fcdf3111671cb2f',
    groupName: 'api文档-文档操作',
    method: 'put',
    name: '改变文档在位置',
    path: '/api/project/change_doc_pos',
  },
  {
    _id: '5edd91af5fcdf3111671cb31',
    groupName: 'api文档-文档操作',
    method: 'put',
    name: '修改节点信息(名称等)',
    path: '/api/project/change_doc_info',
  },
  {
    _id: '5edd91af5fcdf3111671cb33',
    groupName: 'api文档-文档操作',
    method: 'delete',
    name: '删除文档',
    path: '/api/project/doc',
  },
  {
    _id: '5edd91af5fcdf3111671cb35',
    groupName: 'api文档-文档操作',
    method: 'post',
    name: '填写文档',
    path: '/api/project/fill_doc',
  },
  {
    _id: '5edd91af5fcdf3111671cb37',
    groupName: 'api文档-文档操作',
    method: 'get',
    name: '获取文档导航',
    path: '/api/project/doc_tree_node',
  },
  {
    _id: '5edd91af5fcdf3111671cb39',
    groupName: 'api文档-文档操作',
    method: 'get',
    name: '获取文档详情',
    path: '/api/project/doc_detail',
  },
  {
    _id: '5edd91b05fcdf3111671cb3b',
    groupName: 'api文档-文档操作',
    method: 'get',
    name: '根据url获取文档id，用于菜单筛选',
    path: '/api/project/filter_doc',
  },
  {
    _id: '5edd91b05fcdf3111671cb47',
    groupName: 'api文档-文档辅助',
    method: 'get',
    name: '请求参数联想',
    path: '/api/project/doc_params_mind',
  },
  {
    _id: '5edd91b05fcdf3111671cb49',
    groupName: 'api文档-文档辅助',
    method: 'post',
    name: '新增预设参数组',
    path: '/api/project/doc_preset_params',
  },
  {
    _id: '5edd91b05fcdf3111671cb4b',
    groupName: 'api文档-文档辅助',
    method: 'delete',
    name: '删除预设参数组',
    path: '/api/project/doc_preset_params',
  },
  {
    _id: '5edd91b05fcdf3111671cb4d',
    groupName: 'api文档-文档辅助',
    method: 'put',
    name: '更改预设参数组',
    path: '/api/project/doc_preset_params',
  },
  {
    _id: '5edd91b05fcdf3111671cb4f',
    groupName: 'api文档-文档辅助',
    method: 'get',
    name: '获取预设参数组',
    path: '/api/project/doc_preset_params_list',
  },
  {
    _id: '5edd91b05fcdf3111671cb51',
    groupName: 'api文档-文档辅助',
    method: 'get',
    name: '获取预设参数组',
    path: '/api/project/doc_preset_params',
  },
  {
    _id: '5edd91b05fcdf3111671cb53',
    groupName: 'api文档-文档辅助',
    method: 'get',
    name: '获取预设参数组枚举',
    path: '/api/project/doc_preset_params_enum',
  },
  {
    _id: '5edd91b05fcdf3111671cb55',
    groupName: 'api文档-文档服务器',
    method: 'post',
    name: '新增服务器',
    path: '/api/project/doc_service',
  },
  {
    _id: '5edd91b05fcdf3111671cb57',
    groupName: 'api文档-文档服务器',
    method: 'delete',
    name: '删除服务器',
    path: '/api/project/doc_service',
  },
  {
    _id: '5edd91b05fcdf3111671cb59',
    groupName: 'api文档-文档服务器',
    method: 'put',
    name: '编辑服务器',
    path: '/api/project/doc_service',
  },
  {
    _id: '5edd91b05fcdf3111671cb5b',
    groupName: 'api文档-文档服务器',
    method: 'get',
    name: '获取服务器',
    path: '/api/project/doc_service',
  },
  {
    _id: '5edd91b05fcdf3111671cb5d',
    groupName: 'api文档-文档服务器',
    method: 'get',
    name: '获取服务器详情',
    path: '/api/project/doc_service_info',
  },
  {
    _id: '5edd91b15fcdf3111671cb6f',
    groupName: '权限相关-登录注册',
    method: 'get',
    name: '获取短信',
    path: '/api/security/sms',
  },
  {
    _id: '5edd91b15fcdf3111671cb71',
    groupName: '权限相关-登录注册',
    method: 'post',
    name: '用户注册',
    path: '/api/security/register',
  },
  {
    _id: '5edd91b15fcdf3111671cb73',
    groupName: '权限相关-登录注册',
    method: 'post',
    name: '手机号码登录',
    path: '/api/security/login_phone',
  },
  {
    _id: '5edd91b15fcdf3111671cb75',
    groupName: '权限相关-登录注册',
    method: 'post',
    name: '用户名密码登录',
    path: '/api/security/login_password',
  },
  {
    _id: '5edd91b15fcdf3111671cb77',
    groupName: '权限相关-登录注册',
    method: 'get',
    name: '获取验证码',
    path: '/api/security/captcha',
  },
  {
    _id: '5edd91b15fcdf3111671cb79',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '获取用户列表',
    path: '/api/security/user_list',
  },
  {
    _id: '5edd91b15fcdf3111671cb7b',
    groupName: '权限相关-用户管理',
    method: 'put',
    name: '启用和禁用用户',
    path: '/api/security/user_state',
  },
  {
    _id: '60a35ac840b59032c9225c41',
    groupName: '权限相关-用户管理',
    method: 'put',
    name: '管理员重置密码',
    path: '/api/security/reset_password',
  },
  {
    _id: '5edd91b15fcdf3111671cb7d',
    groupName: '权限相关-用户管理',
    method: 'put',
    name: '修改用户权限相关内容',
    path: '/api/security/user_permission',
  },
  {
    _id: '5edd91b15fcdf3111671cb7f',
    groupName: '权限管理-前端路由',
    method: 'post',
    name: '新增前端路由',
    path: '/api/security/client_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb81',
    groupName: '权限管理-前端路由',
    method: 'post',
    name: '批量新增前端路由',
    path: '/api/security/client_routes_multi',
  },
  {
    _id: '5edd91b15fcdf3111671cb83',
    groupName: '权限管理-前端路由',
    method: 'delete',
    name: '删除前端路由',
    path: '/api/security/client_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb85',
    groupName: '权限管理-前端路由',
    method: 'put',
    name: '修改前端路由',
    path: '/api/security/client_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb87',
    groupName: '权限管理-前端路由',
    method: 'put',
    name: '批量修改前端路由类型',
    path: '/api/security/client_routes_type',
  },
  {
    _id: '5edd91b15fcdf3111671cb89',
    groupName: '权限管理-前端路由',
    method: 'get',
    name: '获取前端路由',
    path: '/api/security/client_routes_list',
  },
  {
    _id: '5edd91b15fcdf3111671cb8b',
    groupName: '权限管理-前端路由',
    method: 'get',
    name: '获取前端路由(不分页',
    path: '/api/security/client_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb8d',
    groupName: '权限管理-后端路由',
    method: 'post',
    name: '自动获取后端路由信息',
    path: '/api/security/server_routes_auto',
  },
  {
    _id: '5edd91b15fcdf3111671cb8f',
    groupName: '权限管理-后端路由',
    method: 'post',
    name: '新增后端路由',
    path: '/api/security/server_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb91',
    groupName: '权限管理-后端路由',
    method: 'delete',
    name: '删除后端路由',
    path: '/api/security/server_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb93',
    groupName: '权限管理-后端路由',
    method: 'put',
    name: '修改后端路由',
    path: '/api/security/server_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb95',
    groupName: '权限管理-后端路由',
    method: 'put',
    name: '批量修改后端路由类型',
    path: '/api/security/server_routes_type',
  },
  {
    _id: '5edd91b15fcdf3111671cb97',
    groupName: '权限管理-后端路由',
    method: 'get',
    name: '获取后端路由',
    path: '/api/security/server_routes_list',
  },
  {
    _id: '5edd91b15fcdf3111671cb99',
    groupName: '权限管理-后端路由',
    method: 'get',
    name: '获取后端路由(不分页',
    path: '/api/security/server_routes',
  },
  {
    _id: '5edd91b15fcdf3111671cb9b',
    groupName: '权限管理-前端菜单',
    method: 'get',
    name: '获取前端菜单',
    path: '/api/security/client_menu_tree',
  },
  {
    _id: '5edd91b15fcdf3111671cb9d',
    groupName: '权限管理-前端菜单',
    method: 'post',
    name: '新增前端菜单',
    path: '/api/security/client_menu',
  },
  {
    _id: '5edd91b15fcdf3111671cb9f',
    groupName: '权限管理-前端菜单',
    method: 'put',
    name: '修改前端菜单',
    path: '/api/security/client_menu',
  },
  {
    _id: '5edd91b15fcdf3111671cba1',
    groupName: '权限管理-前端菜单',
    method: 'delete',
    name: '删除前端菜单',
    path: '/api/security/client_menu',
  },
  {
    _id: '5edd91b25fcdf3111671cba3',
    groupName: '权限管理-前端菜单',
    method: 'put',
    name: '改变菜单位置',
    path: '/api/security/client_menu_position',
  },
  {
    _id: '5edd91b25fcdf3111671cba5',
    groupName: '权限相关-角色管理',
    method: 'get',
    name: '获取角色列表',
    path: '/api/security/role_list',
  },
  {
    _id: '5edd91b25fcdf3111671cba7',
    groupName: '权限相关-角色管理',
    method: 'get',
    name: '获取角色信息',
    path: '/api/security/role_info',
  },
  {
    _id: '5edd91b25fcdf3111671cba9',
    groupName: '权限相关-角色管理',
    method: 'get',
    name: '获取角色枚举',
    path: '/api/security/role_enum',
  },
  {
    _id: '5edd91b25fcdf3111671cbab',
    groupName: '权限相关-角色管理',
    method: 'post',
    name: '新增角色',
    path: '/api/security/role',
  },
  {
    _id: '5edd91b25fcdf3111671cbad',
    groupName: '权限相关-角色管理',
    method: 'put',
    name: '修改角色',
    path: '/api/security/role',
  },
  {
    _id: '5edd91b25fcdf3111671cbaf',
    groupName: '权限相关-角色管理',
    method: 'delete',
    name: '删除角色',
    path: '/api/security/role',
  },
  {
    _id: '5ee7623c1481a140fc10f67f',
    groupName: '权限相关-用户管理',
    method: 'post',
    name: '新增单个账号',
    path: '/api/security/useradd',
  },
  {
    _id: '5ee97f0c3c63cd01a49952e3',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '获取用户信息和权限',
    path: '/api/security/user_base_info',
  },
  {
    _id: '5ee9a3ecf4365169e46c0b20',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '根据id获取用户信息',
    path: '/api/security/user_info_by_id',
  },
  {
    _id: '5ee9cd4d82195086185232be',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '获取批量新增用户excel模板',
    path: '/api/security/user_excel_template',
  },
  {
    _id: '5ef085889b54825e2c9dc8d0',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '根据名称查询用户列表',
    path: '/api/security/userListByName',
  },
  {
    _id: '5ef2fd16e06c4e3120525a53',
    groupName: 'api文档-项目相关',
    method: 'get',
    name: '获取项目基本信息',
    path: '/api/project/project_info',
  },
  {
    _id: '5f154f56807e656ffc9dc18f',
    groupName: 'api文档-文档操作',
    method: 'post',
    name: '批量新增接口',
    path: '/api/project/doc_multi',
  },
  {
    _id: '5f1cf6f8696cb02244906472',
    groupName: 'api文档-文档操作',
    method: 'post',
    name: '新增历史记录',
    path: '/api/docs/docs_history',
  },
  {
    _id: '5f1d8983fc9868398ce5cb94',
    groupName: 'api文档-历史记录',
    method: 'post',
    name: '获取文档历史记录',
    path: '/api/docs/docs_history_list',
  },
  {
    _id: '5f1e44d63e2abf46ec9956e3',
    groupName: 'api文档-全局变量',
    method: 'post',
    name: '新增全局变量',
    path: '/api/project/project_variable',
  },
  {
    _id: '5f1e44e93e2abf46ec9956e4',
    groupName: 'api文档-全局变量',
    method: 'get',
    name: '获取全局变量列表',
    path: '/api/project/project_variable',
  },
  {
    _id: '5f1e44f33e2abf46ec9956e5',
    groupName: 'api文档-全局变量',
    method: 'put',
    name: '修改全局变量',
    path: '/api/project/project_variable',
  },
  {
    _id: '5f1e45053e2abf46ec9956e6',
    groupName: 'api文档-全局变量',
    method: 'delete',
    name: '删除全局变量',
    path: '/api/project/project_variable',
  },
  {
    _id: '5f1e85a991093c38a013c312',
    groupName: 'api文档-全局变量',
    method: 'get',
    name: '获取全局变量枚举',
    path: '/api/project/project_variable_enum',
  },
  {
    _id: '5f28f5ca7a979a258c4815e0',
    groupName: 'api文档-文档操作',
    method: 'put',
    name: '发布文档',
    path: '/api/project/publish_doc',
  },
  {
    _id: '5f29180adff3fd0f6823d633',
    groupName: '权限相关-用户管理',
    method: 'post',
    name: '通过excel批量导入用户',
    path: '/api/security/add_user_by_excel',
  },
  {
    _id: '5f3cf70419d6a04bc0f58ccc',
    groupName: 'api文档-文档辅助',
    method: 'post',
    name: '新增联想参数',
    path: '/api/project/doc_params_mind',
  },
  {
    _id: '5f4cf1ddf8a3c9267429c080',
    groupName: '权限相关-用户管理',
    method: 'get',
    name: '获取用户信息',
    path: '/api/security/user_info',
  },
  {
    _id: '5f4dc07a97fc7c39f819f4c0',
    groupName: '权限相关-用户管理',
    method: 'put',
    name: '修改用户密码',
    path: '/api/security/user_password',
  },
  {
    _id: '5f4e001ba7d77849dc3928af',
    groupName: 'api文档-文档辅助',
    method: 'get',
    name: '获取mock数据',
    path: '/api/project/doc_mock',
  },
  {
    _id: '5f522db8de45f651f8140397',
    groupName: 'api文档-文档操作',
    method: 'get',
    name: '获取文档修改记录列表',
    path: '/api/docs/docs_records',
  },
  {
    _id: '5fade1e3b229918054fb4f90',
    groupName: 'api文档-导入导出',
    method: 'post',
    name: '导出为离线html',
    path: '/api/project/export/html',
  },
  {
    _id: '5fc6f4314d7b47a1cc2fb8d9',
    groupName: 'api文档-项目相关',
    method: 'get',
    name: '查询项目规则',
    path: '/api/apidoc/project/project_rules',
  },
  {
    _id: '5fc6f43e4d7b47a1cc2fb8da',
    groupName: 'api文档-项目相关',
    method: 'put',
    name: '修改项目规则',
    path: '/api/apidoc/project/project_rules',
  },
  {
    _id: '5ff166479c0b4737b81ee490',
    groupName: 'api文档-项目相关',
    method: 'put',
    name: '最近访问',
    path: '/api/project/visited',
  },
  {
    _id: '5ff1792c972b5a29804e1ac3',
    groupName: 'api文档-项目相关',
    method: 'put',
    name: '收藏项目',
    path: '/api/project/star',
  },
  {
    _id: '5ff17a0defe2a82db087c9ea',
    groupName: 'api文档-项目相关',
    method: 'put',
    name: '取消收藏',
    path: '/api/project/unstar',
  },
  {
    _id: '601f546054cf18489c4a071a',
    groupName: 'api文档-导入导出',
    method: 'post',
    name: '导出为摸鱼文档',
    path: '/api/project/export/moyu',
  },
  {
    _id: '603b9a9cc953e62b80e42e12',
    groupName: 'api文档-导入导出',
    method: 'post',
    name: '生成在线链接',
    path: '/api/project/export/online',
  },
  {
    _id: '603c8d7c1a326e4d089f99b3',
    groupName: 'api文档-导入导出',
    method: 'post',
    name: '文档导入',
    path: '/api/project/import/moyu',
  },
  {
    _id: '6041fa35c7d4e8540c1b5104',
    groupName: 'api文档-导入导出',
    method: 'get',
    name: '根据分享id获取项目详情(在线链接)',
    path: '/api/project/share',
  },
  {
    _id: '6056ca3ec8731d1cd490e95d',
    groupName: 'api文档-历史记录',
    method: 'get',
    name: '文档操作人员枚举',
    path: '/api/docs/docs_history_operator_enum',
  },
  {
    _id: '605844fa5de62017b64ec29b',
    groupName: 'api文档-文档操作',
    method: 'get',
    name: '获取文档导航(仅文件夹)',
    path: '/api/project/doc_tree_folder_node',
  },
  {
    _id: '605b25b0c6f91f1ba026a331',
    groupName: 'api文档-导入导出',
    method: 'post',
    name: '导出到其他项目',
    path: '/api/project/export/fork',
  },
  {
    _id: '606bd0f07f7e12688d52d6ec',
    groupName: 'api文档-项目相关',
    method: 'post',
    name: '导入生成项目',
    path: '/api/project/import',
  },
  {
    _id: '6075022f97e5d8281b6e9506',
    groupName: '词条管理',
    method: 'get',
    name: '根据id获取词条信息',
    path: '/api/dictionary/dictionary_by_id',
  },
  {
    _id: '60853b9306497c6d180f75e4',
    groupName: 'api文档-mock',
    method: 'get',
    name: '获取mock路径枚举',
    path: '/api/docs/path_enum',
  },
  {
    _id: '6094d52bce72da6d1758580c',
    groupName: 'api文档-文档标签',
    method: 'get',
    name: '获取文档标签枚举',
    path: '/api/docs/docs_tag_enum',
  },
  {
    _id: '6094d53cce72da6d1758580d',
    groupName: 'api文档-文档标签',
    method: 'put',
    name: '修改文档标签',
    path: '/api/docs/docs_tag',
  },
  {
    _id: '6094d549ce72da6d1758580e',
    groupName: 'api文档-文档标签',
    method: 'post',
    name: '新增文档标签',
    path: '/api/docs/docs_tag',
  },
  {
    _id: '6094d55bce72da6d1758580f',
    groupName: 'api文档-文档标签',
    method: 'delete',
    name: '删除文档标签',
    path: '/api/docs/docs_tag',
  },
  {
    _id: '60a35a65e7af1332c8669d5f',
    groupName: 'api文档-项目权限',
    method: 'post',
    name: '项目新增用户',
    path: '/api/project/add_user',
  },
  {
    _id: '60a35a7de7af1332c8669d60',
    groupName: 'api文档-项目权限',
    method: 'delete',
    name: '项目删除用户',
    path: '/api/project/delete_user',
  },
  {
    _id: '60a35ac840b59032c9225c40',
    groupName: 'api文档-项目权限',
    method: 'put',
    name: '修改用户角色(权限)',
    path: '/api/project/change_permission',
  },
  {
    _id: '60a5c271e7af1332c866a57e',
    groupName: 'api文档-文档辅助',
    method: 'post',
    name: '粘贴接口',
    path: '/api/project/paste_docs',
  },
  {
    _id: '60a7483b40b59032c9226fc3',
    groupName: 'api文档-回收站',
    method: 'post',
    name: '获取被删除文档列表',
    path: '/api/docs/docs_deleted_list',
  },
  {
    _id: '60ab4dd440b59032c9227302',
    groupName: 'api文档-回收站',
    method: 'put',
    name: '恢复删除节点',
    path: '/api/docs/docs_restore',
  },
];
const INITIAL_CLIENT_ROUTES = [
  {
    _id: '5edd91bf5fcdf3111671cbe6',
    groupName: '公用',
    name: '登录页面',
    path: '/login',
  },
  {
    _id: '5edd91bf5fcdf3111671cbe8',
    groupName: 'api文档',
    name: 'api文档-文档预览',
    path: '/v1/apidoc/doc-view',
  },
  {
    _id: '5edd91bf5fcdf3111671cbec',
    groupName: 'api文档',
    name: 'api文档-项目列表',
    path: '/v1/apidoc/doc-list',
  },
  {
    _id: '5edd91c05fcdf3111671cbf4',
    groupName: 'api文档',
    name: 'api文档-文档详情',
    path: '/v1/apidoc/doc-edit',
  },
  {
    _id: '5edd91c05fcdf3111671cbfa',
    groupName: '权限管理',
    name: '权限管理',
    path: '/v1/permission/permission',
  },
  {
    _id: '5f4b8ad9ef30243780fd6bf1',
    groupName: '设置',
    name: '设置-个人中心',
    path: '/v1/settings/user',
  },
];
const INITIAL_ROLE = [
  {
    _id: '5ede0ba06f76185204584700',
    clientBanner: ['602e7c40b4ea582923bcb36f'],
    clientRoutes: [
      '5edd91bf5fcdf3111671cbe6',
      '5edd91bf5fcdf3111671cbe8',
      '5edd91bf5fcdf3111671cbee',
      '5edd91bf5fcdf3111671cbec',
      '5edd91c05fcdf3111671cbf4',
    ],
    remark: '对文档拥有所有权限',
    roleName: 'api文档-完全控制',
    serverRoutes: [
      '5ff17a0defe2a82db087c9ea',
      '5ff1792c972b5a29804e1ac3',
      '5ff166479c0b4737b81ee490',
      '5edd91af5fcdf3111671cb15',
      '5edd91af5fcdf3111671cb17',
      '5edd91af5fcdf3111671cb19',
      '5edd91af5fcdf3111671cb1b',
      '5edd91af5fcdf3111671cb1d',
      '5edd91af5fcdf3111671cb1f',
      '5edd91af5fcdf3111671cb21',
      '5edd91af5fcdf3111671cb23',
      '5edd91af5fcdf3111671cb25',
      '5edd91af5fcdf3111671cb27',
      '5edd91af5fcdf3111671cb29',
      '5edd91af5fcdf3111671cb2b',
      '5edd91af5fcdf3111671cb2d',
      '5edd91af5fcdf3111671cb2f',
      '5edd91af5fcdf3111671cb31',
      '5edd91af5fcdf3111671cb33',
      '5edd91af5fcdf3111671cb35',
      '5edd91af5fcdf3111671cb37',
      '5edd91af5fcdf3111671cb39',
      '5edd91b05fcdf3111671cb3b',
      '5edd91b05fcdf3111671cb3d',
      '5edd91b05fcdf3111671cb3f',
      '5edd91b05fcdf3111671cb41',
      '5edd91b05fcdf3111671cb43',
      '5edd91b05fcdf3111671cb45',
      '5edd91b05fcdf3111671cb47',
      '5edd91b05fcdf3111671cb49',
      '5edd91b05fcdf3111671cb4b',
      '5edd91b05fcdf3111671cb4d',
      '5edd91b05fcdf3111671cb4f',
      '5edd91b05fcdf3111671cb51',
      '5edd91b05fcdf3111671cb53',
      '5edd91b05fcdf3111671cb55',
      '5edd91b05fcdf3111671cb57',
      '5edd91b05fcdf3111671cb59',
      '5edd91b05fcdf3111671cb5b',
      '5edd91b05fcdf3111671cb5d',
      '5edd91b05fcdf3111671cb5f',
      '5edd91b05fcdf3111671cb61',
      '5edd91b05fcdf3111671cb63',
      '5edd91b05fcdf3111671cb65',
      '5edd91b05fcdf3111671cb67',
      '5edd91b05fcdf3111671cb69',
      '5edd91b05fcdf3111671cb6b',
      '5edd91b05fcdf3111671cb6d',
      '5ef2fd16e06c4e3120525a53',
      '5f154f56807e656ffc9dc18f',
      '5f1cf705696cb02244906473',
      '5f1cf6f8696cb02244906472',
      '5f1d8983fc9868398ce5cb94',
      '5f1e44d63e2abf46ec9956e3',
      '5f1e44e93e2abf46ec9956e4',
      '5f1e44f33e2abf46ec9956e5',
      '5f1e45053e2abf46ec9956e6',
      '5f1e85a991093c38a013c312',
      '5f28f5ca7a979a258c4815e0',
      '5ef085889b54825e2c9dc8d0',
      '5f3cf70419d6a04bc0f58ccc',
      '5f4e001ba7d77849dc3928af',
      '5f522db8de45f651f8140397',
      '5fade1e3b229918054fb4f90',
      '5fc6f4314d7b47a1cc2fb8d9',
      '5fc6f43e4d7b47a1cc2fb8da',
    ],
  },
  {
    _id: '5edf71f2193c7d5fa0ec9b98',
    clientBanner: ['5eddf6a821a5aa26cc316d28', '602e7c40b4ea582923bcb36f'],
    clientRoutes: ['5edd91c05fcdf3111671cbfa', '5edd91bf5fcdf3111671cbe6'],
    remark: '拥有所有权限管理能力',
    roleName: '权限管理-完全控制',
    serverRoutes: [
      '5edd91b25fcdf3111671cba5',
      '60a35a7de7af1332c8669d60',
      '5edd91b25fcdf3111671cba7',
      '5edd91b25fcdf3111671cba9',
      '5edd91b25fcdf3111671cbab',
      '5edd91b25fcdf3111671cbad',
      '5edd91b25fcdf3111671cbaf',
      '5edd91b15fcdf3111671cb9b',
      '5edd91b15fcdf3111671cb9d',
      '5edd91b15fcdf3111671cb9f',
      '5edd91b15fcdf3111671cba1',
      '5edd91b25fcdf3111671cba3',
      '5edd91b15fcdf3111671cb79',
      '60a35ac840b59032c9225c41',
      '5edd91b15fcdf3111671cb7b',
      '5edd91b15fcdf3111671cb7d',
      '5edd91b15fcdf3111671cb7f',
      '5edd91b15fcdf3111671cb81',
      '5edd91b15fcdf3111671cb83',
      '5edd91b15fcdf3111671cb85',
      '5edd91b15fcdf3111671cb87',
      '5edd91b15fcdf3111671cb89',
      '5edd91b15fcdf3111671cb8b',
      '5edd91b15fcdf3111671cb8d',
      '5edd91b15fcdf3111671cb8f',
      '5edd91b15fcdf3111671cb91',
      '5edd91b15fcdf3111671cb93',
      '5edd91b15fcdf3111671cb95',
      '5edd91b15fcdf3111671cb97',
      '5edd91b15fcdf3111671cb99',
      '5ee7623c1481a140fc10f67f',
      '5ee9a3ecf4365169e46c0b20',
      '5ee9cd4d82195086185232be',
      '5ef085889b54825e2c9dc8d0',
      '5f29180adff3fd0f6823d633',
      '5f2a059ccf1a4a45bcb09282',
    ],
  },
  {
    _id: '5ee980553c63cd01a49952e4',
    clientBanner: [],
    clientRoutes: ['5edd91bf5fcdf3111671cbe6', '5f4b8ad9ef30243780fd6bf1'],
    remark: '登录，注册，获取用户基本信息',
    roleName: '公共基础权限',
    serverRoutes: [
      '5edd91b15fcdf3111671cb6f',
      '5edd91b15fcdf3111671cb71',
      '5edd91b15fcdf3111671cb73',
      '5edd91b15fcdf3111671cb75',
      '5edd91b15fcdf3111671cb77',
      '5ee97f0c3c63cd01a49952e3',
      '5f4cf1ddf8a3c9267429c080',
      '5f4dc07a97fc7c39f819f4c0',
    ],
  },
];
const INITIAL_CLIENT_MENUS = [
  {
    _id: '5eddf6a821a5aa26cc316d28',
    name: '权限管理',
    path: '/v1/permission/permission',
    pid: '',
    sort: '1591603491200',
    type: 'inline',
  },
  {
    _id: '602e7c40b4ea582923bcb36f',
    name: 'api文档',
    path: '/v1/apidoc/doc-list',
    pid: '',
    sort: '1613638151467',
    type: 'inline',
  },
];
/*
|--------------------------------------------------------------------------
| 初始化逻辑
|--------------------------------------------------------------------------
*/
/**
 * 初始化用户信息
 */
export async function initUser(userModel: ReturnModelType<typeof User>) {
  const userInfo = await userModel.findOne();
  if (!userInfo) {
    console.log('初始化用户信息');
    await userModel.insertMany(INITIAL_USER);
  }
  return;
}

/**
 * 初始化后端路由信息
 */
export async function initServerRoutes(
  serverRoutesModel: ReturnModelType<typeof ServerRoutes>
) {
  const serverRoutesInfo = await serverRoutesModel.findOne();
  if (!serverRoutesInfo) {
    console.log('初始化服务端路由');
    await serverRoutesModel.insertMany(INITIAL_SERVER_ROUTES);
  }
  return;
}

/**
 * 初始化前端路由信息
 */
export async function initClientRoutes(
  clientRoutesModel: ReturnModelType<typeof ClientRoutes>
) {
  const serverRoutesInfo = await clientRoutesModel.findOne();
  if (!serverRoutesInfo) {
    console.log('初始化客户端端路由');
    await clientRoutesModel.insertMany(INITIAL_CLIENT_ROUTES);
  }
  return;
}

/**
 * 初始化角色信息
 */
export async function initRoles(roleModel: ReturnModelType<typeof Role>) {
  const roleInfo = await roleModel.findOne();
  if (!roleInfo) {
    console.log('初始化角色信息');
    await roleModel.insertMany(INITIAL_ROLE);
  }
  return;
}

/**
 * 初始化前端菜单
 */
export async function initClientMenus(clientMenuModel: ReturnModelType<typeof ClientMenu>) {
  const clientMenuInfo = await clientMenuModel.findOne();
  if (!clientMenuInfo) {
    console.log('初始化前端菜单');
    await clientMenuModel.insertMany(INITIAL_CLIENT_MENUS);
  }
  return;
}
