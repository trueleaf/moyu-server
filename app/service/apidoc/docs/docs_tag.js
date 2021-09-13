/**
    @description  文档标签service
    @author        shuxiaokai
    @create       2021-05-07 13:35"
*/

const Service = require("egg").Service;

class DocsTagService extends Service {
    /**
        @description  新增文档标签
        @author        shuxiaokai
        @create       2021-05-07 11:18"
        @param {String}            projectId 项目id
        @param {String}            name 名称
        @param {String}            color 颜色
        @return       null
    */
    async addDocsTag(params) {
        const { projectId, name, color } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const hasTagName = await this.ctx.model.Apidoc.Docs.DocsTag.findOne({ projectId, name });
        if (hasTagName) {
            this.ctx.helper.throwCustomError("标签名称重复", 1003);
        }
        const userInfo = this.ctx.userInfo;
        const doc = {};
        doc.projectId = projectId;
        doc.name = name;
        doc.color = color;
        doc.creator = userInfo.realName || userInfo.loginName;
        doc.maintainer = userInfo.realName || userInfo.loginName;
        const result = await this.ctx.model.Apidoc.Docs.DocsTag.create(doc);
        return {
            name: result.name,
            color: result.color,
            _id: result._id,
        };
    }

    /**
        @description  修改文档标签
        @author        shuxiaokai
        @create       2019-10-06 22:44"
        @param {String}      _id 标签id
        @param {String}      name 名称
        @param {String}      color 颜色
        @param {String}      projectId 项目id
        @return       null
    */
    async editDocsTag(params) { 
        const { _id, name, projectId, color } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const updateDoc = {};
        if (name) {
            updateDoc.name = name; 
        }
        if (color) {
            updateDoc.color = color; 
        }
        const hasTagName = await this.ctx.model.Apidoc.Docs.DocsTag.findOne({ _id: { $ne: _id }, name });
        if (hasTagName) {
            this.ctx.helper.errorInfo("当前标签名称已存在", 1003);
        }
        const result = await this.ctx.model.Apidoc.Docs.DocsTag.findByIdAndUpdate({ _id }, updateDoc, { new: true });
        return {
            name: result.name,
            color: result.color,
            _id: result._id,
        };
    }
    /**
        @description  删除文档标签
        @author        shuxiaokai
        @create       2019-11-01 20:39"
        @param {String}         projectId 项目id
        @param {Array<String>}  ids 
        @return       null
    */
    async deleteDocsTag(params) {
        const { ids, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = await this.ctx.model.Apidoc.Docs.DocsTag.deleteMany({ _id: { $in: ids }});
        return result;
    }
    /**
        @description  获取文档标签
        @author        shuxiaokai
        @create       2019-11-01 20:40"
        @param {String}      projectId 项目id
        @return       null
    */
    async getDocsTagEnum(params) {
        const { projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        let limit = 100;
        const result = await this.ctx.model.Apidoc.Docs.DocsTag.find({
            projectId,
            enabled: true
        }, {
            name: 1,
            color: 1,
        }).limit(limit);
        return result;
    }
}

module.exports = DocsTagService;