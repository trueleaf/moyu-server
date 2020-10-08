/** 
    @description  项目类型枚举
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ProjectSchema = new Schema({
        projectTypeName: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 30
        },
        remark: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 255
        },
    }, {
        timestamps: true,
    });
    return mongoose.model("project_type_enum", ProjectSchema);
};
