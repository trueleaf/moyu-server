/** 
    @description  用户表
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


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
        qq: { //qq号码
            type: String
        },
        department: { //部门
            type: String
        },
        title: { //头衔
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
        starProjects: { //收藏项目
            type: Array,
            default: []
        },
    }, {
        timestamps: true,
    });
    return mongoose.model("security_user", userSchema);
};
