/**
 * @description        文档分享
 * @author             shuxiaokai
 * @create             2021-02-28 21:44
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const projectShareSchema = new Schema({
        shareId: { //分享id，不适用_id是为了防止数据被用户猜出来
            type: String,
        },
        projectId: { //项目id
            type: String,
        },
        projectName: { //项目名称
            type: String,
        },
        shareName: { //分享标题
            type: String,
        },
        password: { //密码
            type: String,
            default: ""
        },
        expire: { //过期时间，时间戳
            type: Number,
        },
        selectedDocs: { //允许用户查看的文档，如果没有当前字段则代表所有数据都允许查看
            type: Array,
            default: null
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
    }, { timestamps: true });

    return mongoose.model("project_share", projectShareSchema);
};