

/**
    @description  字典(词典)控制器
    @author        shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;

class dictionaryController extends Controller {
    /**
        @description  新增字典(词典)
        @author        shuxiaokai
        @create       2021-03-26 11:03"
        @param {String}            cnName 中文名称
        @param {String}            enName 英文名称
        @param {String}            example 例子
        @param {String}            refer 参考链接
        @param {String}            remark 备注
        @param {String}            tags 标签信息
        @return       null
    */
    async addDictionary() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                cnName: {
                    type: "string"
                },
                enName: {
                    type: "string",
                    required: false,
                },
                example: {
                    type: "string",
                    required: false,
                },
                refer: {
                    type: "string",
                    required: false,
                },
                remark: {
                    type: "string",
                    required: false,
                },
                tags: {
                    type: "string",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.dictionary.dictionary.addDictionary(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  删除字典(词典)
        @author        shuxiaokai
        @create       2019-11-01 10:39"
        @param {Array<String>}            ids 
        @return       null
    */
    async deleteDictionary() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.dictionary.dictionary.deleteDictionary(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  修改字典(词典)
        @author        shuxiaokai
        @create       2019-10-06 12:44"
        @param {String}      _id 
        @return       null
    */
    async editDictionary() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.dictionary.dictionary.editDictionary(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取字典(词典)列表
        @author        shuxiaokai
        @create       2019-11-01 10:40"
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {String?}           cnName 中文名称   
        @param {String?}           enName 英文名称   
        @param {Array<String>?}    creators 创建者   
        @param {Array<String>?}    maintainers 维护者信息   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
    async getDictionaryList() { 
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
                cnName: {
                    type: "string",
                    required: false,
                },
                enName: {
                    type: "string",
                    required: false,
                },
                maintainers: {
                    type: "array",
                    required: false,
                },
                creators: {
                    type: "array",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.dictionary.dictionary.getDictionaryList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = dictionaryController;
