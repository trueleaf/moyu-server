/**
    @description  获取公共请求头
    @author       shuxiaokai
    @create       2022-02-11 22:46"
*/

const Service = require("egg").Service;

class ProjectCodeService extends Service {

    /**
     * 修改公共请求头
     */
    async editProjectCommonHeader(params) { 
        const { commonHeaders, projectId, id  } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id: id }, {
            $set: {
                commonHeaders
            }
        });
        return;
    }
    /**
     * 获取公共请求头
     */
    async getProjectCommonHeaders(params) {
        const { projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = [];
        const docsInfo = await this.ctx.model.Apidoc.Docs.Docs.find({
            projectId: projectId,
            enabled: true,
        }, {
            pid: 1,
            info: 1,
            isFolder: 1,
            sort: 1,
            commonHeaders: 1,
            children: 1,
        }).sort({
            isFolder: -1,
            sort: 1
        }).lean();
        const mapedData =  docsInfo.map(val => {
            if (val.isFolder) {
                return {
                    _id: val._id,
                    pid: val.pid,
                    isFolder: val.isFolder,
                    commonHeaders: val.commonHeaders,
                    children: val.children || [],
                };
            } else {
                return {
                    _id: val._id,
                    pid: val.pid,
                    isFolder: val.isFolder,
                    commonHeaders: val.commonHeaders,
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
     * 根据id获取请求头数据
     */
    async getProjectCommonHeaderById(params) {
        const { id, projectId } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const result = await this.ctx.model.Apidoc.Docs.Docs.findOne({ _id: id }, { commonHeaders: 1 }).lean();
        console.log(result)
        return {
            _id: result._id,
            commonHeaders: result.commonHeaders.map(v => ({
                ...v,
                _id: this.app.mongoose.Types.ObjectId()
            }))
        };
    }
}

module.exports = ProjectCodeService;