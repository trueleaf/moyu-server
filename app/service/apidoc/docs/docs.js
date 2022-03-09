
/** 
    @description  docs相关service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/
const ReadOnlyUrl = [
    {
        url: "/api/project/project_list",
        method: "get",
    },
    {
        url: "/api/project/project_info",
        method: "get"
    },
    {
        url: "/api/project/project_full_info",
        method: "get"
    },
    {
        url: "/api/project/project_members",
        method: "get"
    },
    {
        url: "/api/project/visited",
        method: "put"
    },
    {
        url: "/api/project/star",
        method: "put"
    },
    {
        url: "/api/project/unstar",
        method: "put"
    },
    {
        url: "/api/project/share_info",
        method: "get"
    },
    {
        url: "/api/project/share",
        method: "get"
    },
    {
        url: "/api/apidoc/project/project_rules",
        method: "get"
    },
    {
        url: "/api/project/doc_tree_node",
        method: "get"
    },
    {
        url: "/api/project/doc_tree_folder_node",
        method: "get"
    },
    {
        url: "/api/project/doc_detail",
        method: "get"
    },
    {
        url: "/api/project/doc_mock",
        method: "get"
    },
    {
        url: "/api/project/export/html",
        method: "post"
    },
    {
        url: "/api/project/export/moyu",
        method: "post"
    },
    {
        url: "/api/project/export/online",
        method: "post"
    },
    {
        url: "/api/docs/docs_history",
        method: "post"
    },
    {
        url: "/api/docs/docs_records",
        method: "get"
    },
    {
        url: "/api/docs/docs_history_operator_enum",
        method: "get"
    },
    {
        url: "/api/docs/docs_deleted_list",
        method: "get"
    },
    {
        url: "/api/project/project_variable",
        method: "get"
    },
    {
        url: "/api/project/project_variable_enum",
        method: "get"
    },
    {
        url: "/api/project/doc_preset_params_list",
        method: "get"
    },
    {
        url: "/api/project/doc_preset_params_enum",
        method: "get"
    },
    {
        url: "/api/project/doc_preset_params",
        method: "get"
    },
    {
        url: "/api/project/doc_service",
        method: "get"
    },
    {
        url: "/api/project/doc_service_info",
        method: "get"
    },
];


const Service = require("egg").Service;
const officegen = require("officegen");
const fs = require("fs-extra");
const xss = require("xss");
const escapeStringRegexp = require("escape-string-regexp");
class DocsService extends Service {
    /** 
     * @description        检查是否有权限操作接口
     * @author             shuxiaokai
     * @create             2021-01-13 11:10
     * @param {string}     projectId 项目id
     * @return {boolean}   true代表有权限 false代表无权限
     */
    async checkOperationDocPermission(projectId) {
        const userInfo = this.ctx.userInfo;
        const method = this.ctx.request.method.toLocaleLowerCase();
        const URL = this.ctx.request.URL;
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findById({ _id: projectId });
        if (!projectInfo) { //项目不存在
            this.ctx.helper.throwCustomError("暂无当前项目权限", 4002);
        }
        const accessUsers = projectInfo.members; //不是当前项目成员
        const currentUserPermission = accessUsers.find(user => user.userId === userInfo.id || user.id === userInfo.id);
        const accessableReadonlyUrl = ReadOnlyUrl.find(v => v.method === method && URL.pathname.startsWith(v.url))
        if (!currentUserPermission) {
            this.ctx.helper.throwCustomError("暂无当前项目权限", 4002);
        } 
        else if (currentUserPermission.permission === "readOnly" && !accessableReadonlyUrl) {
            this.ctx.helper.throwCustomError("暂无当前操作权限", 4002);
        }
    }
    /** 
        @description  新增空白文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}            name 文档名称
        @param {string}            type 文档类型 
        @param {string}            pid 父元素id
        @param {string}            projectId 项目id
        @return       null
    */
    async addEmptyDoc(params) {
        const { name, type, pid, projectId} = params;
        const userInfo = this.ctx.userInfo;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        if (pid) { //不允许在非folder类型文档下面插入文档
            const parentDoc = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id: pid });
            if (parentDoc.info.type !== "folder") {
                this.ctx.helper.throwCustomError("操作不被允许，文件下面不允许嵌套文件夹", 4001);
            }
        }
        const projectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById({ projectId });
        let defaultMethod = "GET";
        const enabledMethod = projectRules.requestMethods?.find(v => v.enabled);
        if (enabledMethod) {
            defaultMethod = enabledMethod.value.toUpperCase();
        }
        const doc = {
            pid,
            projectId,
            isFolder: type === "folder",
            sort: Date.now(),
            info: {
                name,
                type,
                creator: userInfo.realName || userInfo.loginName
            },
            item: {
                method: defaultMethod
            }
        }
        const result = await this.ctx.model.Apidoc.Docs.Docs.create(doc);
        const docLen = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, isFolder: false, enabled: true }).countDocuments();
        //=====================================添加历史记录====================================//
        const record = {
            operation: "addFolder", //添加文件夹
            projectId,
            recordInfo: {
                nodeName: name,
                nodeId: result._id,
            },
            operator: userInfo.realName || userInfo.loginName,
            operatorId: userInfo.id,
        };
        if (type !== "folder") {
            record.operation = "addDoc"; //添加文档
            await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }});
        }
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        //=========================================================================//
        return {
            _id: result._id,
            pid: result.pid,
            sort: result.sort,
            name: result.info.name,
            type: result.info.type,
            method: result.item.method,
            url: result.item.url ? result.item.url.path : "",
            maintainer: result.info.maintainer,
            updatedAt: result.updatedAt,
            isFolder: result.isFolder,
            children: result.children || [],
        };
    }
    /** 
        @description  修改文档名称
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}    _id 当前文档id      
        @param {String}    name 当前文档名称      
        @return       null
    */
    async changeDocName(params) { 
        const { _id, name, projectId } = params;
        const userInfo = this.ctx.userInfo;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const originDoc = await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id }, { $set: { "info.name": name }});
        //添加历史记录
        const record = {
            operation: "rename", //重命名
            projectId,
            recordInfo: {
                nodeName: name,
                nodeId: _id,
                orginNodeName: originDoc.info.name
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);

        return { _id };
    }
    /** 
        @description  修改文档在文档树中的位置
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 当前文档id
        @param {String}      pid 父文档id
        @param {String}      sort 排序
        @param {String}      projectId 项目id
        @param {Object}      dropInfo 项目id
                            -nodeName 
                            -nodeId 
                            -dropNodeName
                            -dropNodeId
                            -type,
        @return       null
    */
    async changeDocPosition(params) { 
        const { _id, pid, sort, projectId, dropInfo } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const userInfo = this.ctx.userInfo;
        const updateDoc = { $set: {}};
        let parentDoc = null;
        let isFolder = null;
        updateDoc.$set.pid = pid;
        updateDoc.$set.sort = sort;
        if (pid) {
            parentDoc = await this.ctx.model.Apidoc.Docs.Docs.findById({ _id: pid });
            isFolder = parentDoc.isFolder;
        }
        if (parentDoc && !isFolder) {
            this.ctx.helper.throwCustomError("操作不被允许，pid对应的父元素不是文件夹", 4001);
        }
        await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id }, updateDoc);
        //添加历史记录
        const record = {
            operation: "position", //改变位置信息
            projectId,
            recordInfo: {
                nodeName: dropInfo.nodeName,
                nodeId: dropInfo.nodeId,
                dropNodeId: dropInfo.dropNodeId,
                dropNodeName: dropInfo.dropNodeName,
                dropType: dropInfo.dropType,
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return;
    }

    /** 
        @description  更新文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {pbjectID}         _id 文档id
        @param {object}           info 接口基本信息 
        @param {object}           item 录入参数 
        @param {number}           spendTime 录入时长
        @param {string}           projectId 项目id 
        @return       null
    */
    async fillDoc(params) {
        const { _id, info, item, preRequest, afterRequest, projectId, spendTime = 0 } = params;
        const userInfo = this.ctx.userInfo;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const description = xss(info.description);
        const result = await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id }, { 
            $set: { 
                preRequest,
                afterRequest,
                item, 
                "info.description": description,
                "info.maintainer": userInfo.realName || userInfo.loginName,
                "info.tag": info.tag 
            },
            $inc: {
                "info.spendTime": spendTime
            }
        });
        //添加历史记录
        const record = {
            operation: "editDoc", //更新文档
            projectId,
            recordInfo: {
                nodeName: result.info.name,
                nodeId: _id,
                method: item.method,
                nodeSnapshot: item,
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return;
    }


    /** 
     * @description        拷贝一个节点
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-02-15 22:29
     * @update             2020-02-15 22:29
     * @param {String}     _id - 节点id    
     * @param {String}     projectId - 项目id    
     */

    async copyDoc(params) {
        const { _id, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const userInfo = this.ctx.userInfo;
        let doc = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id }).lean();
        doc.item.method = doc.item.method.toUpperCase();
        doc.info.name = "副本-" + doc.info.name;
        doc._id = this.app.mongoose.Types.ObjectId();
        doc.sort += 1;
        const result = await this.ctx.model.Apidoc.Docs.Docs.create(doc);
        if (!doc.isFolder) {
            await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: doc.projectId }, { $inc: { docNum: 1 }});
        }
         //添加历史记录
         const record = {
            operation: "copyDoc", //更新文档
            projectId,
            recordInfo: {
                url: doc.item.url.path,
                method: doc.item.method,
                nodeName: doc.info.name.replace(/^副本-/, ""),
                nodeId: _id,
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return {
            _id: result._id,
            pid: result.pid,
            sort: result.sort,
            isFolder: result.isFolder,
            updatedAt: result.updatedAt,
            type: result.info.type,
            name: result.info.name,
            maintainer: result.info.maintainer,
            method: result.item.method,
            url: result.item.url.path,
            children: [],
        };
    }
    /** 
        @description  删除文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {ObjectID}           _id 文档id
        @return       null
    */
    async deleteDoc(params) { 
        const { ids, projectId } = params;
        const userInfo = this.ctx.userInfo;
        const result = await this.ctx.model.Apidoc.Docs.Docs.updateMany({ 
            projectId,
            _id: { $in: ids }
        }, { 
            $set: { 
                enabled: false,
                "info.deletePerson": userInfo.realName || userInfo.loginName
            }
        }); //文档祖先包含删除元素，那么该文档也需要被删除
        const docLen = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, isFolder: false, enabled: true }).countDocuments();
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }}); //删除文档
        const deleteDocs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, _id: { $in: ids }});
        //添加历史记录
        const record = {
            operation: deleteDocs.length > 1 ? "deleteMany" : (deleteDocs[0].isFolder ? "deleteFolder" : "deleteDoc"),
            projectId,
            recordInfo: {
                deleteNodes: []
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        deleteDocs.forEach(val => {
            record.recordInfo.deleteNodes.push({
                nodeName: val.info.name,
                nodeId: val._id,
                isFolder: val.isFolder,
                method: val.item && val.item.method,
                url: val.item.url.path,
            });
        });
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return result;
    }
    /** 
        @description  粘贴挂载文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}        projectId 项目id
        @param {String?}       mountedId 挂载id
        @param {Array<Doc>}    docs 文档 
    */
    async pasteDocs(params) {
        const { projectId, docs, mountedId = "" } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const docIds = docs.map(v => v._id);
        const matchedDocs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, _id: { $in: docIds } }).lean();
        const idMap = [];
        //先重新绑定pid
        matchedDocs.forEach((docInfo) => {
            const newId = this.app.mongoose.Types.ObjectId();
            const oldId = docInfo._id.toString();
            const oldPid = docInfo.pid;
            docInfo.sort = Date.now();
            const mapInfo = {
                oldId,
                newId,
                oldPid,
            };
            matchedDocs.forEach((docInfo2) => {
                const pid2 = docInfo2.pid;
                if (pid2 === oldId) { //说明这个是子元素
                    docInfo2.pid = newId;
                    mapInfo.newPid = newId;
                }
            })
            const hasParent = matchedDocs.find((v) => v._id === docInfo.pid);
            if (!hasParent) {
                docInfo.pid = mountedId;
                mapInfo.newPid = mountedId;
            }
            idMap.push(mapInfo);
            docInfo._id = newId;
            docInfo.sort = Date.now();
        })
        await this.ctx.model.Apidoc.Docs.Docs.insertMany(matchedDocs);
        return idMap;
    }

    /** 
     * @description        新增多个文档
     * @author              shuxiaokai
     * @create             2020-07-20 15:36
     * @param {string}     projectId - 数字类型       
     * @return {String}    返回字符串
     */

    async addMultiDocs(params) {
        const { docs, projectId } = params;
        docs.forEach(val => {
            val._id = this.app.mongoose.Types.ObjectId();
        });
        docs.forEach(val => {
            val.projectId = projectId;
            if (val.pid) {
                const matchDoc = docs.find(doc => doc.uuid === val.pid);
                val.pid = matchDoc._id.toString();
            }
        });
        const resultDocs = await this.ctx.model.Apidoc.Docs.Docs.insertMany(docs);
        const docsLength = resultDocs.filter(val => !val.isFolder).length;
        await this.ctx.model.Apidoc.Project.Project.update({ _id: projectId }, { $inc: { docNum: docsLength }});
        const record = {
            operation: "import",
            projectId,
            docInfo: []
        };
        docs.forEach(val => {
            record.docInfo.push({
                docName: val.docName,
                isFolder: val.isFolder,
                method: val.item && val.item.methods,
                url: val.item && val.item.url && val.item.url.path,
            });
        });
        await this.ctx.service.apidoc.docs.docsHistory.addDocHistory(record);
        return;
    }
    /** 
        @description  获取文档结构树
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}          projectId 文档id
        @return       null
    */
    async getDocTreeNode(params, ignorePermission) { 
        const { projectId } = params;
        if (!ignorePermission) {
            await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        }
        const result = [];
        const docsInfo = await this.ctx.model.Apidoc.Docs.Docs.find({
            projectId: projectId,
            enabled: true
        }, {
            pid: 1,
            info: 1,
            "item.method": 1,
            "item.url": 1,
            isFolder: 1,
            sort: 1,
            updatedAt: 1,
        }).sort({
            isFolder: -1,
            sort: 1
        }).lean();
        const mapedData =  docsInfo.map(val => {
            if (val.isFolder) {
                return {
                    _id: val._id,
                    pid: val.pid,
                    sort: val.sort,
                    name: val.info.name,
                    type: val.info.type,
                    maintainer: val.info.maintainer,
                    updatedAt: val.updatedAt,
                    isFolder: val.isFolder,
                    children: val.children || [],
                };
            } else {
                return {
                    _id: val._id,
                    pid: val.pid,
                    sort: val.sort,
                    name: val.info.name,
                    type: val.info.type,
                    method: val.item.method,
                    url: val.item.url ? val.item.url.path : "",
                    maintainer: val.info.maintainer,
                    updatedAt: val.updatedAt,
                    isFolder: val.isFolder,
                    children: val.children || [],
                };                
            }
        })
        for (let i = 0; i < mapedData.length; i++) {
            const docInfo = mapedData[i];
            if (!docInfo.pid) { //根元素
                docInfo.children = [];
                result.push(docInfo);
            }
            const id = docInfo._id.toString();
            for (let j = 0; j < mapedData.length; j++) {
                if (id === mapedData[j].pid) { //项目中新增的数据使用标准id
                    if (docInfo.children == null) {
                        docInfo.children = [];
                    }
                    docInfo.children.push(mapedData[j]);
                }
            }
        }
        return result;
    }
    /** 
        @description  获取文档导航(仅获取文件夹信息，用于一个项目向另一个项目导入)
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @return       null
    */
    async getDocTreeFolderNode(params) { 
        const { projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = [];
        const docsInfo = await this.ctx.model.Apidoc.Docs.Docs.find({
            projectId: projectId,
            isFolder: true,
            enabled: true,
        }).sort({
            isFolder: -1,
            sort: 1
        }).lean();
        const mapedData =  docsInfo.map(val => {
            if (val.isFolder) {
                return {
                    _id: val._id,
                    pid: val.pid,
                    sort: val.sort,
                    name: val.info.name,
                    type: val.info.type,
                    maintainer: val.info.maintainer,
                    isFolder: val.isFolder,
                    children: val.children,
                };
            } else {
                return {
                    _id: val._id,
                    pid: val.pid,
                    sort: val.sort,
                    name: val.info.name,
                    type: val.info.type,
                    method: val.item.method,
                    maintainer: val.info.maintainer,
                    isFolder: val.isFolder,
                    children: val.children,
                };                
            }
        })
        for (let i = 0; i < mapedData.length; i++) {
            const docInfo = mapedData[i];
            if (!docInfo.pid) { //根元素
                docInfo.children = [];
                result.push(docInfo);
            }
            const id = docInfo._id.toString();
            for (let j = 0; j < mapedData.length; j++) {
                if (id === mapedData[j].pid) { //项目中新增的数据使用标准id
                    if (docInfo.children == null) {
                        docInfo.children = [];
                    }
                    docInfo.children.push(mapedData[j]);
                }
            }
        }
        return result;
    }


    /** 
        @description  获取文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           _id 文档id
        @param {string}           projectId 文档id
        @return       null
    */
    async getDocDetail(params) { 
        const { _id, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id }, { pid: 0, sort: 0, enabled: 0 }).lean();
        result.preRequest = result.preRequest ? result.preRequest : {
            raw: ""
        }
        result.afterRequest = result.afterRequest ? result.afterRequest : {
            raw: ""
        }
        return result;
    }
    /** 
        @description  根据url过滤文档信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {string}         projectId 项目id
        @param {string}         url 文档url
        @return       null
    */

    async filterDoc(params) { 
        const { projectId, url } = params;
        if (!url) {
            return [];
        }
        const searchName = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, "item.url.path": new RegExp(escapeStringRegexp(url), "i") }, { _id: 1, "info.name": 1 });
        const searchUrl = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, "info.name": new RegExp(escapeStringRegexp(url), "i") }, { _id: 1, "info.name": 1 });
        const searchCreator = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, "info.creator": new RegExp(escapeStringRegexp(url), "i") }, { _id: 1, "info.name": 1 });

        const result = [].concat(searchName, searchUrl, searchCreator).map(val => ({
            _id: val._id,
            name: val.info.name,
        }));
        return result;
    }
    /**
        @description  生成文件word
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            projectId 项目id
        @return       null
    */

    async convertDocToWord(params) { 
        const { projectId } = params;
        const docs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, isFolder: false, enabled: true });
        const docx = officegen("docx");
        
        docs.forEach(doc => {
            //添加标题
            let pObj = docx.createP({ align: "center" });
            pObj.addText(doc.docName, {
                font_size: 28,
                align: "center"
            });
            //添加请求方式
            pObj = docx.createP();
            pObj.addText("基本信息", {
                font_size: 16,
                color: "teal"
            });              
            //添加请求方式
            pObj = docx.createP();
            pObj.addText(`请求方式：${doc.item.methods}`, {
                font_size: 14,
            });  
            //添加请求路径
            pObj.addLineBreak();    
            pObj.addText(`请求路径：${doc.item.url.path}`, {
                font_size: 14,
            });  
            //添加备注
            pObj.addLineBreak();    
            pObj.addText(`备注：${doc.item.description}`, {
                font_size: 14,
            });   
            pObj.addLineBreak();

            //添加请求参数
            pObj.addText(`请求参数`, {
                font_size: 16,
                color: "teal"
            });   
            pObj = docx.createP({ backline: "E0E0E0" });
            const requestParams = this.ctx.helper.convertDocParams(doc.item.requestParams);
            pObj.addText(`${requestParams.str}`);
            //返回参数
            pObj = docx.createP();
            pObj.addText(`返回参数`, {
                font_size: 16,
                color: "teal"
            });   
            pObj = docx.createP({ backline: "E0E0E0" });
            const responseParams = this.ctx.helper.convertDocParams(doc.item.responseParams);
            pObj.addText(`${responseParams.str}`);

            // pObj = docx.createP();
            // pObj.addHorizontalLine();
            // pObj.addHorizontalLine();    
        });
        const writeStream = fs.createWriteStream("demo.docx");
        return new Promise((resolve, reject) => {
            writeStream.on("finish", () => {
                const fileName = "demo.docx";
                this.ctx.response.attachment(fileName);
                this.ctx.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                this.ctx.set("Content-disposition", `attachment; filename=${fileName}`);
                this.ctx.set("Access-Control-Expose-Headers", "Content-disposition");
                this.ctx.body = fs.createReadStream("demo.docx");
                // this.ctx.body = docs;
                resolve();
            });
            docx.on("error", err => {
                reject(err);
            });
            writeStream.on("error", err => {
                reject(err);
            });
            docx.generate(writeStream);
        });
    }
    /** 
        @description  发布文档
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}    _id 当前文档id      
        @return       null
    */

    async publishDoc(params) { 
        const { _id } = params;
        const publisher = this.ctx.userInfo.realName;
        
        const result = await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id }, { 
            $set: { publish: true },
            $push: {
                publishRecords: {
                    publisher,
                    time: new Date()
                }
            }
        });
        return result;
    }

    /**
        @description  获取mock文档数据
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}   _id 文档id
        @return       null
    */

    async getMockData(params) { 
        const { _id } = params;
        const doc = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id, enabled: true }).lean();
        const result = this.convertPlainParamsToTreeData(doc.item.responseParams);
        return result;
    }
    
    /** 
     * @description        mock数据转换
     * @author              shuxiaokai
     * @create             2020-09-01 16:01
     * @return {String}    返回字符串
     */

    convertPlainParamsToTreeData(plainData, jumpChecked) {
        const result = {};
        const foo = (plainData, result) => {
            for (let i = 0, len = plainData.length; i < len; i++) {
                if (jumpChecked && !plainData[i]._select) { //若请求参数未选中则不发送请求
                    continue;
                }
                const key = plainData[i].key.trim();
                const value = plainData[i].value;
                const type = plainData[i].type;
                const resultIsArray = Array.isArray(result);
                const isComplex = (type === "object" || type === "array");
                let arrTypeResultLength = 0; //数组类型值长度，用于数组里面嵌套对象时候对象取值
                if (!isComplex && (key === "" || value === "")) { //非复杂数据需要填写参数名称才可以显示
                    continue;
                }
                /*eslint-disable indent*/ 
                switch (type) {
                    case "number": //数字类型需要转换为数字，转换前所有值都为字符串
                        resultIsArray ? result.push(Number(value)) : result[key] = Number(value);
                        break;
                    case "boolean": //字符串类型不做处理
                        resultIsArray ? result.push(result[key] = (value === "true" ? true : false)) : (result[key] = (value === "true" ? true : false));
                        break;
                    case "object":
                        resultIsArray ? (arrTypeResultLength = result.push({})) : (result[key] = {});
                        if (plainData[i].children && plainData[i].children.length > 0) {
                            foo(plainData[i].children, resultIsArray ? (result[arrTypeResultLength - 1]) : result[key]);
                        }
                        break;
                    case "array":
                        result[key] = [];
                        if (plainData[i].children && plainData[i].children.length > 0) {
                            foo(plainData[i].children, result[key]);
                        }
                        break;
                    default: //字符串或其他类型类型不做处理
                        resultIsArray ? result.push(value) : (result[key] = value);
                        break;
                }
            }
        }
        foo(plainData, result);
        return result;
    }
    /**
        @description   获取文档回收站记录
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {string?}           url 请求url
        @param {string?}           docName 文档名称
        @param {array?}            operators 操作者
        @param {string}            projectId 项目id
        @return       null
    */
    async getDocDeletedList(params) {
        const { pageNum, pageSize, startTime, endTime, operators, projectId, url, docName } = params;
        const query = {
            enabled: false,
        };
        let skipNum = 0;
        let limit = 100;
        query.projectId = projectId;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.updatedAt = { $gt: startTime, $lt: endTime };
        }
        if (url) {
            query["item.url.path"] = new RegExp(escapeStringRegexp(url));
        }
        if (docName) {
            query["info.name"] = new RegExp(escapeStringRegexp(docName));
        }
        if (operators && operators.length > 0) {
            query["info.deletePerson"] = {
                $in: operators,
            };
        }
        const rows = await this.ctx.model.Apidoc.Docs.Docs.find(
            query,
            {
                "item.url": 1,
                "item.method": 1,
                "info.name": 1,
                "info.type": 1,
                "info.deletePerson": 1,
                "updatedAt": 1,
                pid: 1,
                isFolder: 1,
            }
        ).skip(skipNum).sort({ createdAt: -1 }).limit(limit);
        const total = await this.ctx.model.Apidoc.Docs.Docs.find(query).countDocuments();
        const result = {};
        result.rows = rows.map(data => {
            return {
                name: data.info.name,
                type: data.info.type,
                deletePerson: data.info.deletePerson,
                isFolder: data.isFolder,
                host: data.item.url.host,
                path: data.item.url.path,
                method: data.item.method,
                updatedAt: data.updatedAt,
                _id: data._id,
                pid: data.pid,
            };
        });
        result.total = total;
        return result;
    }
    /**
     * @description        恢复接口或文件夹
     * @author             shuxiaokai
     * @create             2021-05-24 14:27
     * @param {string}     _id 节点id
     * @param {string}     projectId 项目id
     * @param {Boolean}    restoreChildren 是否恢复子节点
     * @return {String}    返回字符串
     */
     async restroeNode(params) {
        const { _id, projectId, restoreChildren } = params;
        const updateIds = [];
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const allDocs = await this.ctx.model.Apidoc.Docs.Docs.find({
            projectId,
        }, { pid: 1, enabled: 1 }).lean();
        const startDoc = allDocs.find((val) => val._id.toString() === _id);
        let parentDoc = allDocs.find((val) => val._id.toString() === startDoc.pid);
        updateIds.push(startDoc._id.toString());
        while (parentDoc && !parentDoc.enabled) {
            updateIds.push(parentDoc._id.toString());
            parentDoc = allDocs.find((val) => val._id.toString() === parentDoc.pid);
        }
        await this.ctx.model.Apidoc.Docs.Docs.updateMany({ projectId, _id: { $in: updateIds } }, {
            $set: {
                enabled: true,
            },
        })
        return updateIds;
    }
}

module.exports = DocsService;