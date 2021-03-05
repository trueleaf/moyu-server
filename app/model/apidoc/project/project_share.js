/**
 * @description        文档分享
 * @author             shuxiaokai
 * @create             2021-02-28 21:44
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const projectShareSchema = new Schema({
        shareId: { //随机生成的id
            type: String
        },
        projectId: { //项目id
            type: String,
        },
        password: { //密码
            type: String,
        },
        expire: { //过期时间，时间戳
            type: Number,
        },
        eTag: { //标识文档是否更新
            type: String,
        }
    }, { timestamps: true });

    return mongoose.model("project_share", projectShareSchema);
};