/**
    @description  字典(词库)service
    @author        shuxiaokai
    @create       2021-03-26 11:08"
*/

const Service = require("egg").Service;
const escapeStringRegexp = require("escape-string-regexp");

class dictionaryService extends Service {
	/**
        @description  新增字典(词典)
        @author        shuxiaokai
        @create       2021-03-26 11:03"
        @param {String}            cnName 中文名称
        @param {String}            enName 英文名称
        @param {String}            example 例子
        @param {String}            refer 参考链接
        @param {String}            remark 备注
        @param {String}            tags 标签信息
        @return       null
    */
	async addDictionary(params) {
		const { cnName, synonym, enName, example, refer, remark, tags } = params;
		const userInfo = this.ctx.session.userInfo;
		const doc = {};
		doc.cnName = cnName;
		doc.enName = enName;
		doc.example = example;
		doc.refer = refer;
		doc.synonym = synonym;
		doc.remark = this.ctx.helper.escape(remark);
		doc.tags = tags;
		doc.creator = userInfo.realName || userInfo.loginName;
		doc.maintainer = userInfo.realName || userInfo.loginName;
		const hasCnName = await this.ctx.model.Dictionary.Dictionary.findOne({
			$or: [{
				cnName
			}, {
				synonym: {
					$in: synonym
				}
			}] 
		});
		if (hasCnName) {
			this.ctx.helper.throwCustomError("中文名称已存在", 1003);
		}
		await this.ctx.model.Dictionary.Dictionary.create(doc);
	}

	/**
        @description  修改字典(词典)
        @author        shuxiaokai
        @create       2019-10-06 12:44"
        @param {String}      _id 词典id
        @param {String}      cnName 中文名称
        @param {String}      enName  英文名称
        @param {String}      synonym 同义词
        @param {String}      example 例子
        @param {String}      refer 标准参考连接
        @param {String}      remark 备注信息
        @param {String}      tags 标签信息
        @return       null
    */
	async editDictionary(params) { 
		const { _id, cnName, synonym, enName, example, refer, remark, tags } = params;
		const updateDoc = {};
		if (cnName) {
			updateDoc.cnName = cnName;
		}
		if (enName) {
			updateDoc.enName = enName;
		}
		if (example) {
			updateDoc.example = example;
		}
		if (refer) {
			updateDoc.refer = refer;
		}
		if (synonym && synonym.length > 0) {
			updateDoc.synonym = synonym;
		}
		if (remark) {
			updateDoc.remark = this.ctx.helper.escape(remark);
		}
		if (tags) {
			updateDoc.tags = tags;
		}
		const hasCnName = await this.ctx.model.Dictionary.Dictionary.findOne({
			_id: { $ne: _id },
			$or: [{
				cnName
			}, {
				synonym: {
					$in: synonym
				}
			}] 
		});
		if (hasCnName) {
			this.ctx.helper.throwCustomError("当前菜单名称已存在", 1003);
		}
		await this.ctx.model.Dictionary.Dictionary.findByIdAndUpdate({ _id }, updateDoc);
	}

	/**
        @description  删除字典(词库)
        @author        shuxiaokai
        @create       2019-10-06 12:44"
        @param {Array<String>}      ids id数组
        @return       null
    */
	async deleteDictionary(params) {
		const { ids } = params;
		console.log(ids);
		const result = await this.ctx.model.Dictionary.Dictionary.updateMany({ _id: { $in: ids } }, { $set: { enabled: false } });
		return result;
	}

	/**
        @description  获取字典(词典)列表
        @author        shuxiaokai
        @create       2019-11-01 10:40"
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {String?}           cnName 中文名称   
        @param {String?}           enName 英文名称   
        @param {String}            creator 创建者   
        @param {Array<String>?}    maintainers 维护者信息   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
	async getDictionaryList(params) {
		const { pageNum, pageSize, startTime, endTime, cnName, enName, creator, maintainers } = params;
		const query = {
			enabled: true
		};
		let skipNum = 0;
		let limit = 100;
		if (pageSize != null && pageNum != null) {
			skipNum = (pageNum - 1) * pageSize;
			limit = pageSize;
		}
		if (startTime != null && endTime != null) {
			query.createdAt = { gt: startTime, lt: endTime };
		}
		if (cnName) {
			query.cnName = new RegExp(escapeStringRegexp(cnName), "i");
		}
		if (enName) {
			query.enName = new RegExp(escapeStringRegexp(enName), "i");
		}
		if (creator) {
			query.creator = new RegExp(escapeStringRegexp(creator), "i");
		}
		if (maintainers && maintainers.length > 0) {
			query.maintainer = { $in: maintainers };
		}
		const rows = await this.ctx.model.Dictionary.Dictionary.find(query, { remark: 0 }).sort({ updatedAt: -1 }).skip(skipNum)
			.limit(limit);
		const total = await this.ctx.model.Dictionary.Dictionary.find(query).countDocuments();
		const result = {};
		result.rows = rows;
		result.total = total;
		return result;
	}

	/**
     * @description        根据id获取词汇详情
     * @author             shuxiaokai
     * @create             2021-04-13 10:20
     * @param {string}     id - 词汇id
     * @return {String}    返回字符串
     */
	async getDictionaryById(params) {
		const { id } = params;
		const query = {
			enabled: true,
			_id: id
		};
		const result = await this.ctx.model.Dictionary.Dictionary.findOne(query, { cnName: 1, remark: 1, synonym: 1, tags: 1 });
		return result;
	}
}

module.exports = dictionaryService;
