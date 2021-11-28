
/** 
    @description  项目相关service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");


class ProjectService extends Service {
    /** 
        @description  获取项目列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String?}           projectName 项目名称 
        @param {String?}           projectType<?String>   项目类型    @remark 不传获取全部类型，可以多选类型
        @return       null
    */

    async getProjectList(params) {
        const { pageNum, pageSize, startTime, endTime, projectName, projectType } = params;
        const query = {};
        query.enabled = true;
        let skipNum = 0;
        let limit = 100;
        //基础查询
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $$gt: startTime, $$lt: endTime };
        }
        if (projectName != null) {
            query.projectName = new RegExp(projectName, "ig");
        }
        if (projectType != null) {
            query.projectType = { $in: projectType.split(",") };
        }
        query.$or = [
            {
                "members.userId": this.ctx.userInfo.id
            }
        ];
        const userInfo = this.ctx.userInfo;
        const visitAndStar = await this.ctx.model.Security.User.findOne({ _id: userInfo.id }, { recentVisitProjects: 1, starProjects: 1 }).lean();
        const result = {};
        result.list = await this.ctx.model.Apidoc.Project.Project.find(query, { enabled: 0, createdAt: 0 }).skip(skipNum).limit(limit).sort({ updatedAt: -1 });
        result.recentVisitProjects = visitAndStar.recentVisitProjects || [];
        result.starProjects = visitAndStar.starProjects || [];
        return result;
    }

    /**
        @description   获取项目基本信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 项目id 
        @return       null
    */
    async getProjectInfo(params) {
        const { _id } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(_id);
        const result = await this.ctx.model.Apidoc.Project.Project.findById(
            { _id, enabled: true },
            { createdAt: 0, updatedAt: 0, apidocs: 0, enabled: 0 }
        );
        return result;
    }
    /**
        @description   获取项目成员信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 项目id 
        @return       null
    */
    async getProjectMembers(params) {
        const { _id } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(_id);
        const result = await this.ctx.model.Apidoc.Project.Project.findById(
            { _id, enabled: true },
            { members: 1 }
        );
        return result.members;
    }

    /**
        @description   获取项目完整信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 项目id 
        @return       null
    */
    async getProjectFullInfo(params, ignorePermission) {
        const { _id } = params;
        const result = {};
        if (!ignorePermission) {
            await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(_id);
        }
        const mindParams = await this.ctx.service.apidoc.docs.docsParamsMind.geMindParams({ projectId: _id });
        const paramsTemplate = await this.ctx.service.apidoc.docs.docsParamsPreset.getPresetParamsEnum({ projectId: _id })
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList({ projectId: _id });
        const variables = await this.ctx.service.apidoc.project.projectVariable.getProjectVariableEnum({ projectId: _id });
        const rules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById({ projectId: _id });
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findById(
            {   
                _id,
                enabled: true 
            },
            {
                projectName: 1,
            },
        );
        result.mindParams = mindParams;
        result.projectName = projectInfo.projectName;
        result._id = projectInfo._id;
        result.paramsTemplate = paramsTemplate;
        result.hosts = hosts;
        result.variables = variables;
        result.rules = rules;
        return result;
    }
    


    /** 
        @description  获取项目列表枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getProjectEnum() {
        const query = {
            enabled: true
        };
        //是否为创建者或者为成员
        query.$or = [
            {
                "members.userId": this.ctx.userInfo.id
            }
        ];
        const limit = 100;
        const result = await this.ctx.model.Apidoc.Project.Project.find(query, { projectName: 1 }).limit(limit);
        return result;
    }

    /** 
        @description  新增项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            name 名称
        @param {String?}           projectType 项目类型(废弃)
        @param {String}            renark 备注
        @param {Array<Object>}     members 成员 
        @return       null
    */

    async addProject(params) {
        const { projectName, remark, members } = params;
        const doc = {};
        doc.projectName = projectName;
        doc.remark = remark;
        doc.members = members;
        //创建者默认为管理员
        doc.members.unshift({
            loginName: this.ctx.userInfo.loginName,
            realName: this.ctx.userInfo.realName,
            userId: this.ctx.userInfo.id,
            permission: "admin"
        });
        doc.owner = {
            id: this.ctx.userInfo.id,
            name: this.ctx.userInfo.realName || this.ctx.userInfo.loginName
        };
        const result = await this.ctx.model.Apidoc.Project.Project.create(doc);
        const allUsers = members.map(v => v.userId).concat([this.ctx.userInfo.id]);
        const uniqueUsers = Array.from(new Set(allUsers));
        await this.ctx.model.Security.User.updateMany({ _id: { $in: uniqueUsers } }, { $push: { couldVisitProjects: result._id.toString() } });
        return result._id;
    }

    /** 
        @description  删除项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids 项目id数组
        @return       null
    */

    async deleteProject(params) {
        const { ids } = params;
        for(let i = 0; i < ids.length; i ++) {
            await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(ids[i]);
        }
        const result = await this.ctx.model.Apidoc.Project.Project.update(
            { _id: { $in: ids }}, 
            { $set: { enabled: false }}
        );
        //同时删除每个用户可访问项目
        const delProjects = await this.ctx.model.Apidoc.Project.Project.find({ _id: { $in: ids }}, { members: 1 });
        const members = []
        delProjects.forEach(projectInfo => {
            projectInfo.members.forEach(member => {
                members.push(member.userId)
            })
        })
        await this.ctx.model.Security.User.updateMany({ _id: { $in: members } }, { $pull: { couldVisitProjects: { $in: ids } } });
        return result;
    }
    /** 
        @description  修改项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      id 项目id
        @param {String}      projectName 项目名称
        @param {String}      projectType 项目类型
        @param {String}      remark 项目备注
        @return       null
    */
    async editProject(params) { 
        const { _id, projectName, projectType, remark } = params;
        const updateDoc = {};
        if (projectName) {
            updateDoc.projectName = projectName; 
        }
        if (projectType) {
            updateDoc.projectType = projectType; 
        }
        if (remark) {
            updateDoc.remark = remark; 
        }
        //是否拥有权限
        const query = {
            _id,
        };
        query.$or = [
            {
                members: { 
                    $elemMatch: {
                        userId: this.ctx.userInfo.id,
                        permission: "admin",
                    }
                }
            }
        ];
        const hasPermission = await this.ctx.model.Apidoc.Project.Project.findOne(query);
        if (!hasPermission) {
            this.ctx.helper.throwCustomError("暂无权限", 4002);
        } 

        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }

    /** 
        @description  检查在线项目密码是否匹配
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async checkOnlineProjectPassword(params) { 
        const { shareId, password } = params;
        const projectShare = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ shareId }).lean();
        if (!projectShare) {
            this.ctx.helper.throwCustomError("文档不存在", 101003);
        }
        const projectPassword = projectShare.password;
        const expire = projectShare.expire;
        const nowTime = Date.now();
        const isExpire = nowTime > expire;
        const hasPassword = projectPassword != null && projectPassword !== "";
        const passwordIsEqual = password === projectPassword;
        if (hasPassword && !passwordIsEqual) { //密码错误
            this.ctx.helper.throwCustomError("密码错误", 101001);
        }  else if (isExpire) { //文档过期
            this.ctx.helper.throwCustomError("文档已过期", 101002);
        } else if ((hasPassword && passwordIsEqual && !isExpire) || (!hasPassword && !isExpire)) {
            return true;
        } else {
            this.ctx.helper.throwCustomError("文档错误", 101003);
        }
    }    

    //检查密码是否正确
    async checkPassword(params) {
        const { expire, password, projectPassword } = params;
        const nowTime = Date.now();
        const isExpire = nowTime > expire;
        const hasPassword = projectPassword != null && projectPassword !== "";
        const passwordIsEqual = password === projectPassword;
        if ((hasPassword && passwordIsEqual && !isExpire) || (!hasPassword && !isExpire)) { //密码正确并且没有过期
            return true;
        }
        return false;
    }
    /** 
        @description  获取分享项目banner信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getShareBanner(params) { 
        const sharedProjectInfo = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ shareId: params.shareId }).lean();
        if (!sharedProjectInfo) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const checkParams = {
            expire: sharedProjectInfo.expire,
            password:  params.password,
            projectPassword: sharedProjectInfo.password,
        };
        const valid = await this.ctx.service.apidoc.project.project.checkPassword(checkParams);
        if (!valid) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const result = await this.ctx.service.apidoc.docs.docs.getDocTreeNode({ projectId: sharedProjectInfo.projectId }, true);

        return result;
    }    
    /** 
        @description  获取分享项目基本信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getSharedProjectInfo(params) { 
        const sharedProjectInfo = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ shareId: params.shareId }).lean();
        if (!sharedProjectInfo) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const checkParams = {
            expire: sharedProjectInfo.expire,
            password:  params.password,
            projectPassword: sharedProjectInfo.password,
        };
        const valid = await this.ctx.service.apidoc.project.project.checkPassword(checkParams);
        if (!valid) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const result = await this.ctx.service.apidoc.project.project.getProjectFullInfo({ _id: sharedProjectInfo.projectId }, true);
        return result;
    }  
    /** 
        @description  获取分享文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 文档id
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getSharedDocDetail(params) { 
        const sharedProjectInfo = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ shareId: params.shareId }).lean();
        if (!sharedProjectInfo) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const checkParams = {
            expire: sharedProjectInfo.expire,
            password:  params.password,
            projectPassword: sharedProjectInfo.password,
        };
        const valid = await this.ctx.service.apidoc.project.project.checkPassword(checkParams);
        if (!valid) {
            this.ctx.helper.throwCustomError("无效的的id和密码", 101005);
        }
        const result = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id: params._id }, { pid: 0, isFolder: 0, sort: 0, enabled: 0 });
        return result;
    }  

    /** 
     * @description        获取在线链接基本信息
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    shareId 分享链接id
     * @return {String}    返回在线链接基本信息
     */
     async getOnlineProjectInfo(params) { 
        const { shareId } = params;
        const result = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ shareId, enabled: true }, { projectName: 1, shareName: 1, expire: 1, password: 1 }).lean();
        if (!result) {
            this.ctx.helper.throwCustomError("文档不存在", 101003);
        }
        return {
            projectName: result.projectName,
            shareName: result.shareName,
            expire: result.expire,
            needPassword: !!result.password,
        };
    }
    /** 
        @description  导入生成项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      projectName 项目名称
        @param {Object}       moyuData 文档信息
        @return       null
    */
    async importAsProject(params) { 
        const { projectName, moyuData } = params;
        const project = {};
        project.projectName = projectName;
        project.docNum = moyuData.docs.length;
        project.owner = {
            id: this.ctx.userInfo.id,
            name: this.ctx.userInfo.realName || this.ctx.userInfo.loginName
        };
        project.members = [{
            userId: this.ctx.userInfo.id,
            loginName: this.ctx.userInfo.realName || this.ctx.userInfo.loginName,
            realName: this.ctx.userInfo.realName,
            permission: "admin",
        }];
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.create(project);
        const { docs = [], hosts = [] } = moyuData;
        const convertDocs = docs.map((docInfo) => {
            const newId = this.app.mongoose.Types.ObjectId()
            const oldId = docInfo._id.toString();
            docs.forEach(originDoc => {
                if (originDoc.pid === oldId) {
                    originDoc.pid = newId
                }
            })
            docInfo.projectId = projectInfo._id;
            docInfo._id = newId;
            return docInfo;
        })
        const convertHosts = hosts.map(host => {
            host._id = this.app.mongoose.Types.ObjectId();
            host.projectId = projectInfo._id;
            return host;
        })
        await this.ctx.model.Apidoc.Docs.DocsServices.create(convertHosts);
        await this.ctx.model.Apidoc.Docs.Docs.create(convertDocs)
        //添加历史记录
        const userInfo = this.ctx.userInfo;
        const record = {
            operation: "import",
            projectId: projectInfo._id,
            recordInfo: {
                importNum: moyuData.length,
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return {
            id: projectInfo._id,
            name: projectName
        };
    }
   /**
     * @description        项目新增用户
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     loginName - 登录名称
     * @param {String?}    realName - 真实名称
     * @param {Permission} permission - 权限
     * @param {String}     userId - 用户id
     * @param {String}     projectId - 项目id
     * @return {String}    返回字符串
     */
    async addUser(params) { 
        const { projectId, loginName, realName, permission, userId } = params;
        const userInfo = {
            loginName,
            realName,
            userId,
            permission,
        };
        //是否拥有权限
        const query = {
            _id: projectId,
        };
        query.$or = [
            {
                members: { 
                    $elemMatch: {
                        userId: this.ctx.userInfo.id,
                        permission: "admin",
                    }
                }
            }
        ];
        const hasPermission = await this.ctx.model.Apidoc.Project.Project.findOne(query);
        if (!hasPermission) {
            this.ctx.helper.throwCustomError("管理员才允许修改权限", 4002);
        } 
        await this.ctx.model.Security.User.updateOne({ _id: userId }, { $push: { couldVisitProjects: projectId } });
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, {
            $push: { members: userInfo }
        });
    }
    /**
     * @description        删除用户
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     projectId - 项目id
     * @param {String}     userId - 用户id
     * @return {String}    返回字符串
     */
    async deleteUser(params) { 
        const { projectId, userId } = params;
        const isDeleteSelf = userId === this.ctx.userInfo.id;
        //是否拥有权限
        const query = {
            _id: projectId,
        };
        query.$or = [
            {
                members: { 
                    $elemMatch: {
                        userId: this.ctx.userInfo.id,
                        permission: "admin",
                    }
                }
            }
        ];
        //是否为admin，只有admin拥有删除权限
        const hasPermission = await this.ctx.model.Apidoc.Project.Project.findOne(query);
        if (!hasPermission && !isDeleteSelf) {
            this.ctx.helper.throwCustomError("管理员才允许删除用户", 4002);
        } 
        //一个团队至少保留一个管理员
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId }, { members: 1 });
        const members = projectInfo.members;
        const hasAdmin = members.find((memberInfo) => {
            if (memberInfo.userId !== userId && memberInfo.permission === "admin") {
                return true
            }
            return false;
        });
        if (!hasAdmin) {
            this.ctx.helper.throwCustomError("一个团队至少保留一个管理员", 4002);
        }
        await this.ctx.model.Security.User.updateOne({ _id: userId }, { $pull: { couldVisitProjects: projectId } });
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, {
            $pull: {
                members: { userId },
            }
        });
        return;
    }
    /**
     * @description        更新用户权限
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     projectId - 项目id
     * @param {String}     userId - 用户id
     * @param {Permission} permission - 权限
     * @return {String}    返回字符串
     */
    async changePermission(params) { 
        const { projectId, userId, permission } = params;
        //是否拥有权限
        const query = {
            _id: projectId,
        };
        query.$or = [
            {
                members: { 
                    $elemMatch: {
                        userId: this.ctx.userInfo.id,
                        permission: "admin",
                    }
                }
            }
        ];
        const hasPermission = await this.ctx.model.Apidoc.Project.Project.findOne(query);
        if (!hasPermission) {
            this.ctx.helper.throwCustomError("管理员才允许修改权限", 4002);
        } 
        //一个团队至少保留一个管理员
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId }, { members: 1 });
        const members = projectInfo.members;
        const hasAdmin = members.find((memberInfo) => {
            if (permission === "admin") {
                return true;
            }
            if (memberInfo.userId !== userId && memberInfo.permission === "admin") {
                return true
            }
            return false;
        });
        if (!hasAdmin) {
            this.ctx.helper.throwCustomError("一个团队至少保留一个管理员", 4002);
        }
        await this.ctx.model.Apidoc.Project.Project.updateOne({ _id: projectId, "members.userId": userId }, {
            $set: { "members.$.permission": permission }
        });
    }

    /**
     * @description        根据url搜索项目
     * @author             shuxiaokai
     * @create             2021-11-25 22:56
     * @param {String}     url - 接口url
     * @return {String}    项目列表
     */
     async getProjectByUrl(params) { 
        const { url } = params;
        const userId = this.ctx.userInfo.id;
        const userInfo = await this.ctx.model.Security.User.findOne({ _id: userId }, { couldVisitProjects: 1 });
        const docs = await this.ctx.model.Apidoc.Docs.Docs.find({
            projectId: { $in: userInfo.couldVisitProjects },
            "item.url.path": new RegExp(escapeStringRegexp(url))
        }, {
            "info.name": 1,
            "item.url.path": 1,
            "item.method": 1,
            projectId: 1,
        }).lean();
        const result = docs.map(v => {
            return {
                projectId: v.projectId,
                path: v.item.url.path,
                name: v.info.name,
                method: v.item.method,
            }

        })
        return result
    }
}

module.exports = ProjectService;