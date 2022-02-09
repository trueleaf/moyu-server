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
     * @param {String}     projectId - 项目id       
     */

    async copyDoc() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                projectId: {
                    type: "string"
                }
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
        @description  粘贴挂载文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}        projectId 项目id
        @param {String?}       mountedId 挂载id
        @param {Array<Doc>}    docs 文档 
    */
    async pasteDocs() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string"
                },
                mountedId: {
                    type: "string",
                    required: false,
                },
                docs: {
                    type: "array"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.pasteDocs(params);
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
        @param {String}      projectId 项目id
        @param {Object}      dropInfo 项目id
                            -nodeName 
                            -nodeId 
                            -dropNodeName
                            -dropNodeId
                            -type,
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
                },
                projectId: { //项目id
                    type: "string"
                },
                dropInfo: { //拖拽信息
                    type: "object",
                },
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
        @param {String}    _id 当前文档id      
        @param {String}    projectId 项目id      
        @param {String}    name 当前文档名称      
        @return       null
    */
    async changeDocName() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                projectId: {
                    type: "string"
                },
                name: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.changeDocName(params);
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
        @param {pbjectID}         _id 文档id
        @param {object}           info 接口基本信息 
        @param {object}           item 录入参数 
        @param {number}           spendTime 录入时长
        @param {string}           projectId 项目id
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
                info: {
                    type: "object",
                },
                item: {
                    type: "object",
                },
                preRequest: {
                    type: "object",
                    required: false,
                },
                afterRequest: {
                    type: "object",
                    required: false,
                },
                spendTime: {
                    type: "number",
                    required: false
                },
                projectId: {
                    type: "string"
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
        @param {string}           projectId 项目id
        @return       null
    */

    async getDocTreeNode() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
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
        @description  获取文档导航(仅获取文件夹信息，用于一个项目向另一个项目导入)
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @return       null
    */
    async getDocTreeFolderNode() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                projectId: {
                    type: "string",
                    required: true
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getDocTreeFolderNode(params);
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
    * @description        获取文档详细信息
    * @author             shuxiaokai
    * @create             2021-01-13 17:27
    * @param {string}     _id 文档id
    * @param {string}     projectId - 项目id       
    * @return             null     
    */
    async getDocDetail() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string",
                },
                projectId: {
                    type: "string",
                }
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
        @description   获取文档回收站记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {string?}           url 请求url
        @param {string?}           docName 文档名称
        @param {array?}            operators 操作者
        @param {string}            projectId 项目id
        @return       null
    */
    async getDocDeletedList() { 
        try {
            const params = this.ctx.request.body;
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
                url: {
                    type: "string",
                    required: false
                },
                docName: {
                    type: "string",
                    required: false,
                },
                operators: {
                    type: "array",
                    required: false
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.getDocDeletedList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
     * @description        恢复接口或文件夹
     * @author             shuxiaokai
     * @create             2021-05-24 14:27
     * @param {string}     _id 节点id
     * @param {string}     projectId 项目id
     * @param {Boolean}    restoreChildren 是否恢复子节点
     * @return {String}    返回字符串
     */
     async restroeNode() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                projectId: {
                    type: "string",
                },
                restoreChildren: {
                    type: "boolean",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.docs.docs.restroeNode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = DocsController;
