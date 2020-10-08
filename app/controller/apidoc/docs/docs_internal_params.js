/** 
    @description  内置请求返回参数控制器
    @author       shuxiaokai
    @create       2020/9/17 下午5:04:46
*/
const Controller = require("egg").Controller;
class DocsInternalParamsController extends Controller {
    /**
        @description    新增内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @param {string}        key 参数名称
        @param {string}        value 参数值
        @param {string}        description 参数描述
        @param {string}        type 参数类型
        @param {boolean}        required 是否必填
        @return    null
    */
    async createDocsInternalParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                key: {
                    type: "string"
                },
                value: {
                    type: "string"
                },
                description: {
                    type: "string"
                },
                type: {
                    type: "string"
                },
                required: {
                    type: "boolean"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.createDocsInternalParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description    以列表形式获取内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @param {string?}        pageSize 每页数据大小
        @param {string?}        pageNum 当前页码
        @param {string?}        startTime 起始日期
        @param {string?}        endTime 结束日期
        @return    null
    */
    async readDocsInternalParamsList() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                pageSize: {
                    type: "string",
                    required: false,
                    default: "10"
                },
                pageNum: {
                    type: "string",
                    required: false,
                    default: "1"
                },
                startTime: {
                    type: "string",
                    required: false,
                    default: "1"
                },
                endTime: {
                    type: "string",
                    required: false,
                    default: "1"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.readDocsInternalParamsList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description    以枚举形式获取内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @return    null
    */
    async readDocsInternalParamsEnum() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {};
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.readDocsInternalParamsEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description    根据id查询内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @param {string}        _id 详情数据id
        @return    null
    */
    async readDocsInternalParamsById() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.readDocsInternalParamsById(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description    修改内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @param {String}         _id 数据id
        @param {string?}        key 参数名称
        @param {string?}        value 参数值
        @param {string?}        description 参数描述
        @param {string?}        type 参数类型
        @param {boolean?}        required 是否必填
        @param {boolean?}        enabled 是否有效
        @return    null
    */
    async updateDocsInternalParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string"
                },
                key: {
                    type: "string",
                    required: false
                },
                value: {
                    type: "string",
                    required: false
                },
                description: {
                    type: "string",
                    required: false
                },
                type: {
                    type: "string",
                    required: false
                },
                required: {
                    type: "boolean",
                    required: false
                },
                enabled: {
                    type: "boolean",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.updateDocsInternalParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description    根据id删除内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午5:04:46
        @param {array}        ids 需要删除数据id数组
        @return    null
    */
    async deleteDocsInternalParams() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs_internal_params.deleteDocsInternalParams(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}
module.exports = DocsInternalParamsController;