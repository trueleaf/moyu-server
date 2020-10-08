/** 
 * @description        文档全局变量
 * @author             shuxiaokai
 * @create             2020-07-25 09:20
 */


module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const projectVariableSchema = new Schema({
        projectId: { //项目id
            type: String
        },
        name: { //变量名称
            type: String,
        },
        type: { //变量类型
            type: String,
            enum: ["string", "number", "boolean"]
        },
        value: { //变量值
            type: String,
        },
        creator: { //创建者信息
            type: String,
        }
    }, { timestamps: true });

    return mongoose.model("project_variable", projectVariableSchema);
};