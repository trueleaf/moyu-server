/** 
 * @description        promise版本ssh2
 * @author             shuxiaokai
 * @create             2020-12-09 11:23
 */

const Client = require("ssh2").Client;
class Ssh2 {
    constructor() {
        this.client = null;
    }
    /** 
     * @description        连接数据库
     * @author              shuxiaokai
     * @create             2020-12-09 11:26
     * @param {String}     username 用户名称
     * @param {String}     password 密码
     * @param {String}     host host名称
     * @param {String}     port 端口号
     * @return {Promise}   
     */
    connect(config) {
        const { username, password, host, port } = config;
        return new Promise((resolve, reject) => {
            this.client = new Client();
            this.client.connect({
                host,
                port: parseInt(port),
                username,
                password,
            });
            this.client.on("ready", () => {
                console.log("连接成功");
                resolve({x: 1})
            })
            this.client.on("error", (err) => {
                reject(err);
                console.error(err);
            })
            this.client.on("end", () => {
                reject(err);
                console.log("end");
            })
            this.client.on("close", () => {
                reject(err);
                console.log("close");
            })            
        })
    }
    /** 
     * @description        执行shell命令
     * @author             shuxiaokai
     * @create             2020-12-09 13:11
     * @param {string}     command - 命令       
     * @param {object}     options - 配置参数       
     * @return {promise}   
     */
    exec(command, options) {
        return new Promise((resolve, reject) => {
            this.client.exec(command, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }
                stream.on("close", (code, signal) => {
                    console.log("Stream :: close :: code: " + code + ", signal: " + signal);
                }).on("data", (data) => {
                    resolve(data.toString())
                }).stderr.on("data", (data) => {
                    resolve(data.toString())
                });
            });
        })
    }
}

module.exports = Ssh2;