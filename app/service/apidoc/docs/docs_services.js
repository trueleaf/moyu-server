/** 
    @description  服务器service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;

class ServicesService extends Service {
    /** 
        @description  新增服务器
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      name  //服务器名称
        @param {String}      url //服务器url
        @param {String}      remark //备注
        @param {String}      projectId 项目id
        @return       null
    */

    async addService(params) {
        const { name, url, remark, projectId } = params;
        const doc = {};
        doc.name = name;
        doc.url = url;
        doc.remark = remark;
        doc.projectId = projectId;
        const hasService = await this.ctx.model.Apidoc.Docs.DocsServices.findOne({ projectId, url });
        const serviceNum = await this.ctx.model.Apidoc.Docs.DocsServices.countDocuments({ projectId });
        if (hasService) {
            this.ctx.helper.throwCustomError("当前服务器地址已经存在", 1003);
        }
        // if (serviceNum > 5) {
        //     this.ctx.helper.throwCustomError("每个项目只允许最多5个地址", 1005);
        // }
        await this.ctx.model.Apidoc.Docs.DocsServices.create(doc);
        return;
    }
    /** 
        @description  获取服务器列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String}            projectId 项目id
        @return       null
    */

    async getServicesList(params) {
        const { pageNum, pageSize, startTime, endTime, projectId } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;

        let rows = null;
        let total = null;
        let result = {};
        query.projectId = projectId;
        query.enabled = true;
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
            rows = await this.ctx.model.Apidoc.Docs.DocsServices.find(query, { name: 1, url: 1 }).skip(skipNum).limit(limit);
            total = await this.ctx.model.Apidoc.Docs.DocsServices.find(query).countDocuments();
            result.rows = rows;
            result.total = total;
        } else {
            result = await this.ctx.model.Apidoc.Docs.DocsServices.find(query, { name: 1, url: 1 }).skip(skipNum).limit(limit);
        }
        return result;
    }

    /** 
        @description  获取服务器详情
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @param {String}            id 服务区id
        @return       null
    */

    async getServiceInfo(params) {
        const { id, projectId } = params;
        const query = {};
        query.id = id;
        query.projectId = projectId;
        const result = await this.ctx.model.Apidoc.Docs.DocsServices.findOne(query) || {};
        return result;
    }
    /** 
        @description  修改服务器列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      id 项目id
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async editService(params) { 
        const { _id, name, url, remark } = params;
        const updateDoc = {};
        if (name) {
            updateDoc.name = name; 
        }
        if (url) {
            updateDoc.url = url; 
        }
        if (remark) {
            updateDoc.remark = remark; 
        }
        await this.ctx.model.Apidoc.Docs.DocsServices.findOneAndUpdate({ _id }, updateDoc);
        return;
    }

    /** 
        @description  删除服务器
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids id数组
        @return       null
    */

    async deleteService(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsServices.deleteMany({ _id: { $in: ids }});
        return result;
    }
}

module.exports = ServicesService;