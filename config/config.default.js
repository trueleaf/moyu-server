/* eslint valid-jsdoc: "off" */

"use strict";
const path = require("path");
const os = require("os");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {});
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name;
    //=====================================中间件====================================//
    config.middleware = ["throttle", "permission", "mock"];
   
    const mock = {};
    const permission = {
        free: true, //默认情况取消权限校验，方便用户使用
        whiteList: [
            "/mock",
            "/test",
            "/ssh",
            "/api/security/register",
            "/api/project/share",
            "/api/security/client_routes_multi",
            "/api/security/login_password",
            "/api/security/login_phone",
            "/api/security/sms",
            "/api/security/login_guest",
            "/api/security/captcha",
            "/api/project/doc_mock",
            "/api/proxy/proxyWebApi",
            "/api/security/user_reset_password",
            "/api/project/share_info",
            "/api/project/share_check",
            "/api/project/export/share_banner",
            "/api/project/export/share_project_info",
            "/api/project/share_doc_detail",
        ],
    };
    const throttle = {};
    //=========================================================================//
    
    // 参数验证
    const validate = {
        widelyUndefined: true,
    };
    // 安全相关
    const security = {
        csrf: {
            enable: false, //线上开启csrf
            headerName: "x-csrf-token", // 携带在header中的csrf名称
        },
    }; 
    // 跨域相关
    const cors = {
        origin(app) {
            const origin = app.request.header.origin;
            return origin;
        },
        credentials: true,
        allowMethods: "GET,PUT,POST,DELETE",
        exposeHeaders: "content-disposition",
        maxAge: 60 * 60 * 24
    };
    // 进程守护
    const cluster = {
        listen: {
            path: "",
            port: 7004,
            hostname: "0.0.0.0",
        }
    };
    // session
    // const session = {
    //     key: "jobtool_session",
    //     maxAge: 24 * 3600 * 1000 * 7, // 7天
    //     httpOnly: true,
    //     encrypt: true,
    //     path: "/"
    // };

    //jwt
    const jwtConfig = {
        secretOrPrivateKey: "moyu", //私钥或者
        expiresIn: `${1000 * 60 * 60 * 24 * 7}`, //过期时间
    };

    //文件上传
    const multipart = {
        mode: "file",
        fileSize: "5mb",
        fileExtensions: ["xls", "xlsx"],
        tmpdir: path.join(os.tmpdir(), "egg-multipart-tmp", appInfo.name),
        cleanSchedule: {
            cron: "0 30 4 * * *",
        },
    };
    /*
    |--------------------------------------------------------------------------
    | ！切记，数据库一定要设置密码，并且密码强度一定要够高，否则将会导致非常严重的后果
    |--------------------------------------------------------------------------
    */
    let mongoose = null;
    mongoose = {
        url: "mongodb://mongo/moyu",
        options: {
            user: "",
            pass: "",
            useUnifiedTopology: true
        },
        plugins: []
    };
    //sms短信服务
    const smsConfig = {
        base: { //基础信息 
            accessKeyId: "",
            accessKeySecret: "",
            endpoint: "",
            apiVersion: "2017-05-25"
        },
        template: { //模板配置
            RegionId: "",
            SignName: "",
            TemplateCode: "",
        },
        maxAge: 1000 * 60 * 5, //五分钟过期
    };
    //oss服务
    const ossConfig = {
        base: { //基础信息 
            accessKeyId: "",
            accessKeySecret: "",
            arn: "",
            bucket: "",
            region: ""
        },
        policy: { //授权策略
            Statement: [
                {
                    Action: [
                        "oss:GetObject",
                        "oss:PutObject",
                        "oss:ListParts",
                        "oss:ListObjects"
                    ],
                    Effect: "Allow",
                    Resource: []
                }
            ],
            Version: "1"
        }
    };
    //日志模块 https://eggjs.org/zh-cn/core/logger.html
    const logger = {
        dir: `../moyu-logs`,
        appLogName: "app-web.log",
        coreLogName: "web.log",
        agentLogName: "agent.log",
        errorLogName: "error.log",
        outputJSON: true,
    };
    //bodyparser
    const bodyParser = {
        jsonLimit: "3mb",
    }

    return {
        ...config,
        bodyParser,
        logger,
        mock,
        permission,
        throttle,
        validate,
        security,
        cors,
        cluster,
        multipart,
        ossConfig,
        smsConfig,
        mongoose,
        jwtConfig,
    };
};
