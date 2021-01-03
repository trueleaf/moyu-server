
/** 
 * @description        后端路由表
 * @author              shuxiaokai
 * @create             2020-05-19 18:16
 * @remark             接口信息代表是否允许调用当前接口，前端路由信息代表是否展示前端内容，两者是完全不同的概念
 */

const INITIAL_SERVER_ROUTES = [
    {
        "_id": "5edd91af5fcdf3111671cb15",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "post",
        "name": "新增项目",
        "path": "/api/project/add_project"
    },
    {
        "_id": "5edd91af5fcdf3111671cb17",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "get",
        "name": "获取项目列表",
        "path": "/api/project/project_list"
    },
    {
        "_id": "5edd91af5fcdf3111671cb19",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "get",
        "name": "获取项目列表",
        "path": "/api/project/project_enum"
    },
    {
        "_id": "5edd91af5fcdf3111671cb1b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "delete",
        "name": "删除项目",
        "path": "/api/project/delete_project"
    },
    {
        "_id": "5edd91af5fcdf3111671cb1d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "put",
        "name": "修改项目",
        "path": "/api/project/edit_project"
    },
    {
        "_id": "5edd91af5fcdf3111671cb1f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目类型",
        "method": "get",
        "name": "获取项目类型枚举列表",
        "path": "/api/project/project_type_list"
    },
    {
        "_id": "5edd91af5fcdf3111671cb21",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目类型",
        "method": "get",
        "name": "获取项目类型枚举",
        "path": "/api/project/project_type_enum"
    },
    {
        "_id": "5edd91af5fcdf3111671cb23",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目类型",
        "method": "delete",
        "name": "删除项目类型枚举",
        "path": "/api/project/project_type"
    },
    {
        "_id": "5edd91af5fcdf3111671cb25",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目类型",
        "method": "put",
        "name": "修改项目类型枚举",
        "path": "/api/project/project_type"
    },
    {
        "_id": "5edd91af5fcdf3111671cb27",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目类型",
        "method": "post",
        "name": "添加项目类型",
        "path": "/api/project/add_project_type"
    },
    {
        "_id": "5edd91af5fcdf3111671cb29",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "新增空白文档",
        "path": "/api/project/new_doc"
    },
    {
        "_id": "5edd91af5fcdf3111671cb2b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "拷贝文档",
        "path": "/api/project/copy_doc"
    },
    {
        "_id": "5edd91af5fcdf3111671cb2d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "新增多个空白文档",
        "path": "/api/project/new_doc_multi"
    },
    {
        "_id": "5edd91af5fcdf3111671cb2f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "put",
        "name": "改变文档在位置",
        "path": "/api/project/change_doc_pos"
    },
    {
        "_id": "5edd91af5fcdf3111671cb31",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "put",
        "name": "修改文档树形结构基础信息",
        "path": "/api/project/change_doc_info"
    },
    {
        "_id": "5edd91af5fcdf3111671cb33",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "delete",
        "name": "删除文档",
        "path": "/api/project/doc"
    },
    {
        "_id": "5edd91af5fcdf3111671cb35",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "填写文档",
        "path": "/api/project/fill_doc"
    },
    {
        "_id": "5edd91af5fcdf3111671cb37",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "获取文档导航",
        "path": "/api/project/doc_tree_node"
    },
    {
        "_id": "5edd91af5fcdf3111671cb39",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "获取文档详情",
        "path": "/api/project/doc_detail"
    },
    {
        "_id": "5edd91b05fcdf3111671cb3b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "根据url获取文档id，用于菜单筛选",
        "path": "/api/project/filter_doc"
    },
    {
        "_id": "5edd91b05fcdf3111671cb3d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "将文档导出为word",
        "path": "/api/project/doc_word"
    },
    {
        "_id": "5edd91b05fcdf3111671cb3f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "post",
        "name": "新增预设参数组",
        "path": "/api/project/docs_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb41",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "delete",
        "name": "删除预设参数组",
        "path": "/api/project/docs_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb43",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "put",
        "name": "填写预设参数组",
        "path": "/api/project/docs_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb45",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "获取预设参数组",
        "path": "/api/project/docs_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb47",
        "__v": "0",
        "enabled": "false",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "请求参数联想",
        "path": "/api/project/doc_params_mind"
    },
    {
        "_id": "5edd91b05fcdf3111671cb49",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "post",
        "name": "新增预设参数组",
        "path": "/api/project/doc_preset_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb4b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "delete",
        "name": "删除预设参数组",
        "path": "/api/project/doc_preset_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb4d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "put",
        "name": "填写预设参数组",
        "path": "/api/project/doc_preset_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb4f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "获取预设参数组",
        "path": "/api/project/doc_preset_params_list"
    },
    {
        "_id": "5edd91b05fcdf3111671cb51",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "获取预设参数组",
        "path": "/api/project/doc_preset_params"
    },
    {
        "_id": "5edd91b05fcdf3111671cb53",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "获取预设参数组枚举",
        "path": "/api/project/doc_preset_params_enum"
    },
    {
        "_id": "5edd91b05fcdf3111671cb55",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档服务器",
        "method": "post",
        "name": "新增服务器",
        "path": "/api/project/doc_service"
    },
    {
        "_id": "5edd91b05fcdf3111671cb57",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档服务器",
        "method": "delete",
        "name": "删除服务器",
        "path": "/api/project/doc_service"
    },
    {
        "_id": "5edd91b05fcdf3111671cb59",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档服务器",
        "method": "put",
        "name": "填写服务器",
        "path": "/api/project/doc_service"
    },
    {
        "_id": "5edd91b05fcdf3111671cb5b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档服务器",
        "method": "get",
        "name": "获取服务器",
        "path": "/api/project/doc_service"
    },
    {
        "_id": "5edd91b05fcdf3111671cb5d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档服务器",
        "method": "get",
        "name": "获取服务器详情",
        "path": "/api/project/doc_service_info"
    },
    {
        "_id": "5edd91b05fcdf3111671cb5f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-restful模板",
        "method": "post",
        "name": "新增restful模板",
        "path": "/api/doc/restful_template"
    },
    {
        "_id": "5edd91b05fcdf3111671cb61",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-restful模板",
        "method": "delete",
        "name": "删除restful模板",
        "path": "/api/doc/restful_template"
    },
    {
        "_id": "5edd91b05fcdf3111671cb63",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-restful模板",
        "method": "put",
        "name": "填写restful模板",
        "path": "/api/doc/restful_template"
    },
    {
        "_id": "5edd91b05fcdf3111671cb65",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-restful模板",
        "method": "get",
        "name": "获取restful模板",
        "path": "/api/doc/restful_template"
    },
    {
        "_id": "5edd91b05fcdf3111671cb67",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档状态码",
        "method": "post",
        "name": "新增文档状态码",
        "path": "/api/project/doc_code"
    },
    {
        "_id": "5edd91b05fcdf3111671cb69",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档状态码",
        "method": "delete",
        "name": "删除文档状态码",
        "path": "/api/project/doc_code"
    },
    {
        "_id": "5edd91b05fcdf3111671cb6b",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档状态码",
        "method": "put",
        "name": "填写文档状态码",
        "path": "/api/project/doc_code"
    },
    {
        "_id": "5edd91b05fcdf3111671cb6d",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档状态码",
        "method": "get",
        "name": "获取文档状态码",
        "path": "/api/project/doc_code"
    },
    {
        "_id": "5edd91b15fcdf3111671cb6f",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-登录注册",
        "method": "get",
        "name": "获取短信",
        "path": "/api/security/sms"
    },
    {
        "_id": "5edd91b15fcdf3111671cb71",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-登录注册",
        "method": "post",
        "name": "用户注册",
        "path": "/api/security/register"
    },
    {
        "_id": "5edd91b15fcdf3111671cb73",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-登录注册",
        "method": "post",
        "name": "手机号码登录",
        "path": "/api/security/login_phone"
    },
    {
        "_id": "5edd91b15fcdf3111671cb75",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-登录注册",
        "method": "post",
        "name": "用户名密码登录",
        "path": "/api/security/login_password"
    },
    {
        "_id": "5edd91b15fcdf3111671cb77",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-登录注册",
        "method": "get",
        "name": "获取验证码",
        "path": "/api/security/captcha"
    },
    {
        "_id": "5edd91b15fcdf3111671cb79",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "获取用户列表",
        "path": "/api/security/user_list"
    },
    {
        "_id": "5edd91b15fcdf3111671cb7b",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "put",
        "name": "启用和禁用用户",
        "path": "/api/security/user_state"
    },
    {
        "_id": "5edd91b15fcdf3111671cb7d",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "put",
        "name": "修改用户权限相关内容",
        "path": "/api/security/user_permission"
    },
    {
        "_id": "5edd91b15fcdf3111671cb7f",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "post",
        "name": "新增前端路由",
        "path": "/api/security/client_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb81",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "post",
        "name": "批量新增前端路由",
        "path": "/api/security/client_routes_multi"
    },
    {
        "_id": "5edd91b15fcdf3111671cb83",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "delete",
        "name": "删除前端路由",
        "path": "/api/security/client_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb85",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "put",
        "name": "修改前端路由",
        "path": "/api/security/client_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb87",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "put",
        "name": "批量修改前端路由类型",
        "path": "/api/security/client_routes_type"
    },
    {
        "_id": "5edd91b15fcdf3111671cb89",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "get",
        "name": "获取前端路由",
        "path": "/api/security/client_routes_list"
    },
    {
        "_id": "5edd91b15fcdf3111671cb8b",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端路由",
        "method": "get",
        "name": "获取前端路由(不分页",
        "path": "/api/security/client_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb8d",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "post",
        "name": "自动获取后端路由信息",
        "path": "/api/security/server_routes_auto"
    },
    {
        "_id": "5edd91b15fcdf3111671cb8f",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "post",
        "name": "新增后端路由",
        "path": "/api/security/server_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb91",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "delete",
        "name": "删除后端路由",
        "path": "/api/security/server_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb93",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "put",
        "name": "修改后端路由",
        "path": "/api/security/server_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb95",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "put",
        "name": "批量修改后端路由类型",
        "path": "/api/security/server_routes_type"
    },
    {
        "_id": "5edd91b15fcdf3111671cb97",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "get",
        "name": "获取后端路由",
        "path": "/api/security/server_routes_list"
    },
    {
        "_id": "5edd91b15fcdf3111671cb99",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "get",
        "name": "获取后端路由(不分页",
        "path": "/api/security/server_routes"
    },
    {
        "_id": "5edd91b15fcdf3111671cb9b",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端菜单",
        "method": "get",
        "name": "获取前端菜单",
        "path": "/api/security/client_menu_tree"
    },
    {
        "_id": "5edd91b15fcdf3111671cb9d",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端菜单",
        "method": "post",
        "name": "新增前端菜单",
        "path": "/api/security/client_menu"
    },
    {
        "_id": "5edd91b15fcdf3111671cb9f",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端菜单",
        "method": "put",
        "name": "修改前端菜单",
        "path": "/api/security/client_menu"
    },
    {
        "_id": "5edd91b15fcdf3111671cba1",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端菜单",
        "method": "delete",
        "name": "删除前端菜单",
        "path": "/api/security/client_menu"
    },
    {
        "_id": "5edd91b25fcdf3111671cba3",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-前端菜单",
        "method": "put",
        "name": "改变菜单位置",
        "path": "/api/security/client_menu_position"
    },
    {
        "_id": "5edd91b25fcdf3111671cba5",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "get",
        "name": "获取角色列表",
        "path": "/api/security/role_list"
    },
    {
        "_id": "5edd91b25fcdf3111671cba7",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "get",
        "name": "获取角色信息",
        "path": "/api/security/role_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cba9",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "get",
        "name": "获取角色枚举",
        "path": "/api/security/role_enum"
    },
    {
        "_id": "5edd91b25fcdf3111671cbab",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "post",
        "name": "新增角色",
        "path": "/api/security/role"
    },
    {
        "_id": "5edd91b25fcdf3111671cbad",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "put",
        "name": "修改角色",
        "path": "/api/security/role"
    },
    {
        "_id": "5edd91b25fcdf3111671cbaf",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-角色管理",
        "method": "delete",
        "name": "删除角色",
        "path": "/api/security/role"
    },
    {
        "_id": "5edd91b25fcdf3111671cbb1",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "get",
        "name": "获取临时授权凭证",
        "path": "/api/oss/sts"
    },
    {
        "_id": "5edd91b25fcdf3111671cbb3",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "get",
        "name": "生成临时文件访问url",
        "path": "/api/oss/file_url"
    },
    {
        "_id": "5edd91b25fcdf3111671cbb5",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "get",
        "name": "获取文件列表",
        "path": "/api/oss/list_file"
    },
    {
        "_id": "5edd91b25fcdf3111671cbb7",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "post",
        "name": "获取文件列表",
        "path": "/api/oss/folder"
    },
    {
        "_id": "5edd91b25fcdf3111671cbb9",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "post",
        "name": "上传文件",
        "path": "/api/oss/file"
    },
    {
        "_id": "5edd91b25fcdf3111671cbbb",
        "__v": "0",
        "enabled": "true",
        "groupName": "oss",
        "method": "delete",
        "name": "删除文件或者文件列表",
        "path": "/api/oss/file"
    },
    {
        "_id": "5edd91b25fcdf3111671cbbd",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "post",
        "name": "新增文件类型",
        "path": "/api/share/file_type"
    },
    {
        "_id": "5edd91b25fcdf3111671cbbf",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "delete",
        "name": "删除文件类型",
        "path": "/api/share/file_type"
    },
    {
        "_id": "5edd91b25fcdf3111671cbc1",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "put",
        "name": "填写文件类型",
        "path": "/api/share/file_type"
    },
    {
        "_id": "5edd91b25fcdf3111671cbc3",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "get",
        "name": "获取文件类型",
        "path": "/api/share/file_type"
    },
    {
        "_id": "5edd91b25fcdf3111671cbc5",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "get",
        "name": "获取文件类型枚举",
        "path": "/api/share/file_enum"
    },
    {
        "_id": "5edd91b25fcdf3111671cbc7",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "post",
        "name": "新增文件类型",
        "path": "/api/share/file_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cbc9",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "delete",
        "name": "删除文件类型",
        "path": "/api/share/file_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cbcb",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "put",
        "name": "填写文件类型",
        "path": "/api/share/file_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cbcd",
        "__v": "0",
        "enabled": "true",
        "groupName": "",
        "method": "get",
        "name": "获取文件类型",
        "path": "/api/share/file_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cbcf",
        "__v": "0",
        "enabled": "false",
        "groupName": "",
        "method": "post",
        "name": "服务端生成echarts",
        "path": "/api/node-echarts"
    },
    {
        "_id": "5edd91b25fcdf3111671cbd1",
        "__v": "0",
        "enabled": "false",
        "groupName": "",
        "method": "post",
        "name": "生成dashboard",
        "path": "/api/visual/dashboard"
    },
    {
        "_id": "5edd91b25fcdf3111671cbd3",
        "__v": "0",
        "enabled": "false",
        "groupName": "",
        "method": "get",
        "name": "生成dashboard",
        "path": "/api/visual/dashboard_info"
    },
    {
        "_id": "5edd91b25fcdf3111671cbd5",
        "__v": "0",
        "enabled": "false",
        "groupName": "",
        "method": "post",
        "name": "服务端生成echarts",
        "path": "/api/interview/compile_code"
    },
    {
        "_id": "5edd91b35fcdf3111671cbd7",
        "__v": "0",
        "enabled": "false",
        "groupName": "在线面试-oj相关",
        "method": "get",
        "name": "获取oj题目列表",
        "path": "/api/interview/oj_subject_list"
    },
    {
        "_id": "5edd91b35fcdf3111671cbd9",
        "__v": "0",
        "enabled": "false",
        "groupName": "在线面试-oj相关",
        "method": "post",
        "name": "新增oj题目",
        "path": "/api/interview/oj_subject"
    },
    {
        "_id": "5edd91b35fcdf3111671cbdb",
        "__v": "0",
        "enabled": "false",
        "groupName": "在线面试-oj相关",
        "method": "put",
        "name": "修改oj题目列表",
        "path": "/api/interview/oj_subject"
    },
    {
        "_id": "5edd91b35fcdf3111671cbdd",
        "__v": "0",
        "enabled": "false",
        "groupName": "在线面试-oj相关",
        "method": "delete",
        "name": "删除oj题目",
        "path": "/api/interview/oj_subject"
    },
    {
        "_id": "5ee7623c1481a140fc10f67f",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "post",
        "name": "新增单个账号",
        "path": "/api/security/useradd"
    },
    {
        "_id": "5ee97f0c3c63cd01a49952e3",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "获取用户信息和权限",
        "path": "/api/security/user_base_info"
    },
    {
        "_id": "5ee9a3ecf4365169e46c0b20",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限管理-后端路由",
        "method": "get",
        "name": "根据id获取用户信息",
        "path": "/api/security/user_info_by_id"
    },
    {
        "_id": "5ee9cd4d82195086185232be",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "获取批量新增用户excel模板",
        "path": "/api/security/user_excel_template"
    },
    {
        "_id": "5ef085889b54825e2c9dc8d0",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "根据名称查询用户列表",
        "path": "/api/security/userListByName"
    },
    {
        "_id": "5ef2fd16e06c4e3120525a53",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "get",
        "name": "获取项目基本信息",
        "path": "/api/project/project_info"
    },
    {
        "_id": "5f154f56807e656ffc9dc18f",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "批量新增接口",
        "path": "/api/project/doc_multi"
    },
    {
        "_id": "5f1cf6f8696cb02244906472",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "post",
        "name": "新增一条历史记录",
        "path": "/api/docs/docs_history"
    },
    {
        "_id": "5f1cf705696cb02244906473",
        "__v": "0",
        "enabled": "false",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "获取历史记录",
        "path": "/api/docs/docs_history"
    },
    {
        "_id": "5f1d8983fc9868398ce5cb94",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "获取文档历史记录",
        "path": "/api/docs/docs_history_list"
    },
    {
        "_id": "5f1e44d63e2abf46ec9956e3",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-全局变量",
        "method": "post",
        "name": "新增全局变量",
        "path": "/api/project/project_variable"
    },
    {
        "_id": "5f1e44e93e2abf46ec9956e4",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-全局变量",
        "method": "get",
        "name": "获取全局变量列表",
        "path": "/api/project/project_variable"
    },
    {
        "_id": "5f1e44f33e2abf46ec9956e5",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-全局变量",
        "method": "put",
        "name": "修改全局变量",
        "path": "/api/project/project_variable"
    },
    {
        "_id": "5f1e45053e2abf46ec9956e6",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-全局变量",
        "method": "delete",
        "name": "删除全局变量",
        "path": "/api/project/project_variable"
    },
    {
        "_id": "5f1e85a991093c38a013c312",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-全局变量",
        "method": "get",
        "name": "获取全局变量枚举",
        "path": "/api/project/project_variable_enum"
    },
    {
        "_id": "5f28f5ca7a979a258c4815e0",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "put",
        "name": "发布文档",
        "path": "/api/project/publish_doc"
    },
    {
        "_id": "5f29180adff3fd0f6823d633",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "post",
        "name": "通过excel批量导入用户",
        "path": "/api/security/add_user_by_excel"
    },
    {
        "_id": "5f2a059ccf1a4a45bcb09282",
        "__v": "0",
        "enabled": "false",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "下载用户导入模板",
        "path": "/api/security/user_template"
    },
    {
        "_id": "5f3cf70419d6a04bc0f58ccc",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "post",
        "name": "新增联想参数",
        "path": "/api/project/doc_params_mind"
    },
    {
        "_id": "5f4cf1ddf8a3c9267429c080",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "get",
        "name": "获取用户信息",
        "path": "/api/security/user_info"
    },
    {
        "_id": "5f4dc07a97fc7c39f819f4c0",
        "__v": "0",
        "enabled": "true",
        "groupName": "权限相关-用户管理",
        "method": "put",
        "name": "修改用户密码",
        "path": "/api/security/user_password"
    },
    {
        "_id": "5f4e001ba7d77849dc3928af",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档辅助",
        "method": "get",
        "name": "获取mock数据",
        "path": "/api/project/doc_mock"
    },
    {
        "_id": "5f522db8de45f651f8140397",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "获取文档修改记录列表",
        "path": "/api/docs/docs_records"
    },
    {
        "_id": "5f584e0071ce75462c03eed6",
        "__v": "0",
        "enabled": "false",
        "groupName": "WebRTC",
        "method": "get",
        "name": "获取rtc凭证数据",
        "path": "/api/webrtc/rtc_info"
    },
    {
        "_id": "5f91693375c7903084f4d685",
        "__v": "0",
        "enabled": "true",
        "groupName": "可视化运维",
        "method": "get",
        "name": "获取当前所在路径",
        "path": "/api/eoms/pwd"
    },
    {
        "_id": "5fade1e3b229918054fb4f90",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-文档操作",
        "method": "get",
        "name": "导出为离线html",
        "path": "/api/project/doc_offline_data"
    },
    {
        "_id": "5fc6f4314d7b47a1cc2fb8d9",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "get",
        "name": "查询项目规则",
        "path": "/api/apidoc/project/project_rules"
    },
    {
        "_id": "5fc6f43e4d7b47a1cc2fb8da",
        "__v": "0",
        "enabled": "true",
        "groupName": "api文档-项目相关",
        "method": "put",
        "name": "修改项目规则",
        "path": "/api/apidoc/project/project_rules"
    },
    {
        "_id": "5ff166479c0b4737b81ee490",
        "groupName": "api文档-项目相关",
        "enabled": "true",
        "name": "最近访问",
        "path": "/api/project/visited",
        "method": "put",
        "__v": "0",
    },
    {
        "_id": "5ff1792c972b5a29804e1ac3",
        "groupName": "api文档-项目相关",
        "enabled": "true",
        "name": "收藏项目",
        "path": "/api/project/star",
        "method": "put",
        "__v": "0"
    },
    {
        "_id": "5ff17a0defe2a82db087c9ea",
        "groupName": "api文档-项目相关",
        "enabled": "true",
        "name": "取消收藏",
        "path": "/api/project/unstar",
        "method": "put",
        "__v": "0"
    }
]
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const serverRoutesSchema = new Schema({
        name: { //路由名称
            type: String,
        },
        path: { //路由地址
            type: String,
        },
        method: { //请求方法
            type: String,
        },
        groupName: { //分组名称，只用于前端过滤
            type: String,
            default: ""
        },
        enabled: { //使能
            type: Boolean,
            default: true
        }
    }, { timestamps: true });
    const serverRoutesModel = mongoose.model("security_server_routes", serverRoutesSchema);
    serverRoutesModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化服务端路由")
            serverRoutesModel.insertMany(INITIAL_SERVER_ROUTES);
        }
    });
    return serverRoutesModel;
};