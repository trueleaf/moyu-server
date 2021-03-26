/** 
    @description  内置请求返回参数服务
    @author       shuxiaokai
    @create       2020/9/17 下午4:51:57
*/
const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");
class DocsInternalParamsService extends Service {
    /**
        @description    新增内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @param {string}        key 参数名称
        @param {string}        value 参数值
        @param {string}        description 参数描述
        @param {string}        type 参数类型
        @param {boolean}        required 是否必填
        @return    null
    */
    async createDocsInternalParams(params) {
        const {
            key,
            value,
            description,
            type,
            required,
        } = params;
        // 判断参数名称是否已经存在
        const hasKey = await this.ctx.model.Apidoc.DocsInternalParams.findOne({
            projectName,
            enabled: true
        });
        if (hasKey) {
            this.ctx.helper.throwCustomError("参数名称已经存在", 1003);
        }
        const doc = {};
        doc.key = key;
        doc.value = value;
        doc.description = description;
        doc.type = type;
        doc.required = required;
        await this.ctx.model.Apidoc.DocsInternalParams.create(doc);
        return;
    }
    /**
        @description    以列表形式获取内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @param {string?}        pageSize 每页数据大小
        @param {string?}        pageNum 当前页码
        @param {string?}        startTime 起始日期
        @param {string?}        endTime 结束日期
        @return    null
    */
    async readDocsInternalParamsList(params) {
        const {
            pageSize,
            pageNum,
            startTime,
            endTime,
        } = params;
        const query = {
            enabled: true,
        };
        let skipNum = 0;
        let limit = 100;
        if (pageSize != null && pageNum != null) {
            skipNum = (pageNum - 1) * pageSize;
            limit = pageSize;
        }
        if (startTime != null && endTime != null) {
            query.createdAt = {
                $gt: startTime,
                $lt: endTime
            };
        }
        const rows = await this.ctx.model.Apidoc.DocsInternalParams.find(query).skip(skipNum).limit(limit);
        const total = await this.ctx.model.Apidoc.DocsInternalParams.find(query).countDocuments();
        const result = {};
        result.rows = rows;
        result.total = total;
        return result;
    }
    /**
        @description    根据id获取内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @param {string}        _id 内置请求返回参数id
        @return    null
    */
    async readDocsInternalParamsById(params) {
        const {
            _id
        } = params;
        const result = await this.ctx.model.Apidoc.DocsInternalParams.findOne({
            _id,
            enabled: true
        });
        return result;
    }
    /**
        @description    以枚举形式获取内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @return    null
    */
    async readDocsInternalParamsEnum(params) {
        const limit = 100;
        const result = await this.ctx.model.Apidoc.DocsInternalParams.find({
            enabled: true
        }, {
            key: 1,
            value: 1,
        }).limit(limit);
        return result;
    }
    /**
        @description    修改内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @param {String}         _id 数据id
        @param {string?}        key 参数名称
        @param {string?}        value 参数值
        @param {string?}        description 参数描述
        @param {string?}        type 参数类型
        @param {boolean?}        required 是否必填
        @param {boolean?}        enabled 是否有效
        @return    null
    */
    async updateDocsInternalParams(params) {
        const {
            _id,
            key,
            value,
            description,
            type,
            required,
            enabled,
        } = params;
        const doc = {};
        doc._id = _id;
        doc.key = key;
        doc.value = value;
        doc.description = description;
        doc.type = type;
        doc.required = required;
        doc.enabled = enabled;
        // 判断参数名称是否已经存在
        const hasKey = await this.ctx.model.Apidoc.DocsInternalParams.findOne({
            _id: {
                $ne: _id
            },
            key
        });
        if (hasKey) {
            this.ctx.helper.throwCustomError("参数名称已经存在", 1003);
        }
        await this.ctx.model.Apidoc.DocsInternalParams.findByIdAndUpdate({
            _id
        }, doc);
        return;
    }
    /**
        @description    根据id删除内置请求返回参数
        @author         shuxiaokai
        @create         2020/9/17 下午4:51:57
        @param {string}        ids 内置请求返回参数id数组
        @return    null
    */
    async deleteDocsInternalParams(params) {
        const {
            ids
        } = params;
        const result = await this.ctx.model.Apidoc.DocsInternalParams.updateMany({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                enabled: false
            }
        });
        return result;
    }
}
module.exports = DocsInternalParamsService;