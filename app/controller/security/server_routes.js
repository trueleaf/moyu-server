

/**
    @description  后端路由控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;
const fs = require("fs-extra");
const path = require("path");

class serverRoutesController extends Controller {
    /** 
     * @description        自动获取服务器信息
     * @author              shuxiaokai
     * @create             2020-05-21 14:55
     */

    async autoAddServerRoutes() {
        try {
            const filePath = path.join(__dirname, "../../", "router.js");
            let routesText = await fs.readFile(filePath);
            routesText = routesText.toString();
            const apiReg = /router\..+[^(router\.)\r]/g; //匹配一条路由
            const methodReg = /(?<=router\.)[^\(]+/g; //匹配请求方法
            const pathReg = /(?<=")([^"]+)(?=",)/g; //匹配请求路径
            const nameReg = /(?<=\)[^\/]*\/\/\s*)[^\s=]+/g; //匹配请求url
            
            const apiArr = routesText.match(apiReg);
            const result = [];
            apiArr.forEach(api => {
                const ret = {
                    path: api.match(pathReg)[0],
                    name: api.match(nameReg)[0],
                    method: api.match(methodReg)[0],
                };
                result.push(ret);
            });
            for (let i = 0; i < result.length; i++) {
                const doc = {
                    name: result[i].name,
                    path: result[i].path,
                    method: result[i].method,
                    enabled: true
                };
                await this.ctx.model.Security.ServerRoutes.updateOne({ path: result[i].path, method: result[i].method }, doc, { upsert: true });
            }
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }


    /**
        @description  新增后端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 后端路由
        @params {String}            path 后端路由地址
        @params {String}            method 请求方法
        @params {String}            groupName 分组名称
        @remark                     请求方法和请求地址唯一确定一个请求
        @return       null
    */

    async addServerRoutes() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                path: {
                    type: "string"
                },
                name: {
                    type: "string",
                },
                method: {
                    type: "string"
                },
                groupName: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.serverRoutes.addServerRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除后端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */

    async deleteServerRoutes() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.serverRoutes.deleteServerRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改后端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      name 路由名称 
        @params {String}      path 路由地址
        @params {String}      method 请求方法
        @params {String}      groupName 分组名称
        @return       null
    */

    async editServerRoutes() { 
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
                method: {
                    type: "string",
                    required: false
                },
                groupName: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.serverRoutes.editServerRoutes(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  批量后端路由分类
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      ids 路由id组
        @params {String}      groupName 分组名称
        @return       null
    */

    async editMultiServerRoutesType() { 
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
            const result = await this.ctx.service.security.serverRoutes.editMultiServerRoutesType(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }


    /**
        @description  获取后端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getServerRoutesList() { 
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
            const result = await this.ctx.service.security.serverRoutes.getServerRoutesList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取后端路由(不分页)
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getServerRoutes() { 
        try {
            const result = await this.ctx.service.security.serverRoutes.getServerRoutes();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = serverRoutesController;
