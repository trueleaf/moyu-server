"use strict";

/***
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const { router, controller } = app;
    router.post("/test", controller.test.test.test); // 获取项目列表
    //=====================================项目相关====================================//
    router.post("/api/project/add_project", controller.apidoc.project.project.addProject); // 新增项目
    router.get("/api/project/project_list", controller.apidoc.project.project.getProjectList); // 获取项目列表
    router.get("/api/project/project_list_by_url", controller.apidoc.project.project.getProjectByUrl); // 根据url获取项目信息

    router.get("/api/project/project_info", controller.apidoc.project.project.getProjectInfo); // 获取项目基本信息
    router.get("/api/project/project_full_info", controller.apidoc.project.project.getProjectFullInfo); // 获取项目完成信息
    router.get("/api/project/project_members", controller.apidoc.project.project.getProjectMembers); // 获取项目成员信息
    router.get("/api/project/project_enum", controller.apidoc.project.project.getProjectEnum); // 获取项目列表枚举
    router.delete("/api/project/delete_project", controller.apidoc.project.project.deleteProject); // 删除项目
    router.put("/api/project/edit_project", controller.apidoc.project.project.editProject); // 修改项目
    router.post("/api/project/add_user", controller.apidoc.project.project.addUser); // 项目新增用户
    router.delete("/api/project/delete_user", controller.apidoc.project.project.deleteUser); // 项目删除用户
    router.put("/api/project/change_permission", controller.apidoc.project.project.changePermission); // 改变用户权限
    router.put("/api/project/visited", controller.security.user.addLastVisit); // 记录用户访问项目记录
    router.put("/api/project/star", controller.security.user.starProject); // 收藏项目
    router.put("/api/project/unstar", controller.security.user.unStarProject); // 取消收藏项目
    router.post("/api/project/import", controller.apidoc.project.project.importAsProject); // 直接导入项目
    //项目规则
    router.put("/api/apidoc/project/project_rules", controller.apidoc.project.projectRules.updateProjectRules); //修改项目规则
    router.get("/api/apidoc/project/project_rules", controller.apidoc.project.projectRules.readProjectRulesById); //根据id查询项目规则
    //生成代码
    router.get("/api/apidoc/project/code", controller.apidoc.project.projectCode.getProjectCodeList); //获取已有代码列表
    router.get("/api/apidoc/project/code_enum", controller.apidoc.project.projectCode.getProjectCodeEnum); //获取项目code枚举信息
    router.post("/api/apidoc/project/code", controller.apidoc.project.projectCode.addProjectCode); //新增代码
    router.put("/api/apidoc/project/code", controller.apidoc.project.projectCode.editProjectCode); //修改代码信息
    router.delete("/api/apidoc/project/code", controller.apidoc.project.projectCode.deleteProjectCode); //删除代码
    //公共请求头
    router.get("/api/project/common_header_by_id", controller.apidoc.project.projectCommonHeader.getProjectCommonHeaderById); //根据id获取某个请求头
    router.get("/api/project/common_headers", controller.apidoc.project.projectCommonHeader.getProjectCommonHeaders); //获取公共请求头
    router.put("/api/project/common_header", controller.apidoc.project.projectCommonHeader.editProjectCommonHeader); //修改公共请求头
    //=====================================文档相关====================================//
    router.post("/api/project/new_doc", controller.apidoc.docs.docs.addEmptyDoc); //新增空白文档
    router.post("/api/project/copy_doc", controller.apidoc.docs.docs.copyDoc); //拷贝文档
    router.put("/api/project/change_doc_pos", controller.apidoc.docs.docs.changeDocPosition); //改变文档在位置
    router.put("/api/project/change_doc_info", controller.apidoc.docs.docs.changeDocName); //修改文档树形结构基础信息
    router.delete("/api/project/doc", controller.apidoc.docs.docs.deleteDoc); //删除文档
    router.post("/api/project/doc_multi", controller.apidoc.docs.docs.addMultiDocs); //新增多个文档
    router.post("/api/project/fill_doc", controller.apidoc.docs.docs.fillDoc); //填写文档
    router.get("/api/project/doc_tree_node", controller.apidoc.docs.docs.getDocTreeNode); //获取文档导航
    router.get("/api/project/doc_tree_folder_node", controller.apidoc.docs.docs.getDocTreeFolderNode); //获取文档导航(仅获取文件夹信息，用于一个项目向另一个项目导入)
    router.get("/api/project/doc_detail", controller.apidoc.docs.docs.getDocDetail); //获取文档详情
    router.get("/api/project/doc_mock", controller.apidoc.docs.docs.getMockData); //获取文档mock数据
    router.post("/api/project/paste_docs", controller.apidoc.docs.docs.pasteDocs); //粘贴文档
    


    //=====================================离线分享====================================//
    router.post("/api/project/export/online", controller.apidoc.docs.docsOperation.generateOnlineLink); //生成在线链接
    router.put("/api/project/export/online", controller.apidoc.docs.docsOperation.editOnlineLink); //修改在线链接
    router.get("/api/project/export/online_list", controller.apidoc.docs.docsOperation.getOnlineLinkList); //分页获取在线链接
    router.delete("/api/project/export/online", controller.apidoc.docs.docsOperation.deleteOnlineLink); //删除在线链接
    
    router.get("/api/project/share_info", controller.apidoc.project.project.getOnlineProjectInfo); // 根据分享id获取项目基本信息
    router.get("/api/project/share_check", controller.apidoc.project.project.checkOnlineProjectPassword); // 检查密码是否匹配(在线链接)
    router.get("/api/project/export/share_banner", controller.apidoc.project.project.getShareBanner); //根据id和密码获取分享文档的banner信息
    router.get("/api/project/export/share_project_info", controller.apidoc.project.project.getSharedProjectInfo); //获取分享项目基本信息
    router.get("/api/project/share_doc_detail", controller.apidoc.project.project.getSharedDocDetail); //获取分享项目接口详情
    //=====================================导出文档====================================//
    router.post("/api/project/export/pdf", controller.apidoc.docs.docsOperation.exportAsPdf); //导出为pdf
    router.post("/api/project/export/html", controller.apidoc.docs.docsOperation.exportAsHTML); //获取文档全部离线数据
    router.post("/api/project/export/word", controller.apidoc.docs.docsOperation.exportAsWord); //导出为word
    router.post("/api/project/export/fork", controller.apidoc.docs.docsOperation.forkDocs); //导出部分文档到别的项目
    router.post("/api/project/export/moyu", controller.apidoc.docs.docsOperation.exportAsMoyuDoc); //导出为摸鱼数据
    router.post("/api/project/import/moyu", controller.apidoc.docs.docsOperation.importAsMoyuDoc); //导入摸鱼数据

    //==========文档标签
    router.get("/api/docs/docs_tag_enum", controller.apidoc.docs.docsTag.getDocsTagEnum); //获取文档标签枚举
    router.put("/api/docs/docs_tag", controller.apidoc.docs.docsTag.editDocsTag); //修改文档标签
    router.post("/api/docs/docs_tag", controller.apidoc.docs.docsTag.addDocsTag); //新增文档标签
    router.delete("/api/docs/docs_tag", controller.apidoc.docs.docsTag.deleteDocsTag); //删除文档标签


    //======文档历史记录
    router.post("/api/docs/docs_history", controller.apidoc.docs.docsHistory.getDocHistoryList); //获取项目文档操作历史记录
    router.get("/api/docs/docs_records", controller.apidoc.docs.docsRecords.getDocsRecordsList); //获取文档修改记录
    router.get("/api/docs/docs_history_operator_enum", controller.apidoc.docs.docsHistory.getHistoryOperatorEnum); //获取文档操作人员基本信息

    //======文档被删除纪录
    router.post("/api/docs/docs_deleted_list", controller.apidoc.docs.docs.getDocDeletedList); //获取文档修改记录
    router.put("/api/docs/docs_restore", controller.apidoc.docs.docs.restroeNode); //恢复已删除节点


    //======全局变量
    router.post("/api/project/project_variable", controller.apidoc.project.projectVariable.addProjectVariable); //新增预设参数组
    router.delete("/api/project/project_variable", controller.apidoc.project.projectVariable.deleteProjectVariable); //删除预设参数组
    router.put("/api/project/project_variable", controller.apidoc.project.projectVariable.editProjectVariable); //填写预设参数组
    router.get("/api/project/project_variable", controller.apidoc.project.projectVariable.getProjectVariableList); //获取预设参数组
    router.get("/api/project/project_variable_enum", controller.apidoc.project.projectVariable.getProjectVariableEnum); //获取预设参数组枚举
    

    //======联想参数相关
    router.get("/api/project/doc_params_mind", controller.apidoc.docs.docsParamsMind.geMindParams); //获取参数联想
    router.delete("/api/project/doc_params_mind", controller.apidoc.docs.docsParamsMind.deleteMindParams); //批量删除联想参数
    router.post("/api/project/doc_params_mind", controller.apidoc.docs.docsParamsMind.addMindParams); //新增联想参数
    
    //======预设参数组
    router.post("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.addPresetParams); //新增预设参数组
    router.delete("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.deletePresetParams); //删除预设参数组
    router.put("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.editPresetParams); //填写预设参数组
    router.get("/api/project/doc_preset_params_list", controller.apidoc.docs.docsParamsPreset.getPresetParamsList); //获取预设参数组列表
    router.get("/api/project/doc_preset_params_enum", controller.apidoc.docs.docsParamsPreset.getPresetParamsEnum); //获取预设参数组枚举
    router.get("/api/project/doc_preset_params", controller.apidoc.docs.docsParamsPreset.getPresetParamsInfo); //获取预设参数数据

    //======host(服务器)列表
    router.post("/api/project/doc_service", controller.apidoc.docs.docsServices.addService); //新增服务器
    router.delete("/api/project/doc_service", controller.apidoc.docs.docsServices.deleteService); //删除服务器
    router.put("/api/project/doc_service", controller.apidoc.docs.docsServices.editService); //填写服务器
    router.get("/api/project/doc_service", controller.apidoc.docs.docsServices.getServiceList); //获取服务器
    router.get("/api/project/doc_service_info", controller.apidoc.docs.docsServices.getServiceInfo); //获取服务器详情


    //=====================================鉴权与安全====================================//
    //======登录注册
    router.get("/api/security/sms", controller.security.user.getMsgCode); //获取短信
    router.post("/api/security/register", controller.security.user.register); //用户注册
    router.post("/api/security/login_phone", controller.security.user.loginWithPhone); //手机号码登录
    router.post("/api/security/login_password", controller.security.user.loginWithPassword); //用户名密码登录
    router.post("/api/security/login_guest", controller.security.user.loginGuest); //体验用户登录
    router.get("/api/security/captcha", controller.security.user.getSVGCaptcha); //获取验证码
    router.post("/api/security/user_reset_password", controller.security.user.resetPassword); //重置密码
    
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
   
    //=====================================代理服务器====================================//
};
