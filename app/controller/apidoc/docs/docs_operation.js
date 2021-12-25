/**
    @description  文档相关操作控制器
    @author        shuxiaokai
    @create       2021-03-01 13:54"
*/

const Controller = require("egg").Controller;

class docsOperationController extends Controller {
    /** 
     * @description        导出为html
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsHTML() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                selectedNodes: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.exportAsHTML(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        导出为pdf
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
     async exportAsPdf() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                selectedNodes: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.exportAsPdf(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        导出为word
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
     async exportAsWord() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                selectedNodes: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.exportAsWord(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        导出为摸鱼文档
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsMoyuDoc() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                selectedNodes: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.exportAsMoyuDoc(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * @description        导入文档
     * @author             shuxiaokai
     * @create             2021-03-01 14:04
     * @param {any}        projectId - 项目id
     * @param {boolean}    cover - 是否覆盖原有数据
     * @param {moyu}       moyuData - 摸鱼接口文档类型数据
     * @return {String}    返回字符串
     */
    async importAsMoyuDoc() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                cover: {
                    type: "boolean",
                },
                moyuData: {
                    type: "object"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.importAsMoyuDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        生成在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    shareName 分享标题
     * @param  {String}    projectId 项目id
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @param  {Array}     selectedDocs 被选择的需要导出的节点
     * @return {String}    返回在线链接
     */
    async generateOnlineLink() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                shareName: {
                    type: "string"
                },
                projectId: {
                    type: "string"
                },
                password: {
                    type: "string",
                    required: false,
                },
                maxAge: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                selectedDocs: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.generateOnlineLink(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        修改在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String}    _id 在线链接id
     * @param  {String}    shareName 分享标题
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @param  {Array}     selectedDocs 被选择的需要导出的节点
     * @return {String}    返回在线链接
     */
     async editOnlineLink() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                shareName: {
                    type: "string"
                },
                projectId: {
                    type: "string"
                },
                _id: {
                    type: "string"
                },
                password: {
                    type: "string",
                    required: false,
                },
                maxAge: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                selectedDocs: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.editOnlineLink(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    
    /** 
     * @description        删除在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String?}   _id 项目id
     */
     async deleteOnlineLink() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.deleteOnlineLink(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    

    /** 
     * @description        获取在线链接列表
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {number}    pageNum 页码
     * @param  {number}    pageSize 每页数量
     * @param  {string}    projectId 项目id
     * @param  {boolean}   isAll 是否展示全部项目
     * @return {Array}    
     */
    async getOnlineLinkList() {
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
                projectId: {
                    type: "string",
                    required: false
                },
                isAll: {
                    type: "boolean",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.getOnlineLinkList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }


    /** 
     * @description        fork项目中部分文档
     * @author             shuxiaokai
     * @create             2020-11-13 21:24
     * @param  {String}    sourceProjectId 源项目id
     * @param  {String}    targetProjectId 目标项目id
     * @param  {String}    targetMountedId 挂载点文档id
     * @param  {Number}    targetNodeSort 目标节点排序
     * @param  {Array}     selectedDocIds 被选择的需要导出的节点
     * @param  {String}    sourceRootId 源节点根元素id
     * @return {String}    返回字符串
     */
    async forkDocs() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                sourceProjectId: {
                    type: "string"
                },
                targetProjectId: {
                    type: "string",
                },
                targetMountedId: {
                    type: "string",
                    required: false
                },
                selectedDocIds: {
                    type: "array",
                },
                sourceRootId: {
                    type: "string"
                },
                targetNodeSort: {
                    type: "number"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docsOperation.forkDocs(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = docsOperationController;
