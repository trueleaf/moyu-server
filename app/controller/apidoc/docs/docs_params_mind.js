

/**
    @description  参数联想控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class docParamsMindController extends Controller {
    /**
        @description  新增参数联想
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}  projectId 项目id
        @param {Property}  mindParams 联想参数
        @return       null
    */
    async addMindParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: { //项目id
                    type: "string"
                },
                mindParams: {
                    type: "array",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParamsMind.addMindParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取参数联想
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @return       null
    */
    async geMindParams() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParamsMind.geMindParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  批量删除联想参数
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @param {string[]}           ids 需要删除数据ids
        @return       null
    */
    async deleteMindParams() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                },
                ids: {
                    type: "array"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParamsMind.deleteMindParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = docParamsMindController;
