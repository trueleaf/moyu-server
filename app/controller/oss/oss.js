/**
    @description  文件上传控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const Controller = require("egg").Controller;
const OSS = require("ali-oss");
const STS = OSS.STS;

class ossController extends Controller {
    /**
        @description  获取oss临时凭证
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 文档名称
        @return       null
    */    

    async getSts() {
        try {
            const policy = this.app.config.ossConfig.policy; //授权策略，eg: 可读可写
            const userName = "shu";
            policy.Statement[0].Resource = [`acs:oss:*:*:happymoyu/${userName}/*`]; //用户名称当作一个文件夹
            //获取sts
            const ossBaseConf = this.app.config.ossConfig.base;
            const sts = new STS({
                accessKeyId: ossBaseConf.accessKeyId,
                accessKeySecret: ossBaseConf.accessKeySecret
            });
            const token = await sts.assumeRole(ossBaseConf.arn, policy, 60 * 60);
            const client = new OSS({
                accessKeyId: token.credentials.AccessKeyId,
                accessKeySecret: token.credentials.AccessKeySecret,
                stsToken: token.SecurityToken,
                bucket: ossBaseConf.bucket,
            });

            const policy2 = {
                expiration: token.credentials.Expiration, // 请求有效期
                conditions: [
                    ["content-length-range", 0, 1024 * 1024 * 1024 * 100], // 设置上传文件的大小限制
                    { bucket: ossBaseConf.bucket } // 限制可上传的bucket
                ]
            };
            const signatureFormData = await client.calculatePostSignature(policy2);
            const result = {
                accessKeyId: token.credentials.AccessKeyId,
                accessKeySecret: token.credentials.AccessKeySecret,
                stsToken: token.credentials.SecurityToken,
                expire: token.credentials.Expiration,
                signature: signatureFormData.Signature,
                policy: signatureFormData.policy,
                bucket: ossBaseConf.bucket,
                region: ossBaseConf.region,
                folder: userName
            };
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        下载文件
     * @author              shuxiaokai
     * @create             2020-04-14 19:14
     * @params {String}    fileUrl 文件地址
     */
    
    async generateFileUrl() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                fileUrl: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.oss.oss.generateFileUrl(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }


    /**
        @description  获取文件列表展示
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}          folder 制定目录
        @return       null
    */

    async getFileList(query) { 
        try {
            const params = Object.assign(this.ctx.request.query, query);
            const reqRule = {
                folder: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.oss.oss.getFileList(params);
            this.ctx.helper.successResponseData(result);
            return result;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  新建文件夹
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            pFolder 父文件夹名称
        @params {String}            name 文件夹名称
        @return       null
    */

    async addFolder() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                pFolder: {
                    type: "string",
                    required: false
                },
                name: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            await this.ctx.service.oss.oss.addFolder(params);    
            this.ctx.helper.successResponseData();
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  新建文件
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            name 文件名称
        @return       null
    */

    async addFile() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                name: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.oss.oss.addFile(params);    
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }



    /**
        @description  删除文件或者文件夹
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {string}            path 文件路径(不包含根路径)， test/foo/aaa.jpg
        @return       null
    */

    async deleteFile() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                path: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.oss.oss.deleteFile(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

}

module.exports = ossController;
