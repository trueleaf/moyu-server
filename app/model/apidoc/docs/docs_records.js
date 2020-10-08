
/** 
 * @description        文档修改历史记录
 * @author              shuxiaokai
 * @create             2020-09-04 13:09
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const docsRecordsSchema = new Schema({
        docId: { 
            type: String,
        },
        records: [
            {
                item: { //文档信息
                    type: Object
                },
                docName: { //文档名称
                    type: String
                },
                creator: { //创建者信息
                    type: String,
                },
                createTime: { //创建时间
                    type: String
                },
            }
        ]
    }, { timestamps: true });

    return mongoose.model("docs_records", docsRecordsSchema);
};