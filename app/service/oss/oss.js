/**
    @description  oss相关service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;
const OSS = require("ali-oss");
class ossService extends Service {
    /** 
     * @description        下载文件
     * @author              shuxiaokai
     * @create             2020-04-14 19:14
     * @params {String}    fileUrl 文件地址
     */

    async generateFileUrl(params) {
        const { fileUrl } = params;
        const ossBaseConf = this.app.config.ossConfig.base;
        const client = new OSS({
            accessKeyId: ossBaseConf.accessKeyId,
            accessKeySecret: ossBaseConf.accessKeySecret,
            region: ossBaseConf.region,
            bucket: ossBaseConf.bucket,
        });
        const url = client.signatureUrl(fileUrl, {
            expires: 60 * 60, //单位s
        });
        return { url };
    }

    /**
        @description  获取文件列表展示
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}          folder 制定目录
        @return       null
    */

    async getFileList(params) {
        const { folder } = params;
        const ossBaseConf = this.app.config.ossConfig.base;
        const client = new OSS({
            accessKeyId: ossBaseConf.accessKeyId,
            accessKeySecret: ossBaseConf.accessKeySecret,
            region: ossBaseConf.region,
            bucket: ossBaseConf.bucket,
        });
        const rootDir = "shu/";
        let childDir = folder || "";
        if (childDir && !childDir.endsWith("/")) {
            childDir += "/";
        }
        const response = await client.list({
            prefix: `${rootDir}${childDir}`,
            delimiter: "/", //一个Bucket中存在三个Object : fun/test.jpg， fun/movie/001.avi，fun/movie/007.avi。若设定Prefix为 fun/，则返回三个Object；如果增加设定Delimiter为 /，则返回fun/test.jpg和fun/movie/ 
        });
        let files = response.objects || []; //文件列表
        let dirs = response.prefixes || []; //目录列表
        //=====================================组装数据====================================//
        files = files.filter(val => val.size !== 0).map(val => {
            return {
                name: val.name.replace(/.*\/\d*_*/, ""),
                fullname: val.name.replace(/.*\//, ""),
                path: val.name.replace(/^[^\/]+\//, ""),
                size: val.size,
                type: "file",
            };
        });
        dirs = dirs.map(val => {
            return {
                name: val.replace(/[^\/]*\//, "").replace("/", ""),
                path: val.replace(/^.+\//, ""),
                type: "folder"
            };
        });
        return files.concat(dirs);
    }
    /**
        @description  新建文件夹
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            pFolder 父文件夹名称
        @params {String}            name 文件夹名称
        @return       null
    */
 
    async addFolder(params) {
        const { pFolder, name } = params;
        const ossBaseConf = this.app.config.ossConfig.base;
        const client = new OSS({
            accessKeyId: ossBaseConf.accessKeyId,
            accessKeySecret: ossBaseConf.accessKeySecret,
            region: ossBaseConf.region,
            bucket: ossBaseConf.bucket,
        });
        const rootDir = "shu/";
        let parentFolder = pFolder || "";
        let folderName = name || "";
        if (parentFolder && !parentFolder.endsWith("/")) { 
            parentFolder += "/";
        }
        if (folderName && !folderName.endsWith("/")) { 
            folderName += "/";
        }
        const fullPath = `${rootDir}${parentFolder}${folderName}`;
        const currentList = await this.getFileList({ folder: parentFolder });
        if (currentList.find(val => val.name === name && val.type === "folder")) {
            this.ctx.helper.throwCustomError("当前文件夹已经存在", 1003);
        }
        await client.put(fullPath, new Buffer(""));
        return;
    }

    /**
        @description  新建文件
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 文件名称
        @return       null
    */
  
    async addFile(params) {
        const { name, buffer } = params;
        const ossBaseConf = this.app.config.ossConfig2.base;
        const client = new OSS({
            accessKeyId: ossBaseConf.accessKeyId,
            accessKeySecret: ossBaseConf.accessKeySecret,
            region: ossBaseConf.region,
            bucket: ossBaseConf.bucket,
        });

        const rootDir = "/test/";
        const folderName = name || String(Math.random());
        
        const fullPath = `${rootDir}${folderName}.png`;
        const result = await client.put(fullPath, new Buffer(buffer));
        return result.url;
    }

    /**
        @description  删除文件或者文件夹
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {string}            path 文件路径(不包含根路径)， test/foo/aaa.jpg
        @return       null
    */

    async deleteFile(params) {
        const { path } = params;
        const ossBaseConf = this.app.config.ossConfig.base;
        const client = new OSS({
            accessKeyId: ossBaseConf.accessKeyId,
            accessKeySecret: ossBaseConf.accessKeySecret,
            region: ossBaseConf.region,
            bucket: ossBaseConf.bucket,
        });
        const rootDir = "shu/";
        const fullPath = `${rootDir}${path}`;
        const result = await client.head(fullPath);

        return result;
    }

}

module.exports = ossService;