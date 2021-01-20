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
        @param {String}  paths 联想请求参数
        @param {String}  queryParams 联想返回参数
        @param {String}  requestBody 联想返回参数
        @param {String}  responseParams 联想返回参数
        @return       null
    */

    async addDocParamsMind(params) {
        const { projectId, paths, queryParams, requestBody, responseParams } = params;
        let result = null;
        const doc = {
            projectId,
            paths,
            queryParams,
            requestBody,
            responseParams
        };
        const savedDoc = await this.ctx.model.Apidoc.Docs.DocsParamsMind.findOne({ projectId: doc.projectId });
        if (savedDoc) {
            const oldPaths = savedDoc.paths;
            const oldQueryParams = savedDoc.queryParams;
            const oldRequestBody = savedDoc.requestBody;
            const oldResponseParams = savedDoc.responseParams;
            const newPaths = this.ctx.helper.unique([...paths, ...oldPaths], "key");
            const newQueryParams = this.ctx.helper.unique([...queryParams, ...oldQueryParams], "key");
            const newRequestBody = this.ctx.helper.unique([...requestBody, ...oldRequestBody], "key");
            const newResponseParams = this.ctx.helper.unique([...responseParams, ...oldResponseParams], "key");
            result = {
                paths: newPaths,
                queryParams: newQueryParams,
                requestBody: newRequestBody,
                responseParams: newResponseParams,
            }
            await this.ctx.model.Apidoc.Docs.DocsParamsMind.update({ projectId }, { $set: {
                paths: newPaths,
                queryParams: newQueryParams,
                requestBody: newRequestBody,
                responseParams: newResponseParams,
            }});
        } else {
            await this.ctx.model.Apidoc.Docs.DocsParamsMind.create(doc);
        }
        return result;
    }
    /**
        @description  获取文档参数联想
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {string}           projectId 项目id
        @return       null
    */
   
    async getDocParamsMindEnum(params) {
        const { projectId } = params;
        const result = await this.ctx.model.Apidoc.Docs.DocsParamsMind.findOne({ projectId }, {
            paths: 1,
            queryParams: 1,
            requestBody: 1,
            responseParams: 1,
            _id: 0
        });
        return result;
    }
}

module.exports = docParamsMindService;