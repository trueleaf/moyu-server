/**
    @description  test控制器
    @author        shuxiaokai
    @create       2021-04-12 15:17"
*/

const Controller = require("egg").Controller;

class testController extends Controller {
    async test() {
        try {
            // let allDoc = await this.ctx.model.Apidoc.Docs.Docs.find({ enabled: true }).lean();
            // for(let i = 0; i < allDoc.length; i ++) {
            //     const doc = allDoc[i];
            //     const bodyData = {};
            //     if (doc.item.requestBody.length > 0) {
            //         bodyData.json = doc.item.requestBody
            //         bodyData.mode = "json"; 
            //         bodyData.formdata = []; 
            //         bodyData.urlencoded = []; 
            //     }

            //     const responseData = []
            //     doc.item.responseParams.forEach(res => {
            //         responseData.push({
            //             title: res.title,
            //             statusCode: res.statusCode,
            //             value: {
            //                 dataType: "application/json",
            //                 json: res.values
            //             }
            //         });
            //     })

            //     await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id: doc._id }, { 
            //         $set: { 
            //             "item.responseParams": responseData,
            //             "item.requestBody": bodyData,
            //             "item.headers": [],
            //             "item.contentType": "application/json"
            //         }
            //     })
            // }
            
            // allDoc = await this.ctx.model.Apidoc.Docs.Docs.find({ enabled: true }).lean();
            
            // for(let i = 0; i < allDoc.length; i ++) {
            //     const doc = allDoc[i];
            //     const jsonData = doc.item.requestBody.json;
            //     const queryData = doc.item.queryParams;
            //     this.ctx.helper.dfsForest(jsonData || [], {
            //         rCondition(value) {
            //             return value.children;
            //         },
            //         rKey: "children",
            //         hooks: (data) => {
            //             data.select = true;
            //         },
            //     });
                
            //     this.ctx.helper.dfsForest(queryData || [], {
            //         rCondition(value) {
            //             return value.children;
            //         },
            //         rKey: "children",
            //         hooks: (data) => {
            //             data.select = true;
            //         },
            //     });

            //     await this.ctx.model.Apidoc.Docs.Docs.findByIdAndUpdate({ _id: doc._id }, { 
            //         $set: { 
            //             "item.requestBody.json": jsonData, 
            //             "item.queryParams": queryData, 
            //         }
            //     })
            // }
            // this.ctx.helper.successResponseData(allDoc.length);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = testController;
