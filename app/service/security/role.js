/**
    @description  roleservice
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;

class roleService extends Service {
    /**
        @description  新增角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            roleName 角色名称
        @params {String}            clientRoutes 前端路由
        @params {String}            clientBanner 前端banner
        @params {String}            serverRoutes 服务端路由
        @params {String}            remark 备注
        @return       null
    */

    async addRole(params) {
        const { roleName, clientRoutes, clientBanner, serverRoutes, remark } = params;
        const doc = {};
        doc.roleName = roleName;
        doc.clientRoutes = clientRoutes;
        doc.clientBanner = clientBanner;
        doc.serverRoutes = serverRoutes;
        doc.remark = remark;
        const hasRole = await this.ctx.model.Security.Role.findOne({ roleName });
        if (hasRole) {
            this.ctx.helper.throwCustomError("角色名称已经存在", 1003);
        }
        await this.ctx.model.Security.Role.create(doc);
        return;
    }

    /**
        @description  修改角色
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      roleName 角色名称
        @params {String}      clientRoutes 前端路由
        @params {String}      clientBanner 前端banner(菜单)
        @params {String}      serverRoutes 服务端路由
        @params {String}      remark 备注
        @return       null
    */

    async editRole(params) { 
        const { _id, roleName, clientRoutes, clientBanner, serverRoutes, remark } = params;
        const updateDoc = {};
        updateDoc.roleName = roleName;
        updateDoc.clientRoutes = clientRoutes;
        updateDoc.clientBanner = clientBanner;
        updateDoc.serverRoutes = serverRoutes;
        updateDoc.remark = remark;
        await this.ctx.model.Security.Role.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }
    /**
        @description  删除role
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}      ids id数组
        @return       null
    */

    async deleteRole(params) {
        const { ids } = params;
        const result = await this.ctx.model.Security.Role.updateMany({ _id: { $in: ids }}, { $set: { enabled: false }});
        return result;
    }
    /**
        @description  获取role
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getRoleList(params) {
        const { pageNum, pageSize, startTime, endTime } = params;
        const query = { enabled: true };
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        const rows = await this.ctx.model.Security.Role.find(query, { clientRoutes: 0, clientBanner: 0, serverRoutes: 0 }).sort({ updatedAt: -1 }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Security.Role.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /**
        @description  获取角色枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getRoleEnum() {
        const limit = 200;
        const result = await this.ctx.model.Security.Role.find({ enabled: true }, { roleName: 1 }).limit(limit);
        return result;
    }

    /** 
     * @description        获取角色信息
     * @author              shuxiaokai
     * @create             2020-05-31 21:25
     * @param {String}     _id - 角色id       
     */

    async getRoleInfo(params) {
        const { _id } = params;
        const query = {
            _id,
            enabled: true
        };
        const result = await this.ctx.model.Security.Role.findOne(query, { createdAt: 0, updatedAt: 0, enabled: 0 });
        return result;
    }
}

module.exports = roleService;