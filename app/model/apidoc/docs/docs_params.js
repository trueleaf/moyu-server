/** 
    @description  自定义参数模型
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/



module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsParamsSchema = new Schema({
        label: { //参数中文名称
            type: String,
            required: true
        },
        value: { //参数对应值
            type: String,
        },
        dataType: { //参数类型
            type: String,
            required: true
        },
        required: { //是否必填
            type: Boolean
        },
        description: { //参数描述
            type: String,
        },
        frequency: {
            type: Number,
            default: 1
        },
    }, { timestamps: true });

    return mongoose.model("docs_params", docsParamsSchema);
};