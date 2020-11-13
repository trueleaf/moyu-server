/** 
    @description  文档模型
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docSchema = new Schema({
        uuid: { //若为导入的数据则以uuid当作_id使用
            type: String,
            default: ""
        },
        pid: { //父元素id
            type: String, 
            default: ""
        },
        docName: {
            required: [true, "请正确输入doc名称"],
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 100
        },
        docType: { //文档类型,   1.文件夹 2.普通文档 3.markdown文档
            type: String,
            enum: ["folder", "file", "markdown"]
        },
        isFolder: { //是否是文件夹
            required: true,
            type: Boolean,
        },
        sort: { //排序字段，时间戳
            required: true,
            type: Number,
        },
        ancestors: { //当前元素所有祖先
            required: false,
            type: Array
        },
        projectId: { //项目id
            required: true,
            type: mongoose.Schema.Types.ObjectId,
        },
        item: {
            description: {
                type: String,
                trim: true,
                maxlength: 255,
                default: "",      
            },
            methods: {
                type: String,
                trim: true,
                maxlength: 30,
                default: "get"  
            },
            url: {
                host: {
                    type: String,
                    trim: true,
                    default: ""
                },
                path: {
                    type: String,
                    trim: true,
                    default: ""
                }
            },
            requestType: {
                type: String,
                enum: ["query", "json", "formData", "x-www-form-urlencoded"],
                default: "query"
            },
            header: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },
                    value: {
                        type: String,
                        trim: true,
                    },
                    description: {
                        type: String,
                        trim: true,
                    },
                    type: {
                        type: String,
                        trim: true
                    },
                    required: {
                        type: Boolean
                    },
                    children: {
                        type: Array
                    }
                }
            ],
            requestParams: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },
                    description: {
                        type: String,
                        trim: true,
                    },
                    type: {
                        type: String,
                        trim: true
                    },
                    value: {
                        type: String,
                    },
                    required: {
                        type: Boolean
                    },
                    children: {
                        type: Array
                    },
                    _select: { //请求参数是否选中
                        type: Boolean,
                        default: true
                    }
                }
            ],
            responseParams: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },
                    value: {
                        type: String,
                    },
                    description: {
                        type: String,
                        trim: true,
                    },
                    type: {
                        type: String,
                        trim: true
                    },
                    required: {
                        type: Boolean
                    },
                    children: {
                        type: Array
                    }
                }
            ],
            otherParams: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },
                    value: {
                        type: String,
                        trim: true,
                    },
                    description: {
                        type: String,
                        trim: true,
                    },
                    type: {
                        type: String,
                        trim: true
                    },
                    required: {
                        type: Boolean
                    },
                    children: {
                        type: Array
                    }
                }
            ]
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
        publish: { //是否发布
            type: Boolean,
            default: false
        },
        publishRecords: { //发布时间日志
            type: [
                {
                    publisher: { //发布人信息
                        type: String,
                        default: "" 
                    },
                    time: { //发布日期
                        type: String,
                        default: ""
                    }
                }
            ],
            default: [],
        }
    }, { timestamps: true });

    return mongoose.model("doc", docSchema);
};