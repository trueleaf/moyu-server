

/**
    @description  项目全局变量控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class ProjectVariableController extends Controller {
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
   
    async addProjectVariable() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: {
                    type: "string"
                },
                type: {
                    type: "string",
                    values: ["string", "number", "boolean"]
                },
                value: {
                    type: "string"
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectVariable.addProjectVariable(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}            ids 
        @return       null
    */

    async deleteProjectVariable() {
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
            const result = await this.ctx.service.apidoc.project.projectVariable.deleteProjectVariable(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改项目全局变量
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 
        @param {String}      name 变量名称
        @param {String}      type 变量类型
        @param {String}      value 变量值
        @return       null
    */

    async editProjectVariable() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                name: {
                    type: "string",
                    required: false
                },
                type: {
                    type: "string",
                    values: ["string", "number", "boolean"],
                    required: false
                },
                value: {
                    type: "string",
                    required: false
                },
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectVariable.editProjectVariable(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
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

    async getProjectVariableList() { 
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
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectVariable.getProjectVariableList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取项目全局变量枚举值
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}        projectId 项目id
        @return       null
    */

    async getProjectVariableEnum() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.projectVariable.getProjectVariableEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }


}

module.exports = ProjectVariableController;
