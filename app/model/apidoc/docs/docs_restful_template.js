/** 
    @description  restful模板模型
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/



module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const paramsSchema = new Schema({
        header: [
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
        ], //请求头
        requestParams: [
            {
                key: {
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
                value: {
                    type: String,
                },
                required: {
                    type: Boolean
                },
                children: {
                    type: Array
                }
            }
        ], //请求参数
        responseParams: [
            {
                key: {
                    type: String,
                    trim: true,
                },
                value: {
                    type: String,
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
        ], //返回参数
        otherParams: [
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
        ], //其他参数
    });

    const docsTemplateSchema = new Schema({
        getParams: [paramsSchema],
        postParams: [paramsSchema],
        putParams: [paramsSchema],
        delParams: [paramsSchema],
        projectId: { //项目id
            type: String
        },
        name: { //项目名称
            type: String,
        },
    }, { timestamps: true });
    return mongoose.model("docs_restful_template", docsTemplateSchema);
};