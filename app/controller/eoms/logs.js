/**
    @description  日志管理控制器
    @author        shuxiaokai
    @create       2021-02-23 11:23"
*/

const Controller = require("egg").Controller;

class logsController extends Controller {
    /**
        @description  获取日志文件列表
        @author        shuxiaokai
        @create       2021-02-23 11:27"
        @return       null
    */
    async getLogsFileList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {};
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.eoms.logs.getLogsFileList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * @description        获取日志文件详情
     * @author             shuxiaokai
     * @create             2021-02-23 14:07
     * @param {string}     name - 文件名称
     * @param {string}     position - 起始位置
     * @param {string}     length - 读取长度
     * @return {String}    返回字符串
     */
    async getLogDetail() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                name: {
                    type: "string",
                },
                position: {
                    type: "string",
                    convertType: "number",
                    required: false,
                },
                length: {
                    type: "string",
                    convertType: "number",
                    required: false,
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.eoms.logs.getLogDetail(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = logsController;
