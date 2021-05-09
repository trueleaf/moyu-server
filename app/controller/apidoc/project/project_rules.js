/** 
    @description  项目规则控制器
    @author       shuxiaokai
    @create       2020/12/2 上午9:46:59
*/


const Controller = require("egg").Controller;
class ProjectRulesController extends Controller {
    /**
        @description    根据id查询项目规则
        @author         shuxiaokai
        @create         2020/12/2 上午9:46:59
        @param {string}        projectId 项目id
        @return    null
    */
    async readProjectRulesById() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
                    type: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            let result = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
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
    async updateProjectRules() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                fileInFolderLimit: {
                    type: "number",
                    required: false
                },
                dominLimit: {
                    type: "number",
                    required: false
                },
                requireDescription: {
                    type: "boolean",
                    required: false
                },
                requireValue: {
                    type: "boolean",
                    required: false
                },
                enableCollapseAnimation: {
                    type: "boolean",
                    required: false
                },
                contentType: {
                    type: "array",
                    required: false
                },
                requestMethods: {
                    type: "array",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectRules.updateProjectRules(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}
module.exports = ProjectRulesController;
