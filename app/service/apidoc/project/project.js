
/** 
    @description  项目相关service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Service = require("egg").Service;


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
        //是否为创建者或者为成员
        query.$or = [
            {
                "owner.id": this.ctx.session.userInfo.id
            },
            {
                "members.userId": this.ctx.session.userInfo.id
            }
        ];
        const userInfo = this.ctx.session.userInfo;
        const visitAndStar = await this.ctx.model.Security.User.findOne({ _id: userInfo.id }, { recentVisitProjects: 1, starProjects: 1 }).lean();
        const result = {};
        result.list = await this.ctx.model.Apidoc.Project.Project.find(query).skip(skipNum).limit(limit).sort({ updatedAt: -1 });;
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
        const result = await this.ctx.model.Apidoc.Project.Project.findById(
            { _id, enabled: true },
            { createdAt: 0, updatedAt: 0, apidocs: 0, enabled: 0 }
        );
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
                "owner.id": this.ctx.session.userInfo.id
            },
            {
                "members.userId": this.ctx.session.userInfo.id
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
        // 判断是否存在该类型
        // const hasName = await this.ctx.model.Apidoc.Project.Project.findOne({ projectName, enabled: true });
        // if (hasName) {
        //     const error = new Error("项目名称已经存在");
        //     error.code = 1003;
        //     throw error;
        // }
        const doc = {};
        doc.projectName = projectName;
        doc.remark = remark;
        doc.apidoc = [];
        doc.apiNum = 0;
        doc.members = members;
        doc.owner = {
            id: this.ctx.session.userInfo.id,
            name: this.ctx.session.userInfo.realName || this.ctx.session.userInfo.loginName
        };
        const result = await this.ctx.model.Apidoc.Project.Project.create(doc);
        return result._id;
    }

    /** 
        @description  删除项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids 项目id数组
        @return       null
    */

    async deleteProjectList(params) {
        const { ids } = params;
        const result = await this.ctx.model.Apidoc.Project.Project.update({ _id: { $in: ids }}, { $set: { enabled: false }});
        return result;
    }
    /** 
        @description  修改项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      id 项目id
        @param {String}      projectName 项目名称
        @param {String}      projectType 项目类型
        @param {Array}       members 成员信息
        @param {String}      remark 项目备注
        @return       null
    */
    async editProject(params) { 
        const { _id, projectName, members, projectType, remark } = params;
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
        if (members) {
            updateDoc.members = members; 
        }
        //项目名称是否重复
        const hasName = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: { $ne: _id }, projectName });
        if (hasName) {
            const error = new Error("项目名称重复");
            error.code = 1003;
            throw error;
        }
        //是否拥有权限
        const query = {
            _id,
        };
        query.$or = [
            {
                "owner.id": this.ctx.session.userInfo.id
            },
            {
                members: { 
                    $elemMatch: {
                        userId: this.ctx.session.userInfo.id,
                        permission: "admin",
                    }
                }
            }
        ];
        const hasPermission = await this.ctx.model.Apidoc.Project.Project.findOne(query);
        if (!hasPermission) {
            this.ctx.helper.errorInfo("暂无权限", 4002);
        } 
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /** 
        @description  根据分享id获取项目详情
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      projectId 项目id
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getOnlineProjectInfo(params) { 
        const { projectId, shareId, password } = params;
        const projectShare = await this.ctx.model.Apidoc.Project.ProjectShare.findOne({ projectId, shareId }).lean();
        const projectPassword = projectShare.password;
        const expire = projectShare.expire;
        const nowTime = Date.now();
        const isExpire = nowTime > expire;
        const hasPassword = projectPassword != null;
        const passwordIsEqual = password === projectPassword;
        let result = null;   
        if ((hasPassword && passwordIsEqual && !isExpire) || (!hasPassword && !isExpire)) {
            const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
            const docs = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, enabled: true }).lean();
            const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById({ projectId });
            const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList({ projectId })
            result = {
                type: "moyu",
                info: {
                    projectName: projectInfo.projectName,
                },
                rules: porjectRules,
                docs,
                hosts
            };
        } else if (hasPassword && !passwordIsEqual) { //密码错误
            this.ctx.helper.errorInfo("密码错误", 1006);
        } else if (isExpire) { //文档过期
            this.ctx.helper.errorInfo("文档已过期", 1006);
        } 
        return result;
    }
}

module.exports = ProjectService;