/** 
    @description  文档参数输入联想
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/



module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsParamsMindSchema = new Schema({
        projectId: { //项目id
            type: String
        },
        mindParams: [{
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
            select: { //业务参数，是否选中
                type: Boolean,
                default: true
            },
            editor: { //最后一次编辑人
                type: String,
            },
            editorId: { //最后一次编辑人id
                type: String
            },
            paramsPosition: {
                type: String,
                enum: ["paths", "queryParams", "requestBody", "responseParams"]
            },
            enabled: {
                type: Boolean,
                default: true,
            }
        }]
    }, { timestamps: true });

    return mongoose.model("docs_params_mind", docsParamsMindSchema);
};