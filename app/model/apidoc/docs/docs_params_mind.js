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
        mindRequestParams: { //联想参数
            type: Array
        },
        mindResponseParams: { //联想参数
            type: Array
        },
    }, { timestamps: true });

    return mongoose.model("docs_params_mind", docsParamsMindSchema);
};