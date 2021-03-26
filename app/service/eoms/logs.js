/**
    @description  日志service
    @author        shuxiaokai
    @create       2021-02-23 21:24"
*/
const fs = require("fs-extra");
const shell = require("shelljs");
const path = require("path");
const Service = require("egg").Service;

class logsService extends Service {
    /**
        @description  获取日志文件列表
        @author        shuxiaokai
        @create       2021-02-23 21:28"
        @return       null
    */
    async getLogsFileList() {
        const info = this.ctx.app.logger;
        const logsPath = info.options.dir;
        const hasLogsFolder = fs.existsSync(logsPath);
        if (!hasLogsFolder) {
            this.ctx.helper.throwCustomError("目录不存在", 10001);
        }
        const fileList = await shell.ls("-l", logsPath);
        return fileList.map(fileInfo => {
            return {
                size: fileInfo.size,
                name: fileInfo.name,
                createdAt: fileInfo.ctime,
                updatedAt: fileInfo.mtime,
            };
        });
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
    async getLogDetail(params) {
        const { name, position = 0, length = 1024 } = params;
        const info = this.ctx.app.logger;
        const logsDirPath = info.options.dir;
        const fileName = path.resolve(logsDirPath, name);
        const hasFile = fs.existsSync(fileName);
        if (!hasFile) {
            this.ctx.helper.throwCustomError("文件不存在", 10002);
        }
        const fd = await fs.open(fileName, "r");
        const buffer = Buffer.alloc(length);
        await fs.read(fd, buffer, 0, length, position );
        await fs.close(fd);
        return buffer.toString();
    }
}

module.exports = logsService;