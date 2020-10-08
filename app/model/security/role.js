/** 
 * @description        分组(角色)表
 * @author              shuxiaokai
 * @create             2020-05-19 22:13
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const roleSchema = new Schema({
        roleName: { //角色名称 
            type: String,
        },
        clientRoutes: { //前端路由
            type: Array
        },
        clientBanner: { //前端菜单
            type: Array
        },
        serverRoutes: { //服务端路由
            type: Array
        },
        remark: { //备注信息
            type: String,
        },
        enabled: {
            type: Boolean,
            default: true
        },
    }, { timestamps: true });

    return mongoose.model("security_role", roleSchema);
};