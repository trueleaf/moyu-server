/**
    @description  文档历史记录service
    @author        shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");
class docHistoryService extends Service {
    /**
        @description  新增文档历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @param {Object}            docInfo 文档信息
        @param {String}            operation 文档操作
        "addFolder", "addDoc", "copyDoc", "copyFolder", "deleteFolder", "deleteDoc", "deleteMany", "editDoc", "position", "import", "export", "rename", "addUser", "deleteUser", "changeUserPermission"
        @return       null
    */

    async addDocHistory(params) {
        const { projectId, docInfo, operation, docId, item } = params;
        const doc = {};
        doc.projectId = projectId;
        doc.docInfo = docInfo;
        doc.operation = operation;
        doc.docId = docId;
        doc.operator = this.ctx.session.userInfo.realName;
        doc.item = item;
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(doc);
        return;
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
        @param {number?}           days 查询天数
        @return       null
    */

    async getDocHistoryList(params) {
        const { pageNum, pageSize, startTime, endTime, url, docName, operator, operationType, projectId, days, docId } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;
        query.projectId = projectId;
        // query.createdAt = { $gt: new Date(new Date().toDateString()) }; //只取今天数据
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        if (url) {
            query.url = new RegExp(escapeStringRegexp(url));
        }
        if (docName) {
            query["docInfo.docName"] = new RegExp(escapeStringRegexp(docName));
        }
        if (operator) {
            query.operator = new RegExp(escapeStringRegexp(operator));
        }
        if (operationType) {
            query.operation = operationType;
        }
        if (docId) {
            query.docId = docId;
        }
        const rows = await this.ctx.model.Apidoc.Docs.DocsHistory.find(
            query,
            { 
                operation: 1,
                createdAt: 1,
                operator: 1,
                docId: 1,
                "docInfo.docName": 1,
                "docInfo.isFolder": 1,
                "docInfo.method": 1,
                "docInfo.url": 1,
            }
        ).skip(skipNum).sort({ createdAt: -1 }).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.DocsHistory.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }
}

module.exports = docHistoryService;