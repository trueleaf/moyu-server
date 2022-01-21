/** 
    @description  项目规则服务
    @author       shuxiaokai
    @create       2020/12/2 上午9:50:36
*/


const Service = require("egg").Service;
const BASE_RULES = {
    requireDescription: false, //备注是否必填
    requireValue: false, //参数值是否必填
    enableCollapseAnimation: false, //是否开启折叠动画
    fileInFolderLimit: 8, //单个文件夹默认限制文件个数
    dominLimit: 5, //每个项目限制配置域名个数
    contentType: [ //支持传参方式
        { //restful
            name: "path",
            value: "path",
            enabled: true
        },
        {
            name: "params",
            value: "params",
            enabled: true
        },
        {
            name: "json",
            value: "json",
            enabled: true
        },
        {
            name: "form-data",
            value: "formData",
            enabled: true
        },
        {
            name: "x-www-form-urlencoded",
            value: "x-www-form-urlencoded",
            enabled: true
        },
        {
            name: "text/plain",
            value: "text/plain",
            enabled: true
        },
        {
            name: "text/html",
            value: "text/html",
            enabled: true
        },
        {
            name: "application/xml",
            value: "application/xml",
            enabled: true
        },
    ], 
    requestMethods: [
        {
            name: "GET", //请求方式名称
            value: "GET",
            enabled: true, //是否启用
            iconColor: "#28a745", //请求方式颜色
            enabledContenTypes: ["path", "params"], //当前请求方式允许的ContentType
        },
        {
            name: "POST",
            value: "POST",
            enabled: true, //是否启用
            iconColor: "#ffc107",
            enabledContenTypes: ["params", "json", "formData"],
        },
        {
            name: "PUT",
            value: "PUT",
            enabled: true, //是否启用
            iconColor: "#409EFF",
            enabledContenTypes: ["params", "json"],
        },
        {
            name: "DEL",
            value: "DELETE",
            enabled: true, 
            iconColor: "#f56c6c",
            enabledContenTypes: ["params"],
        },
        {
            name: "OPTIONS",
            value: "OPTIONS",
            enabled: false, 
            iconColor: "#17a2b8",
            enabledContenTypes: ["params", "json"],
        },
        {
            name: "PATCH",
            value: "PATCH",
            enabled: true, 
            iconColor: "#17a2b8",
            enabledContenTypes: ["params", "json"],
        },
    ],
};

class ProjectRulesService extends Service {
    /**
        @description    根据id获取项目规则
        @author         shuxiaokai
        @create         2020/12/2 上午9:50:36
        @param {string}        projectId 项目id
        @return    null
    */
    async readProjectRulesById(params) {
        const {
            projectId
        } = params;
        let result = await this.ctx.model.Apidoc.Project.ProjectRules.findOne({
            projectId,
        }).lean();
        result = result || BASE_RULES
        return result;
    }
    /**
        @description    修改项目规则
        @author         shuxiaokai
        @create         2020/12/2 上午9:46:59
        @param {String}        projectId 项目id
        @param {number?}       fileInFolderLimit 单个文件夹默认限制文件个数
        @param {number?}       dominLimit 每个项目限制配置域名个数
        @param {boolean?}      requireDescription 备注是否必填
        @param {boolean?}      requireValue 参数值是否必填
        @param {boolean?}      enableCollapseAnimation 是否开启折叠动画
        @param {array?}        contentType contentType
        @param {array?}        requestMethods 请求方法
        @return    null
    */
    async updateProjectRules(params) {
        const {
            projectId,
            fileInFolderLimit,
            dominLimit,
            contentType,
            requestMethods,
            requireDescription,
            requireValue,
            enableCollapseAnimation,
        } = params;
        let doc = {};
        doc.projectId = projectId;
        doc.fileInFolderLimit = fileInFolderLimit || BASE_RULES.fileInFolderLimit;
        doc.dominLimit = dominLimit || BASE_RULES.dominLimit;
        doc.contentType = contentType || BASE_RULES.contentType;
        doc.requestMethods = requestMethods || BASE_RULES.requestMethods;
        doc.requireDescription = requireDescription || BASE_RULES.requireDescription;
        doc.requireValue = requireValue || BASE_RULES.requireValue;
        doc.enableCollapseAnimation = enableCollapseAnimation || BASE_RULES.enableCollapseAnimation;
        await this.ctx.model.Apidoc.Project.ProjectRules.updateOne({
            projectId
        }, doc, {
            upsert: true
        });
        return;
    }
}
module.exports = ProjectRulesService;
