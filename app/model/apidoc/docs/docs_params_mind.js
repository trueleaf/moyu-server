/** 
    @description  文档参数输入联想
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/



module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    //接口参数模型
    const ProperytySchema = new Schema({
        _id: {
            type: String,
        },
        key: { //字段名称
            type: String,
            trim: true,
        },
        type: { //字段类型
            type: String,
            trim: true,
            enum: ["string", "number", "boolean", "array", "object", "file"]
        },
        description: { //字段描述
            type: String,
            trim: true,
        },
        value: { //字段值
            type: String,
        },
        required: { //是否必填
            type: Boolean
        },
        children: [], //嵌套字段
        _select: { //业务参数，是否选中
            type: Boolean,
            default: true
        }
    });
    const docsParamsMindSchema = new Schema({
        projectId: { //项目id
            type: String
        },
        paths: { //路径参数
            type: [ProperytySchema],
            default: []
        },
        queryParams: { //查询字符串
            type: [ProperytySchema],
            default: []
        },
        requestBody: { //请求body
            type: [ProperytySchema],
            default: []
        },
        responseParams: { //返回参数
            type: [ProperytySchema],
            default: []
        },
    }, { timestamps: true });

    return mongoose.model("docs_params_mind", docsParamsMindSchema);
};