/** 
 * @description        项目模型
 * @author              shuxiaokai
 * @create             2020-11-12 13:15
 */


module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const teamProjectSchema = new Schema({
        projectName: { //项目名称
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 30
        },
        remark: { //备注
            type: String,
            trim: true,
            maxlength: 255,
            default: ""
        },
        clientInfo: { //客户端相关
            label: { //模块描述
                type: String,
                default: "客户端相关"
            },
            gitRepository: [{ //项目相关的git地址
                label: { //描述
                    type: String,
                    required: true
                },
                address: { //地址
                    type: String,
                    required: true
                },
                remark: { //备注
                    type: String,
                    required: true
                },
                attachment: [{ //附件
                    url: {
                        type: String,
                    }
                }]
            }],
        },
        serverInfo: { //服务端相关
            label: { 
                type: String,
                default: "服务端相关"
            }
        },
        uiInfo: { //ui相关
            label: { 
                type: String,
                default: "ui相关"
            }
        },
        pmInfo: {
            label: { 
                type: String,
                default: "产品相关"
            }
        },


        
        uiRepository: [{ //ui相关的数据地址
            label: { //描述
                type: String,
                required: true
            },
            address: { //地址
                type: String,
                required: true
            },
            remark: { //备注
                type: String,
                required: true
            },
            attachment: [{ //附件
                url: {
                    type: String,
                }
            }]
        }],
        pmRepository: [{ //产品相关的数据地址
            label: { //描述
                type: String,
                required: true
            },
            address: { //地址
                type: String,
                required: true
            },
            remark: { //备注
                type: String,
                required: true
            },
            attachment: [{ //附件
                url: {
                    type: String,
                }
            }]
        }],
        // clientConfig: { //客户端相关配置
            
        // },
        // serverConfig: { //服务端相关配置

        // },
        enabled: { //使能
            type: Boolean,
            default: true,
        },
        owner: { //创建者
            id: {
                type: String, //用户id
            },
            name: {
                type: String, //用户名称
            }
        },
        members: [{ //成员信息
            userId: {
                type: String,
                required: true
            },
            loginName: { //登录名称(冗余字段)
                type: String,
                default: ""
            },
            realName: { //真实姓名(冗余字段)
                type: String,
                default: ""
            },
            permission: {
                type: String,
                required: true,
                enum: ["readOnly", "readAndWrite", "admin"], //可读，读写，管理员
            }
        }]
    }, { timestamps: true });

    return mongoose.model("teamProject", teamProjectSchema);
};