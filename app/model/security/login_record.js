/** 
    @description  用户登录信息(用于记录登录信息，锁定非法登录)
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const loginRecordSchema = new Schema({
        ip: { //ip地址
            type: String,
        },
        loginTimes: { //登录次数
            type: Number,
            default: 0,
        },
        userAgent: { //代理信息
            type: String,
            default: 0,
        },
    }, {
        timestamps: true,
    });
    return mongoose.model("security_login_record", loginRecordSchema);
};
