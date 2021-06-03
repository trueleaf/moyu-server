/**
 * @description        前端菜单表
 * @author              shuxiaokai
 * @create             2020-05-26 16:17
 */

//初始化菜单
const INITIAL_MENUS = [
    {
        _id: "5eddf6a821a5aa26cc316d28",
        __v: "0",
        enabled: "true",
        name: "权限管理",
        path: "/v1/permission/permission",
        pid: "",
        sort: "1591603491200",
        type: "inline",
    },
    {
        _id: "602e7c40b4ea582923bcb36f",
        __v: "0",
        enabled: "true",
        name: "api文档",
        path: "/v1/apidoc/doc-list",
        pid: "",
        sort: "1613638151467",
        type: "inline",
    },
];

module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const securityClientMenuSchema = new Schema(
        {
            name: {
                //菜单名称
                type: String,
            },
            path: {
                //前端跳转路径
                type: String,
            },
            pid: {
                type: String, //父级菜单ids
            },
            type: {
                //路由类型
                type: String,
                default: "inline", // inline内部路由  link外部链接
            },
            sort: {
                type: Number,
                default: Date.now(),
            },
            enabled: {
                //使能
                type: Boolean,
                default: true,
            },
        },
        { timestamps: true }
    );

    const securityClientMenuModel = mongoose.model(
        "security_client_menu",
        securityClientMenuSchema
    );
    securityClientMenuModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化客户端菜单");
            securityClientMenuModel.insertMany(INITIAL_MENUS);
        }
    });
    return securityClientMenuModel;
};
