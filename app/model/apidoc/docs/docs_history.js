
/** 
 * @description        文档历史记录
 * @author             shuxiaokai
 * @create             2020-07-25 11:25
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsHistorySchema = new Schema({
        projectId: { //项目id
            type: String 
        },
        docBaseInfo: { //文档基本信息适用于 新增文件夹  新增文档 拷贝文档  拷贝文件夹
            docId: { //文档id
                type: String 
            },
            name: { //文档或者文件夹名称
                type: String,
            },
        },
        operation: { //针对文档的操作,copy 拷贝文档，import 文档导入
            type: String,
            enum: ["addFolder", "addDoc", "copyDoc", "copyFolder", "deleteFolder", "deleteDoc", "deleteMany", "editDoc", "position", "import", "export", "rename", "addUser", "deleteUser", "changeUserPermission"]
        },
        operator: { //操作者
            type: String
        }
    }, { timestamps: true });
    return mongoose.model("docs_history", docsHistorySchema);
};