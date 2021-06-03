/**
    @description  文档标签控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class DocsTagController extends Controller {
    /**
        @description  新增文档标签
        @author        shuxiaokai
        @create       2021-05-07 21:18"
        @param {String}            projectId 项目id
        @param {String}            name 名称
        @param {String}            color 颜色
        @return       null
    */
    async addDocsTag() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                color: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsTag.addDocsTag(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除文档标签
        @author        shuxiaokai
        @create       2019-11-01 20:39"
        @param {String}         projectId 项目id
        @param {Array<String>}  ids 
        @return       null
    */
    async deleteDocsTag() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsTag.deleteDocsTag(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改文档标签
        @author        shuxiaokai
        @create       2019-10-06 22:44"
        @param {String}      _id 标签id
        @param {String}      name 名称
        @param {String}      color 颜色
        @param {String}      projectId 项目id
        @return       null
    */
    async editDocsTag() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                    required: false,
                },
                _id: {
                    type: "string",
                },
                name: {
                    type: "string",
                    required: false,
                },
                color: {
                    type: "string",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsTag.editDocsTag(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取文档标签
        @author        shuxiaokai
        @create       2019-11-01 20:40"
        @param {String}      projectId 项目id
        @return       null
    */
    async getDocsTagEnum() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsTag.getDocsTagEnum(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = DocsTagController;
