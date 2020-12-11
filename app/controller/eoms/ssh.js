/**
    @description  ssh控制器
    @author        shuxiaokai
    @create       2020-12-09 10:15"
*/

const Controller = require("egg").Controller;

class sshController extends Controller {
    /**
        @description  ssh链接
        @author        shuxiaokai
        @create       2020-12-09 10:15"
        @param {String}           username 用户名称
        @param {String}           password 密码
        @param {String}           host host名称
        @param {String}           port 端口号
        @return       null
    */
    async connect() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                username: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                host: {
                    type: "string"
                },
                port: {
                    type: "string",
                    default: "22",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.eoms.ssh.connect(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  执行shell命令
        @author        shuxiaokai
        @create       2020-12-09 10:15"
        @param {string}     command 用户名称
        @return {string}
    */
   async exec() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                command: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.eoms.ssh.exec(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = sshController;
