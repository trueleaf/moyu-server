

/**
    @description  前端菜单控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class clientMenuController extends Controller {
    /**
        @description  新增前端菜单
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 菜单名称
        @params {String}            path 前端跳转路径
        @params {String}            type 路由类型( inline前端自己路由  link外部链接 )
        @params {String}            pid 父级菜单id
        @return       null
    */

    async addClientMenu() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: {
                    type: "string"
                },
                path: {
                    type: "string"
                },
                type: {
                    type: "enum",
                    values: ["inline", "link"],
                    required: false
                },
                pid: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientMenu.addClientMenu(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除前端菜单
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */

    async deleteClientMenu() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientMenu.deleteClientMenu(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改前端菜单
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      name 菜单名称
        @params {String}      path 前端跳转路径
        @params {String}      type 路由类型( inline前端自己路由  link外部链接 )
        @return       null
    */

    async editClientMenu() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                name: {
                    type: "string"
                },
                path: {
                    type: "string"
                },
                type: {
                    type: "enum",
                    values: ["inline", "link"],
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientMenu.editClientMenu(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  以树形结构获取前端菜单
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */
   
    async getTreeClientMenu() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientMenu.getTreeClientMenu(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改菜单在菜单树中的位置
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 当前菜单id
        @param {String?}     pid 父菜单id,当将菜单拖入到
        @param {Number}     sort 排序
        @return       null
    */

    async changeClientMenuPosition() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                pid: {
                    type: "string",
                    widelyUndefined: false,
                    empty: true
                },
                sort: {
                    type: "number"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.clientMenu.changeClientMenuPosition(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

}

module.exports = clientMenuController;
