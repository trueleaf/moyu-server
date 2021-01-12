/** 
    @description  文档相关控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Controller = require("egg").Controller;

class DocsController extends Controller {
    /** 
        @description  新增空白文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}            name 文档名称
        @param {string}            type 文档类型 
        @param {string}            pid 父元素id
        @param {string}            projectId 项目id
        @return       null
    */
    async addEmptyDoc() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: {
                    type: "string",
                },
                type: {
                    type: "string",
                    enum: ["folder", "api", "markdown"],
                },
                pid: {
                    type: "string",
                    required: false
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.addEmptyDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        拷贝一个节点
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-02-15 22:29
     * @update             2020-02-15 22:29
     * @param {String}     _id - 节点id       
     */

    async copyDoc(params) {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.copyDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  新增多个空白文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}        projectId 项目id
        @param {String}        pid 文档父元素
        @param {String}        name 接口名称
        @param {String}        host 接口host
        @param {String}        url 接口url
        @param {String}        templateId 模板id 
    */

    async newMultiDoc() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                pid: {
                    type: "string",
                },
                name: {
                    type: "string"
                },
                host: {
                    type: "string"
                },
                url: {
                    type: "string"
                },
                templateId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.newMultiDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        新增多个文档
     * @author              shuxiaokai
     * @create             2020-07-20 15:36
     * @param {array}      docs - 文档数组       
     * @param {array}      projectId - 项目id       
     * @return {String}    返回字符串
     */

    async addMultiDocs() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: { //项目id
                    type: "string"
                },
                docs: {
                    type: "array"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.addMultiDocs(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改文档在文档树中的位置
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 当前文档id
        @param {String?}     pid 父文档id,当将文档拖入到
        @param {Number}      sort 文档排序
        @return       null
    */

    async changeDocPosition() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                pid: {
                    type: "string",
                    required: false,
                    empty: true
                },
                sort: {
                    type: "number"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.changeDocPosition(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  修改文档名称
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}    _id当前文档id      
        @param {String}    projectId 当前文档所属项目id      
        @param {String}    docName 当前文档名称      
        @return       null
    */

    async editDocInfo() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                docName: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.editDocInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  新增文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @param {Object}           item 文档数据 
        @return       null
    */

    async fillDoc() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                    required: true
                },
                item: {
                    type: "requestRule",
                    required: true
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.fillDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  获取文档结构树
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @param {Object}           item 文档数据 
        @return       null
    */

    async getDocTreeNode() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string",
                    required: true
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getDocTreeNode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  根据url过滤文档信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}         projectId 项目id
        @param {string?}         url 文档url
        @return       null
    */

    async filterDoc() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
                    type: "string",
                },
                url: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.filterDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  获取文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @return       null
    */

    async getDocDetail() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string",
                    required: true
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getDocDetail(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  删除文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @return       null
    */

    async deleteDoc() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                    default: true,
                },
                ids: {
                    type: "array",
                    required: true
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.deleteDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  发布文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @return       null
    */

    async publishDoc() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                    default: true,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.publishDoc(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  生成文件word
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            projectId 项目id
        @return       null
    */
   
    async convertDocToWord() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            await this.ctx.service.apidoc.docs.docs.convertDocToWord(params);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取mock文档数据
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}   _id 文档id
        @return       null
    */
   
    async getMockData() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getMockData(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        获取所有接口离线数据
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @return {String}    返回字符串
     */
    async getDocOfflineData() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getDocOfflineData(params);
            this.ctx.body = result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = DocsController;
