

/**
    @description  文档修改历史记录控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class docsRecordsController extends Controller {
    /**
        @description  新增文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            docId 文档id
        @param {String}            docInfo 文档详情
        @return       null
    */
    async addDocsRecords() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                docId: {
                    type: "string"
                },
                docInfo: {
                    type: "object"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRecords.addDocsRecords(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  删除文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}            ids 
        @return       null
    */
    async deleteDocsRecords() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsRecords.deleteDocsRecords(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  获取文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}            docId 文档id
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getDocsRecordsList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                docId: {
                    type: "string"
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
            const result = await this.ctx.service.apidoc.docs.docsRecords.getDocsRecordsList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = docsRecordsController;
