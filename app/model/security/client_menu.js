/**
 * @description        前端菜单表
 * @author              shuxiaokai
 * @create             2020-05-26 16:17
 */

//初始化菜单
const INITIAL_MENUS = [
    {
        "_id": "5eddf6a821a5aa26cc316d28",
        "__v": "0",
        "enabled": "true",
        "name": "权限管理",
        "path": "/v1/permission/permission",
        "pid": "",
        "sort": "1591603491200",
        "type": "inline"
    },
    {
        "_id": "5ee9a5b1cde26b8e24fc8270",
        "__v": "0",
        "enabled": "true",
        "name": "api文档",
        "path": "/v1/apidoc/doc-list",
        "pid": "",
        "sort": "1593001154242",
        "type": "inline"
    },
    {
        "_id": "5ef3476715dfaa57d0a5ac6f",
        "__v": "0",
        "enabled": "true",
        "name": "文档管理",
        "path": "/v1/apidoc/doc-edit",
        "pid": "",
        "sort": "1593001154241",
        "type": "inline"
    },
    {
        "_id": "5facab3497968d8338e71b1d",
        "__v": "0",
        "enabled": "true",
        "name": "运维管理",
        "path": "/v1/ci-cd",
        "pid": "",
        "sort": "1591603491199",
        "type": "inline"
    },
    {
        "_id": "5fb218b8a01bf25ef09880ce",
        "__v": "0",
        "enabled": "true",
        "name": "代码生成",
        "path": "/v1/easycode",
        "pid": "",
        "sort": "1591603491198",
        "type": "inline"
    }
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
            console.log("初始化客户端菜单")
            securityClientMenuModel.insertMany(INITIAL_MENUS);
        }
    });
    return securityClientMenuModel;
};
