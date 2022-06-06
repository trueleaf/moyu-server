/**
    @description  钩子代码service
    @author       shuxiaokai
    @create       2022-02-11 19:46"
*/

const Service = require("egg").Service;

class ProjectCodeService extends Service {
    /**
        @description  新增代码钩子
        @author        shuxiaokai
        @create       2022-02-11 19:33"
        @param {String}        codeName 代码名称
        @param {String}        projectId 项目id
        @param {String}        remark 备注信息
        @param {String}        code 代码内容
        @param {Boolean}       isPublic 是否共享代码
        @return       null
    */
    async addProjectCode(params) {
        const { codeName, projectId, remark, code, isPublic  } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const codeInfo = {
            projectId,
            remark,
            codeName,
            code,
            isPublic,
            creator: this.ctx.userInfo.realName,
        };
        await this.ctx.model.Apidoc.Project.ProjectCode.create(codeInfo);
        return;
    }

    /**
        @description  修改钩子代码
        @author        shuxiaokai
        @create       2019-10-06 12:44"
        @param {String}        _id id值
        @param {String}        codeName 代码名称
        @param {String}        projectId 项目id
        @param {String}        remark 备注信息
        @param {String}        code 代码内容
        @param {Boolean}       isPublic 是否共享代码
        @return       null
    */
    async editProjectCode(params) { 
        const { codeName, projectId, remark, code, isPublic, _id  } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const updateDoc = {};
        if (codeName) {
            updateDoc.codeName = codeName; 
        }
        if (remark) {
            updateDoc.remark = remark; 
        }
        if (code) {
            updateDoc.code = code; 
        }
        if (isPublic != null) {
            updateDoc.isPublic = isPublic; 
        }
        await this.ctx.model.Apidoc.Project.ProjectCode.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /**
        @description  删除钩子代码
        @author        shuxiaokai
        @create       2019-10-06 12:44"
        @param {String}             projectId 项目id
        @param {Array<String>}      ids id数组
        @return       null
    */
    async deleteProjectCode(params) {
        const { ids, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = await this.ctx.model.Apidoc.Project.ProjectCode.updateMany({ 
            projectId,
            _id: { $in: ids },
        }, {
            $set: {
                enabled: false
            }
        });
        return result;
    }
    /**
        @description  获取钩子代码
        @author        shuxiaokai
        @create       2019-10-09 20:57"
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
    async getProjectCodeList(params) {
        const { pageNum, pageSize, startTime, endTime, projectId } = params;
        const query = {
            projectId,
            enabled: true,
        };
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { gt: startTime, lt: endTime };
        }
        const rows = await this.ctx.model.Apidoc.Project.ProjectCode.find(query, {
            enabled: 0
        }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.Project.ProjectCode.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /**
        @description  获取代码枚举信息
        @author        shuxiaokai
        @create       2019-11-01 10:40"
        @param {String}      projectId 项目id
        @return       null
    */
    async getProjectCodeEnum(params) {
        const { projectId } = params;
        const query = {
            projectId,
            enabled: true,
        };
        let limit = 100;
      
        const allCodes = await this.ctx.model.Apidoc.Project.ProjectCode.find(query, {
            codeName: 1,
            remark: 1,
            code: 1,
            creator: 1,
        }).limit(limit);
        return allCodes;
    }
}

module.exports = ProjectCodeService;