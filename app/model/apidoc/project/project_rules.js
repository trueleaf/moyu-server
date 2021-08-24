/**
    @description  项目规则模型
    @author       shuxiaokai
    @create       2020/12/2 上午9:20:24
*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const projectRulesSchema = new Schema({
        projectId: { //项目id
            type: String,
            required: true
        },
        fileInFolderLimit: { //单个文件夹默认限制文件个数
            type: Number,
            default: "8",
            min: 0,
            max: 20,
            required: true,
        },
        dominLimit: { //每个项目限制配置域名个数
            type: Number,
            default: "5",
            min: 0,
            max: 20,
            required: true,
        },
        requireDescription: { //参数是否必填
            type: Boolean
        },
        requireValue: { //参数值是否必填
            type: Boolean
        },
        enableCollapseAnimation: { //是否开启折叠动画
            type: Boolean
        },
        contentType: [{ //contentType
            value: { //contentType值
                type: String,
                minlength: 0,
                maxlength: 255,
                required: true,
            },
            name: { //别名
                type: String,
                minlength: 0,
                maxlength: 255,
                required: true,
            },
            enabled: { //使能
                type: Boolean,
                default: true,
                required: true,
            },
        }],
        requestMethods: [{ //请求方法
            value: { //请求方法 readOnly
                type: String,
                minlength: 0,
                maxlength: 255,
                required: true,
            },
            name: { //昵称
                type: String,
                minlength: 0,
                maxlength: 255,
                required: true,
            },
            enabled: { //使能
                type: Boolean,
                default: true,
                required: true,
            },
            iconColor: { //图标颜色
                type: String,
                minlength: 0,
                maxlength: 255,
                required: true,
            },
            enabledContenTypes: [],//该方法允许的contentType
        }],
    }, {
        timestamps: true
    });
    return mongoose.model("project_rules", projectRulesSchema);
};
