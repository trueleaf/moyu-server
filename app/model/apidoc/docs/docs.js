/** 
    @description  文档模型
    @author       shuxiaokai
    @create       2021-01-11 22:10
*/

const { uuid } = require("../../../extend/helper");

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    //接口参数模型
    const ProperytySchema = new Schema({
        _id: {
            type: String,
        },
        key: { //字段名称
            type: String,
            trim: true,
        },
        type: { //字段类型
            type: String,
            trim: true,
            enum: ["string", "number", "boolean", "array", "object", "file"]
        },
        description: { //字段描述
            type: String,
            trim: true,
        },
        value: { //字段值
            type: String,
        },
        required: { //是否必填
            type: Boolean
        },
        select: { //业务参数，是否选中
            type: Boolean,
            default: true
        },
        editor: { //最后一次编辑人
            type: String,
        },
        editorId: { //最后一次编辑人id
            type: String
        },
        children: [], //嵌套字段
    });
    //文档模型信息
    const docSchema = new Schema({
        pid: { //父元素id
            type: String, 
            default: ""
        },
        projectId: { //项目id
            required: true,
            type: String,
        },
        isFolder: { //是否为文件夹
            type: Boolean,
            required: true
        },
        sort: { //排序字段，时间戳
            required: true,
            type: Number,
            default: Date.now()
        },
        info: { //基本信息
            name: { //文档名称
                type: String,
                required: true
            },
            description: { //文档描述
                type: String,
                default: ""
            },
            version: { //文档版本信息
                type: String,
            },
            type: { //文档类型,   1.文件夹 2.普通文档 3.markdown文档
                type: String,
                enum: ["folder", "api", "markdown"]
            },
            tag: { //文档标签
                name: { //名称
                    type: String,
                },
                color: { //颜色
                    type: String,
                },
                _id: { //唯一id
                    type: String,
                }
            },
            creator: { //创建者
                type: String,
            },
            maintainer: { //维护人员，最近一次更新人员
                type: String,
            },
            deletePerson: { //删除文档的人
                type: String
            },
            spendTime: { //录入接口花费时间
                type: Number,
                default: 0,
            },
        },
        preRequest: {
            raw: { //预请求脚本信息
                type: String,
                default: ""
            }
        },
        afterRequest: { //后置脚本
            raw: {
                type: String,
                default: ""
            },
        },
        //公共请求头
        commonHeaders: [ProperytySchema],
        item: {
            method: { //请求方法
                type: String,
                trim: true,
                enum: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD", "CONNECTION", "TRACE"],
                default: "GET"  
            },
            url: { //请求地址信息
                host: { //host地址
                    type: String,
                    default: ""
                },
                path: { //请求路径
                    type: String,
                    default: ""
                }
            }, 
            paths: [ProperytySchema], //restful请求路径
            queryParams: [ProperytySchema], //查询字符串
            requestBody: {
                mode: {
                    type: String,
                    enum: ["json", "raw", "formdata", "urlencoded", "binary", "none"],
                    default: "json"
                },
                rawJson: {
                    type: String
                },
                json: [ProperytySchema],
                formdata: [ProperytySchema],
                urlencoded: [ProperytySchema],
                raw: {
                    type: {
                        data: String,
                        dataType: String,
                    },
                    default: {
                        data: "",
                        dataType: "text/plain",
                    },
                },
                file: {
                    url: String
                },
            }, //请求body
            responseParams: {
                type: [{ //返回值
                    _id: {
                        type: String,
                        default: uuid,
                    },
                    title: {
                        type: String,
                        default: "成功返回"
                    },
                    statusCode: {
                        type: Number,
                        default: 200
                    },
                    value: {
                        dataType: {
                            type: String,
                        },
                        json: [ProperytySchema],
                        text: String,
                        file: {
                            url: String,
                            raw: String,
                        },
                    }
                }],
                default: [{
                    title: "成功返回",
                    statusCode: 200,
                    value: {
                        dataType: "application/json",
                        json: [],
                        file: {
                            url: "",
                            raw: "",
                        },
                        text: "",
                    }
                }]
            },
            headers: [ProperytySchema], //请求头
            contentType: { //请求contentType
                type: String,
                trim: true,
                enum: ["application/json", "application/x-www-form-urlencoded", "multipart/form-data", "text/plain", "application/xml", "text/html", ""],
            },
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
    }, { timestamps: true });
    return mongoose.model("doc", docSchema);
};