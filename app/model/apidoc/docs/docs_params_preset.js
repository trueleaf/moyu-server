
/** 
    @description  公共请求参数信息，按照请求类型维护公共请求参数，比如：请求头大部分都会带上 content-type字段
    @author       shuxiaokai
    @create        2020-10-08 22:10
    @param       
    @return       null
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
    const docsPresetParamsSchema = new Schema({
        name: { //请求名称
            type: String
        },
        projectId: { //项目名称
            type: String
        },
        creatorName: { //创建者名称
            type: String
        },
        presetParamsType: { //参数类型， queryParams bodyParams responseParams
            type: String,
            enum: ["pathParams", "queryParams", "bodyParams", "responseParams", "headerParams"],
        },
        items: [ProperytySchema],
    }, { timestamps: true });
    return mongoose.model("docs_params_preset", docsPresetParamsSchema);
};