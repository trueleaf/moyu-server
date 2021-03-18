/**
    @description  文档历史记录service
    @author        shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");
class docHistoryService extends Service {
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
        const { pageNum, pageSize, startTime, endTime, operator, operationType, projectId, days } = params;
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
        // if (url) {
        //     query.url = new RegExp(escapeStringRegexp(url));
        // }
        // if (docName) {
        //     query["docInfo.docName"] = new RegExp(escapeStringRegexp(docName));
        // }
        if (operator) {
            query.operator = new RegExp(escapeStringRegexp(operator));
        }
        if (operationType) {
            query.operation = operationType;
        }
        const rows = await this.ctx.model.Apidoc.Docs.DocsHistory.find(
            query,
            {
                projectId: 0,
                updatedAt: 0
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