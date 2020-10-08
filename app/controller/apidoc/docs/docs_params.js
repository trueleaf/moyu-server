/** 
    @description  文档常用参数控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Controller = require("egg").Controller;

class DocsParamsController extends Controller {
    /** 
        @description  新增文档常用参数控制器
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            label 参数中文名称
        @param {String}            value 参数中文对应名称
        @param {String}            dataType 参数类型
        @param {String}            required 是否必填
        @param {String}            description 描述
        @param {String}            projectId 项目id
        @return       null
    */

    async addDocsParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                label: {
                    type: "string"
                },
                value: {
                    type: "string",
                    required: false
                },
                dataType: {
                    type: "string",
                },
                required: {
                    type: "boolean",
                },
                description: {
                    type: "string",
                    required: false
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParams.addDocsParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  修改文档常用参数
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 
        @param {String?}     label 参数中文名称
        @param {String?}     value 参数中文对应名称
        @param {String?}     dataType 参数类型
        @param {String?}     required 是否必填
        @param {String?}     description 描述
        @return       null
    */

    async editDocsParams() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                label: {
                    type: "string",
                    required: false,
                    widelyUndefined: false
                },
                value: {
                    type: "string",
                    required: false,
                    widelyUndefined: false
                },
                dataType: {
                    type: "string",
                    required: false
                },
                required: {
                    type: "boolean",
                    required: false
                },
                description: {
                    type: "string",
                    required: false,
                    widelyUndefined: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParams.editDocsParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  删除文档常用参数
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}            ids 
        @return       null
    */

    async deleteDocsParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParams.deleteDocsParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  获取文档常见参数
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String?}           label 参数名称
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {String}            projectId 项目id   
        @return       null
    */

    async getDocsParams() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                label: {
                    type: "string",
                    required: false
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
                projectId: {
                    type: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsParams.getDocsParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = DocsParamsController;
