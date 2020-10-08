
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
    const docsPresetParamsSchema = new Schema({
        name: { //请求名称
            type: String
        },
        creatorName: { //创建者名称
            type: String
        },
        presetParamsType: { //参数类型， header request response
            type: String
        },
        items: [
            {
                key: {
                    type: String,
                    trim: true,
                },
                value: {
                    type: String,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
                type: {
                    type: String,
                    trim: true
                },
                required: {
                    type: Boolean
                },
                children: {
                    type: Array
                }              
            }
        ],
        projectId: { //项目名称
            type: String
        }
    }, { timestamps: true });
    return mongoose.model("docs_params_preset", docsPresetParamsSchema);
};