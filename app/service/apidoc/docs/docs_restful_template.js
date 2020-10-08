/**
    @description  restful模板service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;

class restfulTemplateService extends Service {
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

    async addRestfulTemplate(params) {
        const { name, projectId, getParams, putParams, postParams, delParams } = params;
        const doc = {};
        doc.name = name;
        doc.projectId = projectId;
        doc.getParams = getParams;
        doc.postParams = postParams;
        doc.putParams = putParams;
        doc.delParams = delParams;
        await this.ctx.model.Apidoc.Docs.DocsRestfulTemplate.create(doc);
        return;
    }

    /**
        @description  修改restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 项目id
        @params {String}      projectId 项目id
        @params {Object}            get get请求
        @params {Object}            post post请求
        @params {Object}            put put请求
        @params {Object}            del delete请求
        @remark  每种请求包含  header requestParams responseParams otherParams
        @return       null
    */

    async editRestfulTemplate(params) { 
        const { _id, name, getParams, putParams, postParams, delParams } = params;
        const updateDoc = {};
        if (name) {
            updateDoc.name = name; 
        }
        if (getParams) {
            updateDoc.getParams = getParams; 
        }
        if (postParams) {
            updateDoc.postParams = postParams; 
        }
        if (putParams) {
            updateDoc.putParams = putParams; 
        }
        if (delParams) {
            updateDoc.delParams = delParams; 
        }
        await this.ctx.model.Apidoc.Docs.DocsRestfulTemplate.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /**
        @description  删除restful模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}      ids id数组
        @return       null
    */

    async deleteRestfulTemplate(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsRestfulTemplate.deleteMany({ _id: { $in: ids }});
        return result;
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

    async getRestfulTemplateList(params) {
        const { projectId, pageNum, pageSize, startTime, endTime } = params;
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
        const rows = await this.ctx.model.Apidoc.Docs.DocsRestfulTemplate.find(query, { _id: 1, name: 1 }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.DocsRestfulTemplate.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }
}

module.exports = restfulTemplateService;