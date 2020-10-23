/**
    @description  可视化linux控制面板控制器
    @author        shuxiaokai
    @create       2020-10-22 19:04"
*/

const Controller = require("egg").Controller;
const shell = require("shelljs");

class LinuxController extends Controller {
    /**
        @description  获取当前目录
        @author        shuxiaokai
        @create       2020-10-22 19:05"
        @return       null
    */
    async pwd() {
        try {
            shell.cd("C:/Users/dell/Desktop/webs/beilun");
            if (shell.exec('npm run build').code === 0) {
                const result = {
                    pwd: shell.pwd(),
                    dir: shell.ls("-l")
                };
                this.ctx.helper.successResponseData(result);
            } else {
                const result = {
                    msg: "错误"
                };
                this.ctx.helper.successResponseData(result);
                shell.exit(1);
            }
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = LinuxController;
