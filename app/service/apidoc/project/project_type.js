
/** 
    @description  项目类型枚举service
    @autor        shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;



class ProjectTypeService extends Service {
    /** 
        @description  获取项目类型枚举分页列表
        @autor        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String?}           projectTypeName 项目类型名称 
        @return       null
    */

    async getProjectTypeEnumList(params) { 
        const { pageNum, pageSize, startTime, endTime, projectTypeName } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $$gt: startTime, $$lt: endTime };
        }
        if (projectTypeName != null) {
            query.projectTypeName = new RegExp(projectTypeName, "ig");
        }
        const rows = await this.ctx.model.Apidoc.Project.ProjectTypeEnum.find(query).skip(skipNum).limit(limit);
        const total = await await this.ctx.model.Apidoc.Project.ProjectTypeEnum.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /** 
        @description  删除项目类型枚举
        @autor        shuxiaokai
        @create        2020-10-08 22:10
        @param {array}      ids 项目类型id值 
        @return       null
    */

    async deleteProjectTypeEnum(params) {
        const ids = params.ids;
        const result = await this.ctx.model.Apidoc.Project.ProjectTypeEnum.deleteMany({ _id: { $in: ids }});
        return result;
    }

    /** 
        @description  获取项目类型枚举
        @autor        shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getProjectTypeEnum() {
        const result = await this.ctx.model.Apidoc.Project.ProjectTypeEnum.find({});
        return result;
    }
    /** 
        @description  新增项目类型枚举
        @autor        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      name 名称
        @param {String}      renark 备注
        @return       null
    */

    async addProjectTypeEnum(params) {
        const doc = {};
        doc.projectTypeName = params.projectTypeName;
        doc.remark = params.remark;
        const result = await this.ctx.model.Apidoc.Project.ProjectTypeEnum.create(doc);
        return result;
    }
    /** 
        @description  修改项目类型枚举
        @autor        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}      ids 项目类型id值 
        @return       null
    */

    async editProjectTypeEnum(params) {
        const { _id, projectTypeName } = params;
        await this.ctx.model.Apidoc.Project.ProjectTypeEnum.findByIdAndUpdate({ _id }, { $set: { projectTypeName }});
        return;
    }
}

module.exports = ProjectTypeService;