

/** 
    @description  restful模板控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class restfulTemplateController extends Controller {
    /** 
        @description  新增restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 名称
        @params {String}            projectId 项目id
        @params {Object}            getParams get相关参数
        @params {Object}            postParams post相关参数
        @params {Object}            putParams put相关参数
        @params {Object}            delParams delete相关参数
        @remark  每种请求包含  header requestParams responseParams otherParams
        @return       null
    */

    async addRestfulTemplate() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: { //名称
                    type: "string"
                },
                projectId: { //项目id
                    type: "string"
                },
                getParams: {
                    type: "object"
                },
                postParams: {
                    type: "object",
                },
                putParams: {
                    type: "object"
                },
                delParams: {
                    type: "object"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRestfulTemplate.addRestfulTemplate(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  删除restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */

    async deleteRestfulTemplate() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRestfulTemplate.deleteRestfulTemplate(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @return       null
    */

    async editRestfulTemplate() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRestfulTemplate.editRestfulTemplate(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  获取restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getRestfulTemplateList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string",
                },
                pageNum: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                pageSize: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                startTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                endTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRestfulTemplate.getRestfulTemplateList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = restfulTemplateController;
