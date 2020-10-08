

/**
    @description  文档历史记录控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class docHistoryController extends Controller {
    /**
        @description  新增文档历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @param {Object}            docInfo 文档信息
        @param {String}            operation 文档操作
        @return       null
    */

    async addDocHistory() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                docInfo: {
                    type: "object"
                },
                operation: { //copy 拷贝文档，import 文档导入
                    type: "string",
                    values: ["addFolder", "addDoc", "copyDoc", "copyFolder", "deleteFolder", "deleteDoc", "deleteMany", "editDoc", "position", "import", "rename"]
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsHistory.addDocHistory(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取文档历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {string?}           url 请求url
        @param {string?}           docName 文档名称
        @param {string?}           operator 操作者
        @param {enum?}             operationType 操作类型
        @param {string}            projectId 项目id
        @param {number?}            days 查询天数
        @return       null
    */

    async getDocHistoryList() { 
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
                url: {
                    type: "string",
                    required: false
                },
                docName: {
                    type: "string",
                    required: false,
                },
                operator: {
                    type: "string",
                    required: false
                },
                operationType: {
                    type: "string",
                    required: false
                },
                projectId: {
                    type: "string",
                },
                docId: {
                    type: "string",
                    required: false
                },
                days: {
                    type: "number",
                    required: false,
                    default: 0
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsHistory.getDocHistoryList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = docHistoryController;
