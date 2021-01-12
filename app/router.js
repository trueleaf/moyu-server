"use strict";

/***
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const { router, controller } = app;
    //=====================================项目相关====================================//
    router.post("/api/project/add_project", controller.apidoc.project.project.addProject); // 新增项目
    router.get("/api/project/project_list", controller.apidoc.project.project.getProjectList); // 获取项目列表
    router.get("/api/project/project_info", controller.apidoc.project.project.getProjectInfo); // 获取项目基本信息
    router.get("/api/project/project_enum", controller.apidoc.project.project.getProjectEnum); // 获取项目列表枚举
    router.delete("/api/project/delete_project", controller.apidoc.project.project.deleteProjectList); // 删除项目
    router.put("/api/project/edit_project", controller.apidoc.project.project.editProject); // 修改项目
    router.put("/api/project/visited", controller.security.user.addLastVisit); // 记录用户访问项目记录
    router.put("/api/project/star", controller.security.user.starProject); // 收藏项目
    router.put("/api/project/unstar", controller.security.user.unStarProject); // 取消收藏项目
    
    //项目规则
    router.put("/api/apidoc/project/project_rules", controller.apidoc.project.projectRules.updateProjectRules); //修改项目规则
    router.get("/api/apidoc/project/project_rules", controller.apidoc.project.projectRules.readProjectRulesById); //根据id查询项目规则



    //项目类型枚举
    router.get("/api/project/project_type_list", controller.apidoc.project.projectType.getProjectTypeEnumList); //获取项目类型枚举列表
    router.get("/api/project/project_type_enum", controller.apidoc.project.projectType.getProjectTypeEnum); //获取项目类型枚举
    router.delete("/api/project/project_type", controller.apidoc.project.projectType.deleteProjectTypeEnum); //删除项目类型
    router.put("/api/project/project_type", controller.apidoc.project.projectType.editProjectTypeEnum); //修改项目类型
    router.post("/api/project/add_project_type", controller.apidoc.project.projectType.addProjectTypeEnum); //添加项目类型
    //=====================================文档相关====================================//
    router.post("/api/project/new_doc", controller.apidoc.docs.docs.addEmptyDoc); //新增空白文档
    router.post("/api/project/copy_doc", controller.apidoc.docs.docs.copyDoc); //拷贝文档
    router.post("/api/project/new_doc_multi", controller.apidoc.docs.docs.newMultiDoc); //新增多个空白文档
    router.put("/api/project/change_doc_pos", controller.apidoc.docs.docs.changeDocPosition); //改变文档在位置
    router.put("/api/project/change_doc_info", controller.apidoc.docs.docs.editDocInfo); //修改文档树形结构基础信息
    router.put("/api/project/publish_doc", controller.apidoc.docs.docs.publishDoc); //发布文档
    router.delete("/api/project/doc", controller.apidoc.docs.docs.deleteDoc); //删除文档
    router.post("/api/project/doc_multi", controller.apidoc.docs.docs.addMultiDocs); //新增多个文档
    router.post("/api/project/fill_doc", controller.apidoc.docs.docs.fillDoc); //填写文档
    router.get("/api/project/doc_tree_node", controller.apidoc.docs.docs.getDocTreeNode); //获取文档导航
    router.get("/api/project/doc_detail", controller.apidoc.docs.docs.getDocDetail); //获取文档详情
    router.get("/api/project/filter_doc", controller.apidoc.docs.docs.filterDoc); //根据url获取文档id，用于菜单筛选
    router.get("/api/project/doc_word", controller.apidoc.docs.docs.convertDocToWord); //将文档导出为word
    router.get("/api/project/doc_mock", controller.apidoc.docs.docs.getMockData); //获取文档mock数据
    router.get("/api/project/doc_offline_data", controller.apidoc.docs.docs.getDocOfflineData); //获取文档全部离线数据
    //=====================================内置请求返回参数相关路由====================================//
    router.post("/api/apidoc/docs/docs_internal_params", controller.apidoc.docs.docsInternalParams.createDocsInternalParams); //新增内置请求返回参数
    router.put("/api/apidoc/docs/docs_internal_params", controller.apidoc.docs.docsInternalParams.updateDocsInternalParams); //修改内置请求返回参数
    router.get("/api/apidoc/docs/docs_internal_params", controller.apidoc.docs.docsInternalParams.readDocsInternalParamsById); //根据id查询内置请求返回参数
    router.get("/api/apidoc/docs/docs_internal_params_list", controller.apidoc.docs.docsInternalParams.readDocsInternalParamsList); //以列表形式获取内置请求返回参数
    router.get("/api/apidoc/docs/docs_internal_params_enum", controller.apidoc.docs.docsInternalParams.readDocsInternalParamsEnum); //以枚举形式获取内置请求返回参数
    router.delete("/api/apidoc/docs/docs_internal_params", controller.apidoc.docs.docsInternalParams.deleteDocsInternalParams); //删除内置请求返回参数


    //======文档历史记录
    router.post("/api/docs/docs_history", controller.apidoc.docs.docsHistory.addDocHistory); //新增历史记录
    router.get("/api/docs/docs_history", controller.apidoc.docs.docsHistory.getDocHistoryList); //获取项目文档操作历史记录
    router.get("/api/docs/docs_records", controller.apidoc.docs.docsRecords.getDocsRecordsList); //获取文档修改记录

    
    //======全局变量
    router.post("/api/project/project_variable", controller.apidoc.project.projectVariable.addProjectVariable); //新增预设参数组
    router.delete("/api/project/project_variable", controller.apidoc.project.projectVariable.deleteProjectVariable); //删除预设参数组
    router.put("/api/project/project_variable", controller.apidoc.project.projectVariable.editProjectVariable); //填写预设参数组
    router.get("/api/project/project_variable", controller.apidoc.project.projectVariable.getProjectVariableList); //获取预设参数组
    router.get("/api/project/project_variable_enum", controller.apidoc.project.projectVariable.getProjectVariableEnum); //获取预设参数组枚举
    
    //======自定义参数列表
    router.post("/api/project/docs_params", controller.apidoc.docs.docsParams.addDocsParams); //新增预设参数组
    router.delete("/api/project/docs_params", controller.apidoc.docs.docsParams.deleteDocsParams); //删除预设参数组
    router.put("/api/project/docs_params", controller.apidoc.docs.docsParams.editDocsParams); //填写预设参数组
    router.get("/api/project/docs_params", controller.apidoc.docs.docsParams.getDocsParams); //获取预设参数组

    //======联想参数相关
    router.get("/api/project/doc_params_mind", controller.apidoc.docs.docsParamsMind.getDocParamsMindEnum); //获取参数联想
    router.post("/api/project/doc_params_mind", controller.apidoc.docs.docsParamsMind.addDocParamsMind); //新增联想参数


    
    //======预设参数组
    router.post("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.addPresetParams); //新增预设参数组
    router.delete("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.deletePresetParams); //删除预设参数组
    router.put("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.editPresetParams); //填写预设参数组
    router.get("/api/project/doc_preset_params_list", controller.apidoc.docs.docsParamsPreset.getPresetParamsList); //获取预设参数组列表
    router.get("/api/project/doc_preset_params_enum", controller.apidoc.docs.docsParamsPreset.getPresetParamsEnum); //获取预设参数组枚举
    router.get("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.getPresetParams); //获取预设参数数据
    //======host(服务器)列表
    router.post("/api/project/doc_service", controller.apidoc.docs.docsServices.addService); //新增服务器
    router.delete("/api/project/doc_service", controller.apidoc.docs.docsServices.deleteService); //删除服务器
    router.put("/api/project/doc_service", controller.apidoc.docs.docsServices.editService); //填写服务器
    router.get("/api/project/doc_service", controller.apidoc.docs.docsServices.getServiceList); //获取服务器
    router.get("/api/project/doc_service_info", controller.apidoc.docs.docsServices.getServiceInfo); //获取服务器详情

    //======restful模板
    router.post("/api/doc/restful_template", controller.apidoc.docs.docsRestfulTemplate.addRestfulTemplate); //新增restful模板
    router.delete("/api/doc/restful_template", controller.apidoc.docs.docsRestfulTemplate.deleteRestfulTemplate); //删除restful模板
    router.put("/api/doc/restful_template", controller.apidoc.docs.docsRestfulTemplate.editRestfulTemplate); //填写restful模板
    router.get("/api/doc/restful_template", controller.apidoc.docs.docsRestfulTemplate.getRestfulTemplateList); //获取restful模板   

    //======自定义状态码
    router.post("/api/project/doc_code", controller.apidoc.docs.docsStatus.addDiyStatus); //新增文档状态码
    router.delete("/api/project/doc_code", controller.apidoc.docs.docsStatus.deleteDiyStatus); //删除文档状态码
    router.put("/api/project/doc_code", controller.apidoc.docs.docsStatus.editDiyStatus); //填写文档状态码
    router.get("/api/project/doc_code", controller.apidoc.docs.docsStatus.getDiyStatusList); //获取文档状态码
    //=====================================代理服务器====================================//




    //=====================================鉴权与安全====================================//
    //======登录注册
    router.get("/api/security/sms", controller.security.user.getMsgCode); //获取短信
    router.post("/api/security/register", controller.security.user.register); //用户注册
    router.post("/api/security/login_phone", controller.security.user.loginWithPhone); //手机号码登录
    router.post("/api/security/login_password", controller.security.user.loginWithPassword); //用户名密码登录
    router.post("/api/security/login_guest", controller.security.user.loginGuest); //体验用户登录
    router.get("/api/security/captcha", controller.security.user.getSVGCaptcha); //获取验证码
    
    //======用户管理
    router.get("/api/security/user_base_info", controller.security.user.getUserBaseInfo); //获取用户基本信息
    router.get("/api/security/user_info", controller.security.user.getUserInfo); //获取用户基本信息
    router.get("/api/security/user_excel_template", controller.security.user.getUserExcelTemplate); //获取批量新增用户excel模板
    router.post("/api/security/add_user_by_excel", controller.security.user.addUserByExcel); //通过excel批量导入用户
    router.get("/api/security/user_info_by_id", controller.security.user.getUserInfoById); //获取用户信息
    router.get("/api/security/user_list", controller.security.user.getUserList); //获取用户列表
    router.put("/api/security/user_state", controller.security.user.changeUserState); //启用和禁用用户
    router.put("/api/security/user_permission", controller.security.user.changeUserPermission); //修改用户权限相关内容
    router.put("/api/security/user_password", controller.security.user.changeUserPassword); //修改用户密码
    router.post("/api/security/useradd", controller.security.user.addUser); //新增用户
    router.get("/api/security/userListByName", controller.security.user.getUserListByName); //新增用户
    // router.post("/api/security/multi_useradd", controller.security.user.addMultiUser); //批量新增用户

    //======资源(前端路由)管理
    router.post("/api/security/client_routes", controller.security.clientRoutes.addClientRoutes); //新增前端路由
    router.post("/api/security/client_routes_multi", controller.security.clientRoutes.addMultiClientRoutes); //批量新增前端路由
    router.delete("/api/security/client_routes", controller.security.clientRoutes.deleteClientRoutes); //删除前端路由
    router.put("/api/security/client_routes", controller.security.clientRoutes.editClientRoutes); //修改前端路由
    router.put("/api/security/client_routes_type", controller.security.clientRoutes.editMultiClientRoutesType); //批量修改前端路由类型
    router.get("/api/security/client_routes_list", controller.security.clientRoutes.getClientRoutesList); //获取前端路由
    router.get("/api/security/client_routes", controller.security.clientRoutes.getClientRoutes); //获取前端路由(不分页)

    //======资源(后端路由)管理
    router.post("/api/security/server_routes_auto", controller.security.serverRoutes.autoAddServerRoutes); //自动获取后端路由信息
    router.post("/api/security/server_routes", controller.security.serverRoutes.addServerRoutes); //新增后端路由
    router.delete("/api/security/server_routes", controller.security.serverRoutes.deleteServerRoutes); //删除后端路由
    router.put("/api/security/server_routes", controller.security.serverRoutes.editServerRoutes); //修改后端路由
    router.put("/api/security/server_routes_type", controller.security.serverRoutes.editMultiServerRoutesType); //批量修改后端路由类型
    router.get("/api/security/server_routes_list", controller.security.serverRoutes.getServerRoutesList); //获取后端路由
    router.get("/api/security/server_routes", controller.security.serverRoutes.getServerRoutes); //获取后端路由(不分页)
    //======资源(前端菜单)管理
    router.get("/api/security/client_menu_tree", controller.security.clientMenu.getTreeClientMenu); //获取前端菜单
    router.post("/api/security/client_menu", controller.security.clientMenu.addClientMenu); //新增前端菜单
    router.put("/api/security/client_menu", controller.security.clientMenu.editClientMenu); //修改前端菜单
    router.delete("/api/security/client_menu", controller.security.clientMenu.deleteClientMenu); //删除前端菜单
    router.put("/api/security/client_menu_position", controller.security.clientMenu.changeClientMenuPosition); //改变菜单位置
    //=====角色管理
    router.get("/api/security/role_list", controller.security.role.getRoleList); //获取角色列表
    router.get("/api/security/role_info", controller.security.role.getRoleInfo); //获取角色信息
    router.get("/api/security/role_enum", controller.security.role.getRoleEnum); //获取角色枚举
    router.post("/api/security/role", controller.security.role.addRole); //新增角色
    router.put("/api/security/role", controller.security.role.editRole); //修改角色
    router.delete("/api/security/role", controller.security.role.deleteRole); //删除角色
    //=====================================文件上传====================================//
    router.get("/api/oss/sts", controller.oss.oss.getSts); //获取临时授权凭证
    router.get("/api/oss/file_url", controller.oss.oss.generateFileUrl); //生成临时文件访问url
    router.get("/api/oss/list_file", controller.oss.oss.getFileList); //获取文件列表
    router.post("/api/oss/folder", controller.oss.oss.addFolder); //获取文件列表
    // router.post("/api/oss/file", controller.oss.oss.addFile); //上传文件
    router.delete("/api/oss/file", controller.oss.oss.deleteFile); //删除文件或者文件列表


    //=====================================可视化运维====================================//
    router.get("/api/eoms/pwd", controller.eoms.linux.pwd); //查看当前目录信息
    router.get("/ssh/connect", controller.eoms.ssh.connect); //连接当前项目
    router.get("/ssh/exec", controller.eoms.ssh.exec); //执行命令
};
