/**
 * @description        文档标签信息
 * @author             shuxiaokai
 * @create             2021-05-07 22:19
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsTagSchema = new Schema({
        projectId: { //项目id
            type: String
        },
        name: { //标签名称 
            type: String,
        },
        color: { //颜色
            type: String,
        },
        creator: { //创建者
            type: String
        },
        maintainer: { //修改人员维护人员
            type: String
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
    }, { timestamps: true });

    return mongoose.model("docs_tag", docsTagSchema);
};