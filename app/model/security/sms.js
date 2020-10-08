/** 
 * @description        验证码临时存放
 * @author              shuxiaokai
 * @create             2020-03-25 18:29
 */


 
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const smsSchema = new Schema({
        phone: { 
            type: String,
        },
        smsCode: {
            type: String
        },
    }, { timestamps: true });

    return mongoose.model("security_sms", smsSchema);
};