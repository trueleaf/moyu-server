/**
 * @description        文档分享
 * @author             shuxiaokai
 * @create             2021-02-28 21:44
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsOnlineSchema = new Schema({
        projectId: { //项目id
            type: String,
        },
        password: { //密码
            type: String,
        },
        expire: { //过期时间，时间戳
            type: Number,
        },
    }, { timestamps: true });

    return mongoose.model("docs_online", docsOnlineSchema);
};