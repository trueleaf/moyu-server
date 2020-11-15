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
        @param {String}  mindRequestParams 联想请求参数
        @param {String}  mindResponseParams 联想返回参数
        @return       null
    */

    async addDocParamsMind(params) {
        const { projectId, mindRequestParams, mindResponseParams } = params;
        const doc = {
            projectId,
            mindRequestParams,
            mindResponseParams,
        };
      
        const savedDoc = await this.ctx.model.Apidoc.Docs.DocsParamsMind.findOne({ projectId: doc.projectId });
        if (savedDoc) {
            const oldReqParams = savedDoc.mindRequestParams;
            const oldResParams = savedDoc.mindResponseParams;
            const newReqParams = this.ctx.helper.unique([...mindRequestParams, ...oldReqParams], "key");
            const newResParams = this.ctx.helper.unique([...mindResponseParams, ...oldResParams], "key");


            // console.log(newReqParams, 22, newResParams)
            await this.ctx.model.Apidoc.Docs.DocsParamsMind.update({ projectId }, { $set: {
                mindRequestParams: newReqParams,
                mindResponseParams: newResParams,
            }});
        } else {
            await this.ctx.model.Apidoc.Docs.DocsParamsMind.create(doc);
        }
        return;
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
            "mindRequestParams.key": 1, 
            "mindRequestParams.description": 1,
            "mindRequestParams.value": 1,
            "mindRequestParams.type": 1,
            "mindResponseParams.key": 1,
            "mindResponseParams.description": 1,
            "mindResponseParams.value": 1,
            "mindResponseParams.type": 1,
        });
        return result || {
            mindRequestParams: [],
            mindResponseParams: []
        };
    }
}

module.exports = docParamsMindService;