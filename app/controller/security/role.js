

/**
    @description  角色控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class roleController extends Controller {
    /**
        @description  新增角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String} roleName     - 角色名称
        @param {String} clientRoutes - 前端路由
        @param {String} clientBanner - 前端banner(菜单)
        @param {String} serverRoutes - 服务端路由
        @param {String} remark - 备注
        @return       null
    */

    async addRole() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                roleName: {
                    type: "string"
                },
                clientRoutes: {
                    type: "array"
                },
                clientBanner: {
                    type: "array"
                },
                serverRoutes: {
                    type: "array"
                },
                remark: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.role.addRole(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */

    async deleteRole() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.role.deleteRole(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      roleName 角色名称
        @params {String}      clientRoutes 前端路由
        @params {String}      clientBanner 前端banner(菜单)
        @params {String}      serverRoutes 服务端路由
        @params {String}      remark 备注
        @return       null
    */

    async editRole() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                roleName: {
                    type: "string"
                },
                clientRoutes: {
                    type: "array"
                },
                clientBanner: {
                    type: "array"
                },
                serverRoutes: {
                    type: "array"
                },
                remark: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.role.editRole(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getRoleList() { 
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
            const result = await this.ctx.service.security.role.getRoleList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取角色枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
    */

    async getRoleEnum() { 
        try {
            const result = await this.ctx.service.security.role.getRoleEnum();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }




    /** 
     * @description        获取角色信息
     * @author              shuxiaokai
     * @create             2020-05-31 21:25
     * @param {String}     _id - 角色id       
     */
   
    async getRoleInfo() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.role.getRoleInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = roleController;
