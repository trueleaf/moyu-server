/** 
    @description  文档模型
    @author       shuxiaokai
    @create       2021-01-11 22:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    //服务器模型
    const ServerSchema = new Schema({
        host: { //主机地址
            type: String,
            trim: true,
        },
        path: { //接口路径
            type: String,
            trim: true,
        },
        description: { //描述
            type: String,
        }
    });
    //接口参数模型
    const ProperytySchema = new Schema({
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
        children: [], //嵌套字段
        _select: { //业务参数，是否选中
            type: Boolean,
            default: true
        }
    });

    const docSchema = new Schema({
        pid: { //父元素id
            type: String, 
            default: ""
        },
        projectId: { //项目id
            required: true,
            type: String,
        },
        info: { //基本信息
            title: { //api标题
                type: String,
                required: true
            },
            description: { //api描述
                type: String,
            },
            version: { //api版本信息
                type: String,
            },
            type: { //文档类型,   1.文件夹 2.普通文档 3.markdown文档
                type: String,
                enum: ["folder", "api", "markdown"]
            },
            sort: { //排序字段，时间戳
                required: true,
                type: Number,
            },
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
        item: {
            method: { //请求方法
                type: String,
                trim: true,
                enum: ["get", "post", "put", "delete", "options", "patch", "head"],
                default: "get"  
            },
            servers: [ServerSchema], //服务器信息
            paths: [ProperytySchema], //restful请求路径
            queryParams: [ProperytySchema], //查询字符串
            requestBody: [ProperytySchema], //请求body
            responses: [{ //返回值
                
            }],
            headers: [ProperytySchema], //请求头
            contentType: { //请求contentType
                type: String,
                trim: true,
                enum: ["application/json", "application/x-www-form-urlencoded", "multipart/form-data"],
                default: "application/json"  
            },
        },
    }, { timestamps: true });
    return mongoose.model("doc2", docSchema);
};