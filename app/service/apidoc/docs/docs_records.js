/**
    @description  文档修改历史记录service
    @author        shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;
const crypto = require("crypto");


class docsRecordsService extends Service {
    /**
        @description  新增文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            docId 文档id
        @param {String}            docInfo 文档详情
        @return       null
    */

    async addDocsRecords(params) {
        const { docId, docInfo } = params;
        const oldDoc = await this.ctx.model.Apidoc.Docs.DocsRecords.findOne({ docId }).lean();
        if (oldDoc && oldDoc.records) {
            const oldHash = crypto.createHash("md5")
            const newHash = crypto.createHash("md5");
            newHash.update(JSON.stringify(docInfo.item));
            oldHash.update(JSON.stringify(oldDoc.records[oldDoc.records.length - 1].item));
            const oldHex = oldHash.digest("hex");
            const newHex = newHash.digest("hex");
            if (oldHex === newHex) { //只有发生改变才会保存
                return;
            }
        }
        docInfo.creator = this.ctx.userInfo.realName;
        docInfo.createTime = new Date();
        await this.ctx.model.Apidoc.Docs.DocsRecords.findOneAndUpdate({ docId }, {
            $push: {
                records: docInfo
            }
        }, { upsert: true });
        return;
    }

    /**
        @description  删除文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids id数组
        @return       null
    */

    async deleteDocsRecords(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsRecords.deleteMany({ _id: { $in: ids }});
        return result;
    }
    /**
        @description  获取文档修改历史记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}            docId 文档id
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getDocsRecordsList(params) {
        const { docId } = params;
        const doc = await this.ctx.model.Apidoc.Docs.DocsRecords.findOne({ docId }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (doc) {
            const result = doc.records.reverse().slice(0, 10);
            return result;
        }
        return [];
    }
}

module.exports = docsRecordsService;