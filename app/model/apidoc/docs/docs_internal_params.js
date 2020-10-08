/**
    @description  内置请求返回参数模型
    @author       shuxiaokai
    @create       2020/9/17 下午5:04:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsInternalParamsSchema = new Schema({
        key: { //参数名称
            type: String,
            minlength: 0,
            maxlength: 255,
            required: true,
        },
        value: { //参数值
            type: String,
            minlength: 0,
            maxlength: 255,
            required: true,
        },
        description: { //参数描述
            type: String,
            minlength: 0,
            maxlength: 255,
            required: true,
        },
        type: { //参数类型
            type: String,
            minlength: 0,
            maxlength: 255,
            required: true,
        },
        required: { //是否必填
            type: Boolean,
            required: true,
        },
        enabled: { //是否有效
            type: Boolean,
            required: true,
        },
    }, {
        timestamps: true
    });
    return mongoose.model("docs_internal_params", docsInternalParamsSchema);
};