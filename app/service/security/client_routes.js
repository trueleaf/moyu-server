/**
    @description  前端资源service
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;

class clientRoutesService extends Service {
    /**
        @description  新增前端资源
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            path 前端路由
        @params {String}            name 路由名称
        @params {String}            groupName 分组名称
        @return       null
    */

    async addClientRoutes(params) {
        const { name, path, groupName } = params;
        const doc = {};
        doc.name = name;
        doc.path = path;
        doc.groupName = groupName;

        const hasPath = await this.ctx.model.Security.ClientRoutes.findOne({ path });
        if (hasPath) {
            this.ctx.helper.throwCustomError("路由已经存在", 1003);
        }
        await this.ctx.model.Security.ClientRoutes.create(doc);
        return;
    }
    /**
        @description  批量新增前端资源
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            route 路由数组
        @return       null
    */

    async addMultiClientRoutes(params) {
        const { routes } = params;
        for (let i = 0; i < routes.length; i++) {
            const doc = {
                name: routes[i].name,
                path: routes[i].path,
                enabled: true
            };
            await this.ctx.model.Security.ClientRoutes.updateOne({ path: routes[i].path }, doc, { upsert: true });
        }
        return;
    }

    /**
        @description  修改前端路由
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {String}      name 路由名称 
        @params {String}      path 路由地址
        @params {String}      groupName 分组名称
        @return       null
    */

    async editClientRoutes(params) { 
        const { _id, name, path, groupName } = params;
        const updateDoc = {};
        if (name) {
            updateDoc.name = name; 
        }
        if (path) {
            updateDoc.path = path; 
        }
        if (groupName) {
            updateDoc.groupName = groupName; 
        }
        const hasPath = await this.ctx.model.Security.ClientRoutes.findOne({ _id: { $ne: _id }, path });
        if (hasPath) {
            this.ctx.helper.throwCustomError("路由已经存在", 1003);
        }
        await this.ctx.model.Security.ClientRoutes.findByIdAndUpdate({ _id }, updateDoc);
        return;
    }

    /**
        @description  批量前端路由分类
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      ids 路由id组
        @params {String}      groupName 分组名称
        @return       null
    */

    async editMultiClientRoutesType(params) { 
        const { ids, groupName } = params;
        await this.ctx.model.Security.ClientRoutes.updateMany({ _id: { $in: ids }}, { $set: { groupName }});
        return;
    }

    /**
        @description  删除前端资源
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}      ids id数组
        @return       null
    */

    async deleteClientRoutes(params) {
        const { ids } = params;
        await this.ctx.model.Security.ClientRoutes.updateMany({ _id: { $in: ids }}, { $set: { enabled: false }});
        return;
    }
    /**
        @description  获取前端资源
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */

    async getClientRoutesList(params) {
        const { pageNum, pageSize, startTime, endTime } = params;
        const query = {};
        let skipNum = 0;
        let limit = 100;
        query.enabled = true;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize; 
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = { $gt: startTime, $lt: endTime };
        }
        const rows = await this.ctx.model.Security.ClientRoutes.find(query, { _id: 1, path: 1, name: 1, groupName: 1 }).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Security.ClientRoutes.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }

    /**
        @description  获取前端资源(不分页)
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getClientRoutes() {
        const limit = 1000;
        const query = {};
        query.enabled = true;
        const result = await this.ctx.model.Security.ClientRoutes.find(query, { _id: 1, path: 1, name: 1, groupName: 1 }).limit(limit);
        return result;
    }
}

module.exports = clientRoutesService;