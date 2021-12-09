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
        @param {array?}            operators 操作者
        @param {array?}            operationTypes 操作类型
        @param {string}            projectId 项目id
        @return       null
    */

    async getDocHistoryList(params) {
        const { pageNum, pageSize, startTime, endTime, operators, operationTypes, projectId, url, docName } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;
        query.projectId = projectId;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        if (url) {
            query["recordInfo.url"] = new RegExp(escapeStringRegexp(url));
        }
        if (docName) {
            query["info.name"] = new RegExp(escapeStringRegexp(docName));
        }
        if (operators && operators.length > 0) {
            query.operator = {
                $in: operators,
            };
        }
        if (operationTypes && operationTypes.length > 0) {
            query.operation = {
                $in: operationTypes,
            }
        }
        console.log(query)
        const rows = await this.ctx.model.Apidoc.Docs.DocsHistory.find(
            query,
            {
                projectId: 0,
                updatedAt: 0,
                __v: 0,
            }
        ).skip(skipNum).sort({ createdAt: -1 }).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.DocsHistory.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /**
        @description  获取文档所有操作人员
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}            projectId 项目id
        @return       null
    */
    async getHistoryOperatorEnum(params) {
        const { projectId } = params;
        const docInfo = await this.ctx.model.Apidoc.Project.Project.findOne(
            { 
                _id: projectId,
                enabled: true 
            }, { 
                members: 1,
                owner: 1,
                _id: 0
            }
        ).sort({ createdAt: 1 }).lean();
        const members = docInfo.members.map(doc => {
            return {
                name: doc.realName || doc.loginName,
                permission: doc.permission
            };
        });
        return members;
    }
    
}

module.exports = docHistoryService;