

/**
    @description  生成代码控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class ProjectCodeController extends Controller {
    /**
        @description  新增代码
        @author        shuxiaokai
        @create       2022-06-01 22:33"
        @param {String}        codeName 代码名称
        @param {String}        projectId 项目id
        @param {String}        remark 备注信息
        @param {String}        code 代码内容
        @param {Boolean}       isPublic 是否共享代码
        @return       null
    */
    async addProjectCode() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                codeName: {
                    type: "string"
                },
                remark: {
                    type: "string",
                    required: false,
                },
                code: {
                    type: "string",
                },
                isPublic: {
                    type: "boolean",
                    required: false,
                    default: false,
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCode.addProjectCode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除代码
        @author        shuxiaokai
        @create       2019-11-01 10:39"
        @param {String}           projectId 项目id
        @param {Array<String>}    ids 
        @return       null
    */
    async deleteProjectCode() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCode.deleteProjectCode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改代码
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
    async editProjectCode() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                codeName: {
                    type: "string"
                },
                remark: {
                    type: "string",
                    required: false,
                },
                code: {
                    type: "string",
                },
                isPublic: {
                    type: "boolean",
                    required: false,
                    default: false,
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCode.editProjectCode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取代码列表
        @author        shuxiaokai
        @create       2019-11-01 10:40"
        @param {String}      projectId 项目id
        @param {Number?}     pageNum 当前页码
        @param {Number?}     pageSize 每页大小   
        @param {number?}     startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}     endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
    async getProjectCodeList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                pageNum: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                pageSize: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                startTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                endTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCode.getProjectCodeList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  获取代码枚举信息
        @author        shuxiaokai
        @create       2019-11-01 10:40"
        @param {String}      projectId 项目id
        @return       null
    */
    async getProjectCodeEnum() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectCode.getProjectCodeEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = ProjectCodeController;
