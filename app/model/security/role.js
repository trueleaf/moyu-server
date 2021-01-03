/** 
 * @description        分组(角色)表
 * @author              shuxiaokai
 * @create             2020-05-19 22:13
 */

const INITIAL_ROLE = [
    {
        "_id": "5ede0ba06f76185204584700",
        "__v": "0",
        "clientBanner": [ '5ee9a5b1cde26b8e24fc8270' ],
        "clientRoutes": [ '5edd91bf5fcdf3111671cbe6', '5edd91bf5fcdf3111671cbe8', '5edd91bf5fcdf3111671cbee', '5edd91bf5fcdf3111671cbec', '5edd91c05fcdf3111671cbf4' ],
        "enabled": "true",
        "remark": "对文档拥有所有权限",
        "roleName": "api文档-完全控制",
        "serverRoutes": [ '5ff17a0defe2a82db087c9ea', '5ff1792c972b5a29804e1ac3', '5ff166479c0b4737b81ee490', '5edd91af5fcdf3111671cb15', '5edd91af5fcdf3111671cb17', '5edd91af5fcdf3111671cb19', '5edd91af5fcdf3111671cb1b', '5edd91af5fcdf3111671cb1d', '5edd91af5fcdf3111671cb1f', '5edd91af5fcdf3111671cb21', '5edd91af5fcdf3111671cb23', '5edd91af5fcdf3111671cb25', '5edd91af5fcdf3111671cb27', '5edd91af5fcdf3111671cb29', '5edd91af5fcdf3111671cb2b', '5edd91af5fcdf3111671cb2d', '5edd91af5fcdf3111671cb2f', '5edd91af5fcdf3111671cb31', '5edd91af5fcdf3111671cb33', '5edd91af5fcdf3111671cb35', '5edd91af5fcdf3111671cb37', '5edd91af5fcdf3111671cb39', '5edd91b05fcdf3111671cb3b', '5edd91b05fcdf3111671cb3d', '5edd91b05fcdf3111671cb3f', '5edd91b05fcdf3111671cb41', '5edd91b05fcdf3111671cb43', '5edd91b05fcdf3111671cb45', '5edd91b05fcdf3111671cb47', '5edd91b05fcdf3111671cb49', '5edd91b05fcdf3111671cb4b', '5edd91b05fcdf3111671cb4d', '5edd91b05fcdf3111671cb4f', '5edd91b05fcdf3111671cb51', '5edd91b05fcdf3111671cb53', '5edd91b05fcdf3111671cb55', '5edd91b05fcdf3111671cb57', '5edd91b05fcdf3111671cb59', '5edd91b05fcdf3111671cb5b', '5edd91b05fcdf3111671cb5d', '5edd91b05fcdf3111671cb5f', '5edd91b05fcdf3111671cb61', '5edd91b05fcdf3111671cb63', '5edd91b05fcdf3111671cb65', '5edd91b05fcdf3111671cb67', '5edd91b05fcdf3111671cb69', '5edd91b05fcdf3111671cb6b', '5edd91b05fcdf3111671cb6d', '5ef2fd16e06c4e3120525a53', '5f154f56807e656ffc9dc18f', '5f1cf705696cb02244906473', '5f1cf6f8696cb02244906472', '5f1d8983fc9868398ce5cb94', '5f1e44d63e2abf46ec9956e3', '5f1e44e93e2abf46ec9956e4', '5f1e44f33e2abf46ec9956e5', '5f1e45053e2abf46ec9956e6', '5f1e85a991093c38a013c312', '5f28f5ca7a979a258c4815e0', '5ef085889b54825e2c9dc8d0', '5f3cf70419d6a04bc0f58ccc', '5f4e001ba7d77849dc3928af', '5f522db8de45f651f8140397', '5fade1e3b229918054fb4f90', '5fc6f4314d7b47a1cc2fb8d9', '5fc6f43e4d7b47a1cc2fb8da' ]
    },
    {
        "_id": "5ededa7b6f76185204584701",
        "__v": "0",
        "clientBanner": [ '5ee9a5b1cde26b8e24fc8270' ],
        "clientRoutes": [ '5edd91bf5fcdf3111671cbe8', '5edd91bf5fcdf3111671cbec', '5edd91bf5fcdf3111671cbe6' ],
        "enabled": "true",
        "remark": "只能通过只读页面，查看文档",
        "roleName": "api文档-只读",
        "serverRoutes": [ '5ff17a0defe2a82db087c9ea','5ff1792c972b5a29804e1ac3', '5ff166479c0b4737b81ee490', '5edd91af5fcdf3111671cb19', '5edd91af5fcdf3111671cb17', '5edd91af5fcdf3111671cb1f', '5edd91af5fcdf3111671cb21', '5edd91b05fcdf3111671cb3b', '5edd91af5fcdf3111671cb39', '5edd91af5fcdf3111671cb37', '5edd91b05fcdf3111671cb5b', '5edd91b05fcdf3111671cb5d', '5edd91b05fcdf3111671cb6d', '5f4e001ba7d77849dc3928af', '5f522db8de45f651f8140397', '5f1d8983fc9868398ce5cb94' ]
    },
    {
        "_id": "5ededbd46f76185204584702",
        "__v": "0",
        "clientBanner": [ '5ee9a5b1cde26b8e24fc8270', '5ef3476715dfaa57d0a5ac6f' ],
        "clientRoutes": [ '5edd91bf5fcdf3111671cbe6', '5edd91bf5fcdf3111671cbe8', '5edd91bf5fcdf3111671cbec', '5edd91c05fcdf3111671cbf4' ],
        "enabled": "true",
        "remark": "可以进行单个文档进行增删改查，但是不允许创建项目和删除项目",
        "roleName": "api文档-读写",
        "serverRoutes": [ '5ff17a0defe2a82db087c9ea','5ff1792c972b5a29804e1ac3', '5ff166479c0b4737b81ee490', '5edd91af5fcdf3111671cb17', '5edd91af5fcdf3111671cb19', '5edd91af5fcdf3111671cb1f', '5edd91af5fcdf3111671cb21', '5edd91af5fcdf3111671cb29', '5edd91af5fcdf3111671cb2b', '5edd91af5fcdf3111671cb2d', '5edd91af5fcdf3111671cb2f', '5edd91af5fcdf3111671cb31', '5edd91af5fcdf3111671cb33', '5edd91b05fcdf3111671cb3b', '5edd91af5fcdf3111671cb39', '5edd91af5fcdf3111671cb37', '5edd91af5fcdf3111671cb35', '5edd91b05fcdf3111671cb3d', '5edd91b05fcdf3111671cb3f', '5edd91b05fcdf3111671cb41', '5edd91b05fcdf3111671cb43', '5edd91b05fcdf3111671cb45', '5edd91b05fcdf3111671cb47', '5edd91b05fcdf3111671cb49', '5edd91b05fcdf3111671cb4b', '5edd91b05fcdf3111671cb4d', '5edd91b05fcdf3111671cb4f', '5edd91b05fcdf3111671cb51', '5edd91b05fcdf3111671cb53', '5edd91b05fcdf3111671cb55', '5edd91b05fcdf3111671cb57', '5edd91b05fcdf3111671cb59', '5edd91b05fcdf3111671cb5b', '5edd91b05fcdf3111671cb5d', '5edd91b05fcdf3111671cb5f', '5edd91b05fcdf3111671cb61', '5edd91b05fcdf3111671cb63', '5edd91b05fcdf3111671cb65', '5edd91b05fcdf3111671cb67', '5edd91b05fcdf3111671cb69', '5edd91b05fcdf3111671cb6b', '5edd91b05fcdf3111671cb6d', '5f154f56807e656ffc9dc18f', '5f1cf6f8696cb02244906472', '5f1cf705696cb02244906473', '5f1d8983fc9868398ce5cb94', '5f1e44d63e2abf46ec9956e3', '5f1e44e93e2abf46ec9956e4', '5f1e44f33e2abf46ec9956e5', '5f1e45053e2abf46ec9956e6', '5f1e85a991093c38a013c312', '5f28f5ca7a979a258c4815e0', '5f3cf70419d6a04bc0f58ccc', '5f4e001ba7d77849dc3928af', '5f522db8de45f651f8140397', '5fc6f4314d7b47a1cc2fb8d9' ]
    },
    {
        "_id": "5edf71f2193c7d5fa0ec9b98",
        "__v": "0",
        "clientBanner": [ '5eddf6a821a5aa26cc316d28' ],
        "clientRoutes": [ '5edd91c05fcdf3111671cbfa', '5edd91bf5fcdf3111671cbe6' ],
        "enabled": "true",
        "remark": "拥有所有权限管理能力",
        "roleName": "权限管理-完全控制",
        "serverRoutes": [ '5edd91b25fcdf3111671cba5', '5edd91b25fcdf3111671cba7', '5edd91b25fcdf3111671cba9', '5edd91b25fcdf3111671cbab', '5edd91b25fcdf3111671cbad', '5edd91b25fcdf3111671cbaf', '5edd91b15fcdf3111671cb9b', '5edd91b15fcdf3111671cb9d', '5edd91b15fcdf3111671cb9f', '5edd91b15fcdf3111671cba1', '5edd91b25fcdf3111671cba3', '5edd91b15fcdf3111671cb79', '5edd91b15fcdf3111671cb7b', '5edd91b15fcdf3111671cb7d', '5edd91b15fcdf3111671cb7f', '5edd91b15fcdf3111671cb81', '5edd91b15fcdf3111671cb83', '5edd91b15fcdf3111671cb85', '5edd91b15fcdf3111671cb87', '5edd91b15fcdf3111671cb89', '5edd91b15fcdf3111671cb8b', '5edd91b15fcdf3111671cb8d', '5edd91b15fcdf3111671cb8f', '5edd91b15fcdf3111671cb91', '5edd91b15fcdf3111671cb93', '5edd91b15fcdf3111671cb95', '5edd91b15fcdf3111671cb97', '5edd91b15fcdf3111671cb99', '5ee7623c1481a140fc10f67f', '5ee9a3ecf4365169e46c0b20', '5ee9cd4d82195086185232be', '5ef085889b54825e2c9dc8d0', '5f29180adff3fd0f6823d633', '5f2a059ccf1a4a45bcb09282' ]
    },
    {
        "_id": "5edf7286193c7d5fa0ec9b99",
        "__v": "0",
        "clientBanner": [ '5eddf6a821a5aa26cc316d28' ],
        "clientRoutes": [ '5edd91bf5fcdf3111671cbe6', '5edd91c05fcdf3111671cbfa' ],
        "enabled": "true",
        "remark": "允许对权限进行分配，但是不允许新增和删除",
        "roleName": "权限管理-分配",
        "serverRoutes": [ '5edd91b15fcdf3111671cb9b', '5edd91b25fcdf3111671cba5', '5edd91b25fcdf3111671cba7', '5edd91b25fcdf3111671cba9', '5edd91b25fcdf3111671cbad', '5edd91b15fcdf3111671cb97', '5edd91b15fcdf3111671cb99', '5edd91b15fcdf3111671cb93' ]
    },
    {
        "_id": "5ee980553c63cd01a49952e4",
        "__v": "0",
        "clientBanner": [ ],
        "clientRoutes": [ '5edd91bf5fcdf3111671cbe6', '5f4b8ad9ef30243780fd6bf1' ],
        "enabled": "true",
        "remark": "登录，注册，获取用户基本信息",
        "roleName": "公共基础权限",
        "serverRoutes": [ '5edd91b15fcdf3111671cb6f', '5edd91b15fcdf3111671cb71', '5edd91b15fcdf3111671cb73', '5edd91b15fcdf3111671cb75', '5edd91b15fcdf3111671cb77', '5ee97f0c3c63cd01a49952e3', '5f4cf1ddf8a3c9267429c080', '5f4dc07a97fc7c39f819f4c0' ]
    },
    {
        "_id": "5f91695475c7903084f4d686",
        "__v": "0",
        "clientBanner": [ '5facab3497968d8338e71b1d' ],
        "clientRoutes": [ '5facaabb97968d8338e71b1c' ],
        "enabled": "true",
        "remark": "只读运维",
        "roleName": "运维-只读",
        "serverRoutes": [ '5f91693375c7903084f4d685' ]
    },
    {
        "_id": "5fb218dfa01bf25ef09880cf",
        "__v": "0",
        "clientBanner": [ '5fb218b8a01bf25ef09880ce' ],
        "clientRoutes": [ '5fb2195da01bf25ef09880d0' ],
        "enabled": "true",
        "remark": "代码生成",
        "roleName": "自动化代码生成",
        "serverRoutes": [ ]
    },
    {
        "_id": "5fbb13533fe3491d0422aada",
        "__v": "0",
        "clientBanner": [ ],
        "clientRoutes": [ ],
        "enabled": "true",
        "remark": "允许对oss进行任何操作",
        "roleName": "oss-管理",
        "serverRoutes": [ '5edd91b25fcdf3111671cbb1', '5edd91b25fcdf3111671cbb3', '5edd91b25fcdf3111671cbb5', '5edd91b25fcdf3111671cbb7', '5edd91b25fcdf3111671cbb9', '5edd91b25fcdf3111671cbbb' ]
    }
]

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
    const roleModel = mongoose.model("security_role", roleSchema);
    roleModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化角色信息")
            roleModel.insertMany(INITIAL_ROLE);
        }
    });
    return roleModel;
};