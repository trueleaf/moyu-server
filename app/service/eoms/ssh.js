/**
    @description  sshservice
    @author        shuxiaokai
    @create       2020-12-09 10:20"
*/

const Service = require("egg").Service;
const Client = require("../../vendor/ssh2");


class sshService extends Service {
    constructor(ctx) {
        super(ctx);
        this.client = new Client();
    }
    /**
        @description   通过ssh连接远端服务器
        @author        shuxiaokai
        @create        2020-12-09 10:20"
        @param {String}           username 用户名称
        @param {String}           password 密码
        @param {String}           host host名称
        @param {String}           port 端口号
        @return       null
    */
    async connect(params) {
        const { username, password, host, port } = params;
        console.time(1)
        await this.client.connect({
            username,
            password,
            host,
            port
        });
        const result = await this.client.exec("pwd");
        console.timeEnd(1)
        return result;
    }
    /**
        @description   执行命令
        @author        shuxiaokai
        @create        2020-12-09 10:20"
        @param {String}           command 命令
        @return       null
    */
    async exec(params) {
        const { command } = params;
        const result = await this.client.exec(command);
        return result;
    }
}

module.exports = sshService;
