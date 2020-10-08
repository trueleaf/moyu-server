/** 
    @description  文档自定义状态码模型
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsCodeSchema = new Schema({
        code: { 
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        remark: {
            type: String,
        },
        projectId: {
            type: String,
            required: true
        },
        isSuccess: {
            type: Boolean,
            required: true,
            default: false,
        },
    }, { timestamps: true });

    return mongoose.model("docs_code", docsCodeSchema);
};