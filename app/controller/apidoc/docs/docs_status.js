

/** 
    @description  自定义状态码控制器
    @author       shuxiaokai
    @create       
*/


const Controller = require("egg").Controller;

class diyStatusController extends Controller {
    /** 
        @description  新增自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number}            code 状态码
        @param {String}            name 状态码中文含义
        @param {String?}            remark 备注
        @param {Boolean}           isSuccess 成功与否
        @param {String}            projectId 项目id 
        @return       null
    */

    async addDiyStatus() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                },
                code: {
                    type: "number",
                    convertType: "number"
                },
                name: {
                    type: "string",
                },
                remark: {
                    type: "string",
                    required: false,
                },
                isSuccess: {
                    type: "boolean",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsStatus.addDiyStatus(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  删除自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}            ids 
        @return       null
    */

    async deleteDiyStatus() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsStatus.deleteDiyStatus(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 
        @param {Number}      code 状态码
        @param {String}      name 状态码中文含义
        @param {String}      remark 备注
        @param {Boolean}     isSuccess 成功与否
        @return       null
    */

    async editDiyStatus() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                code: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                name: {
                    type: "string",
                    required: false
                },
                remark: {
                    type: "string",
                    required: false
                },
                isSuccess: {
                    type: "boolean",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsStatus.editDiyStatus(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {Boolean?}          isSuccess 是否为成功状态码   
        @param {String}            projectId 项目id   
        @return       null
    */

    async getDiyStatusList() {
        try {
            const params = this.ctx.query;
            const reqRule = {
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
                isSuccess: {
                    type: "enum",
                    values: ["0", "1"],
                    required: false
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsStatus.getDiyStatus(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = diyStatusController;
