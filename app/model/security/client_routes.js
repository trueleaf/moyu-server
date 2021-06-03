/**
 * @description        前端路由表
 * @author              shuxiaokai
 * @create             2020-05-19 18:16
 * @remark             接口信息代表是否允许调用当前接口，前端路由信息代表是否展示前端内容，两者是完全不同的概念
 */

//初始化客户端路由信息
const INITIAL_CLIENT_ROUTES = [
    {
        _id: "5edd91bf5fcdf3111671cbe6",
        __v: "0",
        enabled: "true",
        groupName: "公用",
        name: "登录页面",
        path: "/login",
    },
    {
        _id: "5edd91bf5fcdf3111671cbe8",
        __v: "0",
        enabled: "true",
        groupName: "api文档",
        name: "api文档-文档预览",
        path: "/v1/apidoc/doc-view",
    },
    {
        _id: "5edd91bf5fcdf3111671cbec",
        __v: "0",
        enabled: "true",
        groupName: "api文档",
        name: "api文档-项目列表",
        path: "/v1/apidoc/doc-list",
    },
    {
        _id: "5edd91c05fcdf3111671cbf4",
        __v: "0",
        enabled: "true",
        groupName: "api文档",
        name: "api文档-文档详情",
        path: "/v1/apidoc/doc-edit",
    },
    {
        _id: "5edd91c05fcdf3111671cbfa",
        __v: "0",
        enabled: "true",
        groupName: "权限管理",
        name: "权限管理",
        path: "/v1/permission/permission",
    },
    {
        _id: "5f4b8ad9ef30243780fd6bf1",
        __v: "0",
        enabled: "true",
        groupName: "设置",
        name: "设置-个人中心",
        path: "/v1/settings/user",
    },
];

module.exports = (app) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const clientRoutesSchema = new Schema(
        {
            name: {
                //路由名称
                type: String,
            },
            path: {
                //路由地址
                type: String,
            },
            groupName: {
                //分组名称，仅用于前端分组无其他实际意义
                type: String,
                default: "",
            },
            enabled: {
                //使能
                type: Boolean,
                default: true,
            },
        },
        { timestamps: true }
    );
    const clientRoutesModel = mongoose.model(
        "security_client_routes",
        clientRoutesSchema
    );
    clientRoutesModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化客户端路由");
            clientRoutesModel.insertMany(INITIAL_CLIENT_ROUTES);
        }
    });
    return clientRoutesModel;
};
