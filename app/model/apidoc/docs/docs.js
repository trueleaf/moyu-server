/** 
    @description  文档模型
    @author       shuxiaokai
    @create       2021-01-11 22:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
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
        info: { //基本信息
            name: { //文档名称
                type: String,
                required: true
            },
            description: { //文档描述
                type: String,
            },
            version: { //文档版本信息
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
            url: { //请求地址信息
                type: String,
            }, 
            paths: [ProperytySchema], //restful请求路径
            queryParams: [ProperytySchema], //查询字符串
            requestBody: [ProperytySchema], //请求body
            responses: [{ //返回值
                title: {
                    type: String,
                    default: "返回值"
                },
                statusCode: {
                    type: Number,
                    default: 200
                },
                values: [ProperytySchema]
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
    return mongoose.model("doc", docSchema);
};