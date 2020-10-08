

/**
    @description  前端路由控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class clientRoutesController extends Controller {
    /**
        @description  新增前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 前端路由
        @params {String}            path 前端路由地址
        @params {String}            groupName 分组名称
        @return       null
    */

    async addClientRoutes() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                path: {
                    type: "string"
                },
                name: {
                    type: "string",
                },
                groupName: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.addClientRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  批量新增前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            routes 路由列表
        @return       null
    */

    async addMultiClientRoutes() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                routes: {
                    type: "array"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.addMultiClientRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */

    async deleteClientRoutes() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.deleteClientRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      name 路由名称 
        @params {String}      path 路由地址
        @params {String}      groupName 分组名称
        @return       null
    */

    async editClientRoutes() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                path: {
                    type: "string",
                    required: false
                },
                name: {
                    type: "string",
                    required: false
                },
                groupName: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.editClientRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  批量前端路由分类
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      ids 路由id组
        @params {String}      groupName 分组名称
        @return       null
    */

    async editMultiClientRoutesType() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                },
                groupName: {
                    type: "string",
                    required: false,
                    default: ""
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.editMultiClientRoutesType(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getClientRoutesList() { 
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
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientRoutes.getClientRoutesList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取前端路由(不分页)
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getClientRoutes() { 
        try {
            const result = await this.ctx.service.security.clientRoutes.getClientRoutes();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = clientRoutesController;
