/** 
    @description  自定义状态码service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;

class diyStatusService extends Service {
    /** 
        @description  新增自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number}            code 状态码
        @param {String}            name 状态码中文含义
        @param {String}            remark 备注
        @param {Boolean}           isSuccess 成功与否
        @return       null
    */

    async addDiyStatus(params) {
        const { code, name, remark, projectId, isSuccess } = params;
        const doc = {};
        doc.projectId = projectId;
        doc.code = code;
        doc.name = name;
        doc.remark = remark;
        doc.isSuccess = isSuccess;
        const hasCode = await this.ctx.model.Apidoc.Docs.DocsStatusCode.findOne({ projectId, code });
        if (hasCode) {
            const error = new Error("操作不被允许，状态码不允许重复");
            error.code = 1003;
            throw error;
        }
        const hasProject = await this.ctx.model.Apidoc.Project.Project.findById({ _id: projectId });
        if (!hasProject) {
            const error = new Error("操作不被允许，项目不存在");
            error.code = 4001;
            throw error;
        }

        const result = await this.ctx.model.Apidoc.Docs.DocsStatusCode.create(doc);
        return result;
    }

    /** `
        @description  修改自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      id 项目id
        @param {Number}      code 状态码
        @param {String}      name 状态码中文含义
        @param {String}      remark 备注
        @param {Boolean}           isSuccess 成功与否
        @return       null
    */

    async editDiyStatus(params) { 
        const { _id, code, name, remark, isSuccess } = params;
        const updateDoc = {
            $set: {}
        };
        if (name) {
            updateDoc.$set.name = name; 
        }
        if (code) {
            updateDoc.$set.code = code; 
        }
        if (remark) {
            updateDoc.$set.remark = remark; 
        }
        if (isSuccess) {
            updateDoc.$set.isSuccess = isSuccess; 
        }
        await this.ctx.model.Apidoc.Docs.DocsStatusCode.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /** 
        @description  删除自定义状态码
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids id数组
        @return       null
    */

    async deleteDiyStatus(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsStatusCode.deleteMany({ _id: { $in: ids }});
        return result;
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

    async getDiyStatus(params) {
        const { pageNum, pageSize, isSuccess, projectId } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (isSuccess != null) {
            query.isSuccess = isSuccess === "1";
        }
        if (projectId) {
            query.projectId = projectId;
        }
        const rows = await this.ctx.model.Apidoc.Docs.DocsStatusCode.find(query, { code: 1, name: 1, remark: 1, isSuccess: 1 }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.DocsStatusCode.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }
}

module.exports = diyStatusService;