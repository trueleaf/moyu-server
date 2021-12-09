/** 
    @description  用户表
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const INITIAL_USER = [
    {
        "_id": "5ed85c5b0c3e2c10388ebc3a",
        "__v": "0",
        "clientRoutes": [ ],
        "clinetMenus": [ ],
        "department": "222",
        "enable": "true",
        "lastLogin": "2/12/2020 06:03:04.464",
        "loginName": "admin",
        "loginTimes": "0",
        "password": "98b2f89fe0f8ac91bbdab35f9a170b82",
        "phone": "15228322222",
        "qq": "2",
        "realName": "管理员",
        "roleIds": [
            "5edf71f2193c7d5fa0ec9b98",
            "5ede0ba06f76185204584700",
            "5ee980553c63cd01a49952e4",
        ],
        "roleNames": [
            "权限管理-完全控制",
            "api文档-完全控制",
            "公共基础权限",
        ],
        "salt": "3219317",
        "serverRoutes": [ ],
        "starProjects": [ ],
        "title": "职称"
    },
    {
        "_id": "5f6842a9c461fb30905d0aaf",
        "__v": "0",
        "clientRoutes": [ ],
        "clinetMenus": [ ],
        "department": "",
        "enable": "true",
        "lastLogin": "21/9/2020 06:05:29.664",
        "loginName": "moyu",
        "loginTimes": "1",
        "password": "84d748e1ac5c09a425d463d18ac08b86",
        "phone": "123456789111",
        "qq": "",
        "realName": "快乐摸鱼",
        "roleIds": [
            "5ede0ba06f76185204584700",
            "5ee980553c63cd01a49952e4",
        ],
        "roleNames": [
            "api文档-完全控制",
            "公共基础权限",
        ],
        "salt": "2841279",
        "serverRoutes": [ ],
        "starProjects": [ ],
        "title": ""
    }
]
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const userSchema = new Schema({
        loginName: { //用户名称(登录名称)
            type: String,
        },
        realName: { //真实姓名
            type: String,
        },
        salt: { //盐
            type: String
        },
        password: { //密码
            type: String
        },
        phone: { //手机号码
            type: String
        },
        loginTimes: { //登录次数
            type: Number,
            default: 0,
        },
        lastLogin: { //上次登录时间
            type: Date,
        },
        email: { //邮箱
            type: String
        },
        enable: { //使能
            type: Boolean,
            default: true
        },
        roleIds: { //角色id
            type: Array,
            default: []
        },
        roleNames: {
            type: Array, //角色名称，仅供前端显示方便，避免一次查询,
            default: []
        },
        clientRoutes: { //前端路由，权限管理时候进行修改避免用户登录时多次查询
            type: Array,
            default: [],
        },
        clinetMenus: { //前端菜单，权限管理时候进行修改避免用户登录时多次查询
            type: Array,
            default: []
        },
        serverRoutes: { //后端路由，权限管理时候进行修改避免用户登录时多次查询
            type: Array,
            default: []
        },
        recentVisitProjects: { //最近访问的项目
            type: Array,
            default: []
        },
        starProjects: { //收藏项目
            type: Array,
            default: []
        },
        couldVisitProjects: { //可以访问的项目列表id集合
            type: Array,
            default: []
        }
    }, {
        timestamps: true,
    });
    const userModel = mongoose.model("security_user", userSchema);
    userModel.findOne().then((res) => {
        if (res === null) {
            console.log("初始化用户信息")
            INITIAL_USER.forEach(val => {
                val.lastLogin = new Date();
            })
            userModel.insertMany(INITIAL_USER);
        }
    });
    return userModel;
};
