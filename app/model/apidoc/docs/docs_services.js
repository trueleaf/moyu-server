/** 
    @description  服务器(host)模型
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/



module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsServiceSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }, 
        remark: {
            type: String,
        },
        projectId: {
            type: String
        },
        enabled: { //使能
            type: Boolean,
            default: true
        },
    }, { timestamps: true });
    return mongoose.model("docs_service", docsServiceSchema);
};