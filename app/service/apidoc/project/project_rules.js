/** 
    @description  项目规则服务
    @author       shuxiaokai
    @create       2020/12/2 上午9:50:36
*/


const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");
const BASE_RULES = {
    fileInFolderLimit: 8, //单个文件夹默认限制文件个数
    dominLimit: 5, //每个项目限制配置域名个数
    contentType: [ //支持传参方式
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
    ], 
    requestMethods: [
        {
            name: "GET", //请求方式名称
            value: "get",
            enabled: true, //是否启用
            iconColor: "#28a745", //请求方式颜色
            enabledContenType: ["params"], //当前请求方式允许的ContentType
        },
        {
            name: "POST",
            value: "post",
            enabled: true, //是否启用
            iconColor: "#ffc107",
            enabledContenType: ["json", "formData"],
        },
        {
            name: "PUT",
            value: "put",
            enabled: true, //是否启用
            iconColor: "#409EFF",
            enabledContenType: ["json"],
        },
        {
            name: "DEL",
            value: "delete",
            enabled: true, 
            iconColor: "#f56c6c",
            enabledContenType: ["params"],
        },
        {
            name: "OPTIONS",
            value: "options",
            enabled: false, 
            iconColor: "#17a2b8",
            enabledContenType: ["json"],
        },
        {
            name: "PATCH",
            value: "patch",
            enabled: true, 
            iconColor: "#17a2b8",
            enabledContenType: ["json"],
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
        @create         2020/12/2 上午9:50:36
        @param {String}        projectId 数据id
        @param {number?}       fileInFolderLimit 单个文件夹默认限制文件个数
        @param {number?}       dominLimit 每个项目限制配置域名个数
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
        } = params;
        let doc = {};
        doc.projectId = projectId;
        doc.fileInFolderLimit = fileInFolderLimit || BASE_RULES.fileInFolderLimit;
        doc.dominLimit = dominLimit || BASE_RULES.dominLimit;
        doc.contentType = contentType || BASE_RULES.contentType;
        doc.requestMethods = requestMethods || BASE_RULES.requestMethods;
        await this.ctx.model.Apidoc.Project.ProjectRules.updateOne({
            projectId
        }, doc, {
            upsert: true
        });
        return;
    }
}
module.exports = ProjectRulesService;