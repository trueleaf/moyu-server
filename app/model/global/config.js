
/*
|--------------------------------------------------------------------------
| 全局配置相关
|--------------------------------------------------------------------------
*/
const INITIAL_GLOBAL_CONFIG = {
    title: "快乐摸鱼",
    version: "0.8.0",
    consoleWelcome: true,
    enableRegister: true,
    enableGuest: true,
    enableDocLink: true,
    shareUrl: "https://share.jobtool.cn",
    autoUpdate: false,
    updateUrl: "",
}

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const globalConfigSchema = new Schema({
        version: { //版本信息
            type: String
        },
        title: { //名称 
            type: String,
        },
        consoleWelcome: { //是否打印欢迎信息
            type: Boolean,
            default: false,
        },
        enableRegister: { //是否允许用户注册
            type: Boolean,
            default: false,
        },
        enableGuest: { //是否允许来宾用户体验
            type: Boolean,
            default: false,
        },
        enableDocLink: { //是否显示文档和帮助链接
            type: Boolean,
            default: false,
        },
        shareUrl: { //文档导出地址
            type: String,
            default: ""
        },
        autoUpdate: { //是否开启自动更新
            type: Boolean,
            default: false,
        },
        updateUrl: { //electron更新地址
            type: String,
        },
    }, { timestamps: true });
    const globalConfigModel = mongoose.model("global_config", globalConfigSchema);
    globalConfigModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化全局配置")
            globalConfigModel.create(INITIAL_GLOBAL_CONFIG);
        }
    });
    return globalConfigModel;
};