/**
    @description  文档参数联想service
    @author        shuxiaokai
    @create        2020-10-08 22:10
*/

const Service = require("egg").Service;

class docParamsMindService extends Service {
    /**
        @description  新增参数联想
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {String}  projectId 项目id
        @param {Property}  mindParams 联想请求参数
        @return       null
    */

    async addMindParams(params) {
        const { projectId, mindParams } = params;
        let allParams = await this.ctx.model.Apidoc.Docs.DocsParamsMind.findOne({ projectId }).lean();
        if (!allParams) {
            allParams = mindParams;
        } else {
            allParams = allParams.mindParams.concat(mindParams);
        }
        const uniqueDocs = [];
        for(let i = 0; i < allParams.length; i ++) {
            if (uniqueDocs.find(v => (v.key === allParams[i].key && v.paramsPosition === allParams[i].paramsPosition))) {
                continue;
            }
            uniqueDocs.push(allParams[i]);
        }
        await this.ctx.model.Apidoc.Docs.DocsParamsMind.updateOne({ projectId }, { mindParams: uniqueDocs }, { upsert: true });
        return uniqueDocs;
    }
    /**
        @description  获取文档参数联想
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @return       null
    */
    async geMindParams(params) {
        const { projectId } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsParamsMind.findOne({ projectId });
        if (!result) {
            return [];
        }
        return result.mindParams.filter(v => v.enabled);
    }
    /**
        @description  批量删除联想参数
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @param {string[]}           ids 需要删除数据ids
        @return       null
    */
    async deleteMindParams(params) {
        const { projectId, ids } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsParamsMind.updateMany({ 
            projectId, 
            "mindParams._id": { $in: ids } 
        }, { 
            $set: { "mindParams.$[elem].enabled": false } 
        }, {
            arrayFilters: [{ "elem._id": { $in: ids } }]
        });
        return result;
    }
}

module.exports = docParamsMindService;