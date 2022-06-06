

/**
    @description  公共请求头
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class ProjectCommonHeaderController extends Controller {
    /**
     * 根据id获取请求头数据
     */
     async getProjectCommonHeaderById() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                id: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCommonHeader.getProjectCommonHeaderById(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * 修改公共请求头
     */
    async editProjectCommonHeader() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                id: {
                    type: "string"
                },
                commonHeaders: {
                    type: "array"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCommonHeader.editProjectCommonHeader(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
     * 获取公共请求头
     */
    async getProjectCommonHeaders() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCommonHeader.getProjectCommonHeaders(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = ProjectCommonHeaderController;
