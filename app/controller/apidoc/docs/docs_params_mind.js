

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
        @param {String}  paths 联想请求参数
        @param {String}  queryParams 联想返回参数
        @param {String}  requestBody 联想返回参数
        @param {String}  responseParams 联想返回参数
        @return       null
    */

    async addDocParamsMind() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: { //项目id
                    type: "string"
                },
                paths: { //路径参数
                    type: "array"
                },
                queryParams: { //查询字符串
                    type: "array"
                },
                requestBody: { //请求body
                    type: "array"
                },
                responseParams: { //返回参数
                    type: "array"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParamsMind.addDocParamsMind(params);
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
   
    async getDocParamsMindEnum() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParamsMind.getDocParamsMindEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = docParamsMindController;
