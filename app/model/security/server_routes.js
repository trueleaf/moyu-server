
/** 
 * @description        后端路由表
 * @author              shuxiaokai
 * @create             2020-05-19 18:16
 * @remark             接口信息代表是否允许调用当前接口，前端路由信息代表是否展示前端内容，两者是完全不同的概念
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const serverRoutesSchema = new Schema({
        name: { //路由名称
            type: String,
        },
        path: { //路由地址
            type: String,
        },
        method: { //请求方法
            type: String,
        },
        groupName: { //分组名称，只用于前端过滤
            type: String,
            default: ""
        },
        enabled: { //使能
            type: Boolean,
            default: true
        }
    }, { timestamps: true });
    return mongoose.model("security_server_routes", serverRoutesSchema);
};