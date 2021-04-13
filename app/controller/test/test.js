/**
    @description  test控制器
    @author        shuxiaokai
    @create       2021-04-12 15:17"
*/

const Controller = require("egg").Controller;

class testController extends Controller {
    async test() {
        try {
            const allDoc = await this.ctx.model.Apidoc.Docs.Docs.find({ enabled: true, projectId: "5ff1c8136110532cc8c6343c" }).lean();
            // const allDoc = await this.ctx.model.Apidoc.Docs.Docs.find({ enabled: true, _id: "60530e105f06a5580463031e" }).lean();
            
            // const docsLength = await this.ctx.model.Apidoc.Docs.Docs.countDocuments();
            for(let i = 0; i < allDoc.length; i ++) {
                const doc = allDoc[i];
                if (doc.type === "object") {
                    continue
                }
                const params = {
                    _id: Math.random(),
                    key: "",
                    type: "object",
                    description: "",
                    value: "",
                    required: true,
                    children: [],
                    _select: true,
                }
                params.children = JSON.parse(JSON.stringify(doc.item.requestBody));
                doc.item.requestBody = [params];

                const responseParams = [];

                doc.item.responseParams.forEach((val, index) => {
                    const params = {
                        _id: Math.random(),
                        key: "",
                        type: "object",
                        description: "",
                        value: "",
                        required: true,
                        children: [],
                        _select: true,
                    }
                    responseParams[index] = {
                        ...val,
                        values: [params]
                    }
                    params.children = JSON.parse(JSON.stringify(val.values));                    
                })

                console.log(responseParams)
                
                await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id: doc._id }, { $set: { "item.requestBody": [params], "item.responseParams": responseParams } })
            }
            // console.log(doc.item.requestBody)
            this.ctx.helper.successResponseData({});
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = testController;
