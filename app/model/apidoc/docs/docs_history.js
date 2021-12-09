
/** 
 * @description        文档历史记录
 * @author             shuxiaokai
 * @create             2020-07-25 11:25
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const DeletedNode = Schema({
        nodeName: {
            type: String,
        },
        nodeId: {
            type: mongoose.ObjectId,
        },
        isFolder: {
            type: Boolean,
        },
        method: {
            type: String,
        },
        url: {
            type: String
        },
    })
    const docsHistorySchema = new Schema({
        projectId: { //项目id
            type: String 
        },
        recordInfo: { //操作基本信息
            nodeId: { //被操作节点id
                type: String,
            },
            nodeName: { //被操作节点名称
                type: String,
            },
            method: { //请求方法
                type: String
            },
            url: { //请求url
                type: String
            },
            nodeSnapshot: { //修改文档，节点保存期快照
                type: Object,
            },
            dropNodeId: { //文档位置改变，相对节点id
                type: String,
            },
            dropNodeName: { //文档位置改变，相对节点名称
                type: String,
            },
            dropType: { //文档位置改变，drop方式，before，after，inner
                type: String,
            },
            orginNodeName: { //原始节点名称,适用于修改文档名称
                type: String,
            },
            deleteNodes: [DeletedNode], //被删除节点信息
            exportType: { //导出文档，导出类型
                type: String,
            },
            importNum: { //导入文档数量
                type: Number,
            },
            importIsCover: { //是否是覆盖导入
                type: Boolean,
            },
        },
        operation: { //针对文档的操作,copy 拷贝文档，import 文档导入
            type: String,
            enum: ["addFolder", "addDoc", "copyDoc", "copyFolder", "deleteFolder", "deleteDoc", "deleteMany", "editDoc", "position",  "rename", "import", "export", "addServer", "deleteServer", "editServer"]
        },
        operator: { //操作者
            type: String
        },
        operatorId: { //操作者id
            type: String
        },
    }, { timestamps: true });
    return mongoose.model("docs_history", docsHistorySchema);
};