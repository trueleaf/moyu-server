/**
    @description  文档操作相关service
    @author        shuxiaokai
    @create       2021-03-01 13:57"
*/

const Service = require("egg").Service;
const fs = require("fs-extra");
const path = require("path")

class docsOperationService extends Service {
     /** 
     * @description        获取所有接口离线数据
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @return {String}    返回字符串
     */
    async getDocOfflineData(params) { 
        const { projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
        const docs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, enabled: true }).lean();
        const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params)
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.json`)}`);
        const result = {
            type: "moyu",
            info: {
                projectName: projectInfo.projectName,
            },
            rules: porjectRules,
            docs,
            hosts
        };
        let file = await fs.readFile(path.resolve(this.app.baseDir, "app/public/share-doc/index.html"), "utf-8");
        file = file.replace(/window.SHARE_DATA = null/, `window.SHARE_DATA = ${JSON.stringify(result)}`);
        file = file.replace(/window.PROJECT_ID = null/, `window.PROJECT_ID = "${projectId}"`);
        file = file.replace(/<title>[^<]*<\/title>/, `<title>${projectInfo.projectName}<\/title>`);
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.html`)}`);
        return file;
    }

    /** 
     * @description        导出为摸鱼文档
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @return {String}    返回字符串
     */
    async exportAsMoyuDoc(params) { 
        const { projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
        const docs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, enabled: true }).lean();
        const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params)
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.json`)}`);
        const result = {
            type: "moyu",
            info: {
                projectName: projectInfo.projectName,
            },
            rules: porjectRules,
            docs,
            hosts
        };
        result.docs.forEach(doc => {
            if (doc.isFolder) {
                delete doc.item;
            }
        })
        return JSON.stringify(result);
    }
    /**
     * @description        导入文档
     * @author             shuxiaokai
     * @create             2021-03-01 14:04
     * @param {any}        projectId - 项目id
     * @param {boolean}    cover - 是否覆盖原有数据
     * @param {moyu}       moyuData - 摸鱼接口文档类型数据
     * @return {String}    返回字符串
     */
    async importAsMoyuDoc(params) { 
        const { projectId, cover, moyuData = {} } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const { rules, docs, hosts } = moyuData;
        const convertDocs = docs.map((docInfo) => {
            const newId = this.app.mongoose.Types.ObjectId()
            const oldId = docInfo._id.toString();
            docs.forEach(originDoc => {
                if (originDoc.pid === oldId) {
                    originDoc.pid = newId
                }
            })
            docInfo.projectId = projectId;
            docInfo._id = newId;
            return docInfo;
        })
        const convertHosts = hosts.map(host => {
            host._id = this.app.mongoose.Types.ObjectId();
            host.projectId = projectId;
            return host;
        })
        if (cover) {
            await this.ctx.model.Apidoc.Docs.Docs.updateMany({ projectId }, { $set: { enabled: false } })
            await this.ctx.model.Apidoc.Docs.DocsServices.updateMany({ projectId }, { $set: { enabled: false } });
        }
        await this.ctx.model.Apidoc.Docs.DocsServices.create(convertHosts);
        await this.ctx.model.Apidoc.Docs.Docs.create(convertDocs)
        const docLen = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, isFolder: false, enabled: true }).countDocuments();
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }});
        return;
    }

    /** 
     * @description        生成在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @return {String}    返回在线链接
     */
    async exportAsOnlineDoc(params) { 
        const { projectId, password, maxAge } = params;
        const shareId = this.ctx.helper.uuid();
        let expire = Date.now();
        if (!maxAge || maxAge > 31536000 * 5) {
            expire += 31536000 * 5; //五年后过期
        } else {
            expire += maxAge
        }
        await this.ctx.model.Apidoc.Docs.DocsOnline.findOneAndUpdate({ projectId }, {
            $set: {
                shareId,
                projectId,
                password,
                expire,
            }
        }, {
            upsert: true,
        });
        return shareId;
    }
}

module.exports = docsOperationService;