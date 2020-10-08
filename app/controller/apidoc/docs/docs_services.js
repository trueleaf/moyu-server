/** 
    @description  文档服务器控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Controller = require("egg").Controller;

class ServicesController extends Controller {
    /** 
        @description  新增空白文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            name 文档名称
        @param {String}            url 文档url
        @param {String}            remark 文档备注
        @param {String}            projectId 项目id
        @return       null
    */

    async addService() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: {
                    type: "string"
                },
                url: {
                    type: "string"
                },
                remark: {
                    type: "string",
                    required: false
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsServices.addService(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  删除服务器
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}            ids 服务器id
        @return       null
    */

    async deleteService() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsServices.deleteService(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取服务器列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String}            projectId 项目id
        @return       null
    */

    async getServiceList() { 
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
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取服务器信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            projectId 项目id
        @param {String}            id 服务器id
        @return       null
    */

    async getServiceInfo() {
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                id: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsServices.getServiceInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改服务器信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 服务器id
        @param {String}      name 服务器名称
        @param {String}      url 服务器url
        @param {String}      remark 服务器备注
        @return       null
    */

    async editService() { 
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
                url: {
                    type: "string",
                    required: false
                },
                remark: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsServices.editService(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = ServicesController;
