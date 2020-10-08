/** 
    @description  文档常见参数service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;

class DocsParamsService extends Service {
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

    async addDocsParams(params) {
        // const { label = "", value = "", dataType = "string", required = true, description = "" } = params;
        const doc = params;
        await this.ctx.model.Apidoc.Docs.DocsParams.create(doc);
        return;
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

    async editDocsParams(params) { 
        const { _id, label, value, dataType, required, description } = params;
        const updateDoc = {};
        if (label) {
            updateDoc.label = label; 
        }
        if (value || value === "") {
            updateDoc.value = value; 
        }
        if (dataType) {
            updateDoc.dataType = dataType; 
        }
        if (required) {
            updateDoc.required = required; 
        }
        if (description || description === "") {
            updateDoc.description = description; 
        }
        await this.ctx.model.Apidoc.Docs.DocsParams.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /** 
        @description  删除文档常见参数
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids id数组
        @return       null
    */

    async deleteDocsParams(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsParams.deleteMany({ _id: { $in: ids }});
        return result;
    }
    /** 
        @description  获取文档常见参数
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String}            projectId 项目id
        @return       null
    */

    async getDocsParams(params) {
        const { pageNum, pageSize, startTime, endTime, projectId } = params;
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
        const rows = await this.ctx.model.Apidoc.Docs.DocsParams.find(query).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.DocsParams.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }
}

module.exports = DocsParamsService;