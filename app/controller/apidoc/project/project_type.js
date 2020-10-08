/** 
    @description  项目类型控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Controller = require("egg").Controller;

class ProjectTypeController extends Controller {
    /** 
        @description  获取项目类型枚举分页列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String?}           projectTypeName 项目类型名称 
        @return       null
    */

    async getProjectTypeEnumList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
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
                projectTypeName: {
                    type: "string",
                    convertType: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectType.getProjectTypeEnumList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  删除项目类型枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {array}      ids 项目类型id值 
        @return       null
    */

    async deleteProjectTypeEnum() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectType.deleteProjectTypeEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  修改项目类型枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}      ids 项目类型id值 
        @return       null
    */

    async editProjectTypeEnum() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string"
                },
                projectTypeName: {
                    type: "string",
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectType.editProjectTypeEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    


    /** 
        @description  获取项目类型枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getProjectTypeEnum() { 
        try {
            const result = await this.ctx.service.apidoc.project.projectType.getProjectTypeEnum();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  新增项目类型枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}        name 名称       
        @param {String}        remark 备注       
        @return       null
    */

    async addProjectTypeEnum() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectTypeName: {
                    type: "string"
                },
                remark: {
                    type: "string",
                    required: false,
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectType.addProjectTypeEnum(params);
            this.ctx.helper.successResponseData(result);
            return;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = ProjectTypeController;
