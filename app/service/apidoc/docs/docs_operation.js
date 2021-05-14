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
     * @description        导出为html
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsHTML(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
        const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params)
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
                _id: { $in: selectedNodes }
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
            }).lean();
        }
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
        file = file.replace(/window.IS_OFFLINE = null/, `window.IS_OFFLINE = true`);
        file = file.replace(/<title>[^<]*<\/title>/, `<title>${projectInfo.projectName}<\/title>`);
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.html`)}`);

        //添加历史记录
        const userInfo = this.ctx.session.userInfo;
        const record = {
            operation: "export", //导出为html
            projectId,
            recordInfo: {
                exportType: "html"
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return file;
    }

    /** 
     * @description        导出为摸鱼文档
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsMoyuDoc(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const userInfo = this.ctx.session.userInfo;
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
        const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params);
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
                _id: { $in: selectedNodes }
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
            }).lean();
        }
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
        
        //添加历史记录
        const record = {
            operation: "export", //导出为moyu
            projectId,
            recordInfo: {
                exportType: "moyu"
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
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
        const { docs = [], hosts = [] } = moyuData;
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
        //文档导入
        const userInfo = this.ctx.session.userInfo;
        const record = {
            operation: "import",
            projectId,
            recordInfo: {
                importNum: docs.length,
                importIsCover: cover
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return;
    }

    /** 
     * @description        生成在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @param  {Array}     selectedDocs 被选择的需要导出的节点
     * @return {String}    返回在线链接
     */
    async exportAsOnlineDoc(params) { 
        const { projectId, password, maxAge = 86400000, selectedDocs = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const shareId = this.ctx.helper.uuid();
        let expire = Date.now();
        if (!maxAge || maxAge > 31536000 * 5) {
            expire += 31536000 * 5; //五年后过期
        } else {
            expire += maxAge
        }
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId }, { projectName: 1 }).lean();
        await this.ctx.model.Apidoc.Project.ProjectShare.findOneAndUpdate({ _id: projectId }, {
            $set: {
                shareId,
                projectId,
                projectName: projectInfo.projectName,
                password,
                expire,
                selectedDocs
            }
        }, {
            upsert: true,
        });
        //文档导出
        const userInfo = this.ctx.session.userInfo;
        const record = {
            operation: "export", //导出为online
            projectId,
            recordInfo: {
                exportType: "online"
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return shareId;
    }

     /** 
     * @description        fork项目中部分文档
     * @author             shuxiaokai
     * @create             2020-11-13 21:24
     * @param  {String}    sourceProjectId 源项目id
     * @param  {String}    targetProjectId 目标项目id
     * @param  {String}    targetMountedId 挂载点文档id
     * @param  {Number}    targetNodeSort 目标节点排序
     * @param  {Array}     selectedDocIds 被选择的需要导出的节点
     * @param  {String}    sourceRootId 源节点根元素id
     * @return {String}    返回字符串
     */
    async forkDocs(params) { 
        const { sourceProjectId, targetProjectId, targetMountedId, selectedDocIds, sourceRootId, targetNodeSort } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(sourceProjectId);
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(targetProjectId);

        const sourceDocs = await this.ctx.model.Apidoc.Docs.Docs.find({ _id: { $in: selectedDocIds }, projectId: sourceProjectId }).lean();
        const sourceRootDoc = sourceDocs.find(doc => doc._id.toString() === sourceRootId);
        sourceRootDoc.sort = targetNodeSort;
        sourceRootDoc.pid = targetMountedId || "";
        sourceDocs.forEach(doc => {
            const newId = this.app.mongoose.Types.ObjectId()
            const oldId = doc._id.toString();
            sourceDocs.forEach(originDoc => {
                if (originDoc.pid === oldId) {
                    originDoc.pid = newId
                }
            })
            doc._id = newId;
            doc.projectId = targetProjectId;
        })
        await this.ctx.model.Apidoc.Docs.Docs.insertMany(sourceDocs);
        //文档导出
        // const userInfo = this.ctx.session.userInfo;
        // const record = {
        //     operation: "export",
        //     projectId,
        //     recordInfo: {
        //         exportType: "fork"
        //     },
        //     operator: userInfo.realName || userInfo.loginName,
        // };
        // await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return sourceDocs;
    }


}

module.exports = docsOperationService;