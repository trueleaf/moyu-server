/**
    @description  项目全局变量service
    @author        shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;

class ProjectVariableService extends Service {
    /**
        @description  新增项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            name 变量名称
        @param {String}            type 变量类型
        @param {String}            value 变量值
        @param {String}            projectId 项目id
        @return       null
    */

    async addProjectVariable(params) {
        const { name, type, value, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const doc = {};
        doc.name = name;
        doc.type = type;
        doc.value = value;
        doc.projectId = projectId;
        doc.creator = this.ctx.userInfo.realName;
        const hasName = await this.ctx.model.Apidoc.Project.ProjectVariable.findOne({ 
            projectId,
            name, 
        });
        if (hasName) {
            this.ctx.helper.throwCustomError("变量名称重复", 1003);
        }
        await this.ctx.model.Apidoc.Project.ProjectVariable.create(doc);
        return;
    }

    /**
        @description  修改项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 
        @param {String}      name 变量名称
        @param {String}      type 变量类型
        @param {String}      value 变量值
        @param {String}            projectId 项目id
        @return       null
    */

    async editProjectVariable(params) { 
        const { _id, name, type, value, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const updateDoc = {};
        if (name) {
            updateDoc.name = name; 
        }
        if (type) {
            updateDoc.type = type; 
        }
        if (value) {
            updateDoc.value = value; 
        }
        const hasName = await this.ctx.model.Apidoc.Project.ProjectVariable.findOne({
            projectId,
            _id: { $ne: _id },
            name, 
        });
        if (hasName) {
            this.ctx.helper.throwCustomError("变量名称重复", 1003);
        }
        await this.ctx.model.Apidoc.Project.ProjectVariable.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /**
        @description  删除项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids id数组
        @param {String}            projectId 项目id
        @return       null
    */
   
    async deleteProjectVariable(params) {
        const { ids, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = await this.ctx.model.Apidoc.Project.ProjectVariable.deleteMany({ _id: { $in: ids }});
        return result;
    }
    /**
        @description  获取项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
   
    async getProjectVariableList(params) {
        const { pageNum, pageSize, startTime, endTime, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const query = {
            projectId
        };
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        const rows = await this.ctx.model.Apidoc.Project.ProjectVariable.find(query, { projectId: 0, createdAt: 0, updatedAt: 0, __v: 0 }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.Project.ProjectVariable.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /**
        @description  获取项目全局变量枚举值
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @return       null
    */
   
    async getProjectVariableEnum(params) {
        const { projectId } = params;
        const result = await this.ctx.model.Apidoc.Project.ProjectVariable.find({ projectId }, { name: 1, type: 1, value: 1 });
        return result;
    }
}

module.exports = ProjectVariableService;