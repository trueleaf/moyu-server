/** 
 * @description        前端菜单表
 * @author              shuxiaokai
 * @create             2020-05-26 16:17
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const securityClientMenuSchema = new Schema({
        name: { //菜单名称
            type: String,
        },
        path: { //前端跳转路径
            type: String
        },
        pid: {
            type: String, //父级菜单ids
        },
        type: { //路由类型
            type: String,
            default: "inline", // inline内部路由  link外部链接
        },
        sort: {
            type: Number,
            default: Date.now()
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
    }, { timestamps: true });

    return mongoose.model("security_client_menu", securityClientMenuSchema);
};