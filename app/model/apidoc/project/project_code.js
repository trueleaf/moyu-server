/** 
    @description  生成代码model
    @author       shuxiaokai
    @create       2020-10-08 22:10
*/

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ProjectCodeSchema = new Schema({
        /**
         * 项目id
         */
        projectId: {
            type: String
        },
        /**
         * 代码名称
         */
        codeName: { 
            type: String,
        },
        /**
         * 备注信息
         */
        remark: {
            type: String,
        },
        /**
         * 代码内容
         */
        code: {
            type: String,
        },
        /**
         * 是否共享代码
         */
        isPublic: {
            type: Boolean,
            default: false,
        },
        /**
         * 创建者
         */
        creator: {
            type: String,
        },
        /**
         * 使能
         */
        enabled: {
            type: Boolean,
            default: true
        }

    }, { timestamps: true });

    return mongoose.model("project_code", ProjectCodeSchema);
};