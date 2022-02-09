/**
    @description  文档操作相关service
    @author        shuxiaokai
    @create       2021-03-01 13:57"
*/

const Service = require("egg").Service;
const fs = require("fs-extra");
const path = require("path");
const docx = require("docx");

class docsOperationService extends Service {
     /** 
     * @description        导出为html
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsHTML(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.service.apidoc.project.project.getProjectFullInfo({ _id: projectId })
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
                _id: { $in: selectedNodes }
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
            }).lean();
        }
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.json`)}`);
        const result = {
            projectInfo,
            docs
        };
        let file = await fs.readFile(path.resolve(this.app.baseDir, "app/public/share-doc/index.html"), "utf-8");
        file = file.replace(/window.SHARE_DATA = null/, `window.SHARE_DATA = ${JSON.stringify(result)}`);
        file = file.replace(/<title>[^<]*<\/title>/, `<title>${projectInfo.projectName}<\/title>`);
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.html`)}`);

        //添加历史记录
        const userInfo = this.ctx.userInfo;
        const record = {
            operation: "export", //导出为html
            projectId,
            recordInfo: {
                exportType: "html"
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return file;
    }
     /** 
     * @description        导出为pdf
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
      async exportAsPdf(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.service.apidoc.project.project.getProjectFullInfo({ _id: projectId })
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                isFolder: false,
                enabled: true,
                _id: { $in: selectedNodes }
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                isFolder: false,
                enabled: true,
            }).lean();
        }
        // this.ctx.set("content-type", "application/force-download");
        // this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.json`)}`);
        // this.ctx.set("content-type", "application/force-download");
        // this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.html`)}`);
        return docs;
    }
     /** 
     * @description        导出为word
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
      async exportAsWord(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const projectInfo = await this.ctx.service.apidoc.project.project.getProjectFullInfo({ _id: projectId })
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
                _id: { $in: selectedNodes }
            }, {
                preRequest: 0,
                afterRequest: 0,
                enabled: 0,
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
            }, {
                preRequest: 0,
                afterRequest: 0,
                enabled: 0,
            }).lean();
        }
        //=========================================================================//
        const { Document, SectionType, TextRun, InsertedTextRun, ShadingType, TabStopType, TabStopPosition, Packer, Table, Paragraph, PageBreak, TableRow, TableCell, VerticalAlign, WidthType, HeadingLevel, AlignmentType } = docx;
        const document = {
            sections: [{
                children: [
                    new Paragraph({
                        text: `${projectInfo.projectName}`,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER
                    })
                ]
            }],
        };
        const nestDocs = this.ctx.helper.buildTree(docs);
        this.ctx.helper.dfsForest(nestDocs, (data, level) => {
            let headingLevel = HeadingLevel.HEADING_1;
            switch (level) {
            case 1:
                headingLevel = HeadingLevel.HEADING_1;
                break;
            case 2:
                headingLevel = HeadingLevel.HEADING_2;
                break;
            default:
                headingLevel = HeadingLevel.HEADING_2;
                break;
            }
            if (data.isFolder) { //文件夹
                const title = new Paragraph({
                    text: `${data.info.name}`,
                    heading: headingLevel,
                    spacing: {
                        before: 400,
                    },
                })
                document.sections[0].children.push(title); //标题
            } else {
                const docName = new Paragraph({
                    heading: HeadingLevel.HEADING_3,
                    children: [
                        new TextRun({
                            text: `${data.info.name}`,
                            size: 26,
                        }),
                    ],
                    spacing: {
                        before: 250,
                        after: 30,
                    },
                })
                const requestMethod = data.item.method;
                const methodText = new TextRun({
                    text: `${requestMethod}`,
                    color: (requestMethod === "GET") ? "28a745" : (requestMethod === "POST") ? "ffc107" : (requestMethod === "PUT") ? "orange" : (requestMethod === "DELETE") ? "f56c6c" : "444444"
                })
                const method = new Paragraph({ //请求方法
                    children: [new TextRun({ text: "请求方法：" }), methodText]
                })
                const url = new Paragraph({ //请求方法
                    text: `请求地址：${data.item.url.host + data.item.url.path}`,
                })
                const contentType = new Paragraph({ //contentType
                    text: `参数类型：${data.item.contentType}`,
                })
                //=====================================queryParams====================================//
                const queryParamsOfDoc = data.item.queryParams.filter(v => v.key).map(v => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(v.key)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.value)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.required ? "必填" : "非必填")],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.description)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    })
                })
                const tableOfQueryParams = new Table({
                    width: {
                        size: 9638,
                        type: WidthType.DXA,
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [new Paragraph("参数名称")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("参数值")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("是否必填")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("备注")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                            ],
                        }),
                        ...queryParamsOfDoc
                    ]
                });
                //=====================================pathParams====================================//
                const pathParamsOfDoc = data.item.queryParams.filter(v => v.key).map(v => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(v.key)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.value)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.required ? "必填" : "非必填")],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.description)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    })
                })
                const tableOfPathParams = new Table({
                    width: {
                        size: 9638,
                        type: WidthType.DXA,
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [new Paragraph("参数名称")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("参数值")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("是否必填")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("备注")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                            ],
                        }),
                        ...pathParamsOfDoc
                    ]
                });
                //=====================================json类型bodyParams====================================//
                const jsonParamsOfDoc = [];
                this.ctx.helper.astJson(data.item.requestBody.json).forEach(str => {
                    jsonParamsOfDoc.push(new Paragraph({ 
                        shading: {
                            type: ShadingType.SOLID,
                            color: "f3f3f3",
                        },
                        children: [
                            new TextRun({
                                text: str,
                            })
                        ]
                    }))
                })
                //=====================================formData类型bodyParams====================================//
                const formDataParamsOfDoc = data.item.requestBody.formdata.filter(v => v.key).map(v => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(v.key)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.value)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.required ? "必填" : "非必填")],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.description)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    })
                })
                const tableOfFormDataParams = new Table({
                    width: {
                        size: 9638,
                        type: WidthType.DXA,
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [new Paragraph("参数名称")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("参数值")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("是否必填")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("备注")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                            ],
                        }),
                        ...formDataParamsOfDoc
                    ]
                });
                //=====================================urlencoded类型bodyParams====================================//
                const urlencodedParamsOfDoc = data.item.requestBody.urlencoded.filter(v => v.key).map(v => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(v.key)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.value)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.required ? "必填" : "非必填")],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.description)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    })
                })
                const tableOfUrlencoedParams = new Table({
                    width: {
                        size: 9638,
                        type: WidthType.DXA,
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [new Paragraph("参数名称")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("参数值")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("是否必填")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("备注")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                            ],
                        }),
                        ...urlencodedParamsOfDoc
                    ]
                });
                //=====================================请求头====================================//
                const headerParamsOfDoc = data.item.headers.filter(v => v.key).map(v => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(v.key)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.value)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.required ? "必填" : "非必填")],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                            new TableCell({
                                children: [new Paragraph(v.description)],
                                verticalAlign: VerticalAlign.CENTER,
                            }),
                        ],
                    })
                })
                const tableOfHeaderParams = new Table({
                    width: {
                        size: 9638,
                        type: WidthType.DXA,
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [new Paragraph("参数名称")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("参数值")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("是否必填")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                                new TableCell({
                                    children: [new Paragraph("备注")],
                                    verticalAlign: VerticalAlign.CENTER,
                                }),
                            ],
                        }),
                        ...headerParamsOfDoc
                    ]
                });

                //=========================================================================//
                document.sections[0].children.push(docName);
                document.sections[0].children.push(method);
                document.sections[0].children.push(url);
                if (contentType) {
                    document.sections[0].children.push(contentType);
                }
                document.sections[0].children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: "请求参数",
                            bold: true,
                        })
                    ],
                    spacing: {
                        before: 250
                    },
                }));
                if (queryParamsOfDoc.length > 0) {
                    document.sections[0].children.push(new Paragraph({ 
                        text: "Query参数", 
                        spacing: { before: 150, after: 30 },
                        tabStops: [
                            {
                                type: TabStopType.CENTER,
                                position: 2268,
                            },
                        ],
                    }));
                    document.sections[0].children.push(tableOfQueryParams);
                }
                if (pathParamsOfDoc.length > 0) {
                    document.sections[0].children.push(new Paragraph({ text: "Path参数", spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(tableOfPathParams);
                }
                if (data.item.contentType === "application/json") {
                    document.sections[0].children.push(new Paragraph({ text: "Body参数(JSON)", spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(...jsonParamsOfDoc);
                } else if (data.item.contentType === "multipart/form-data") {
                    document.sections[0].children.push(new Paragraph({ text: "Body参数(multipart/*)", spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(tableOfFormDataParams);
                } else if (data.item.contentType === "application/x-www-form-urlencoded") {
                    document.sections[0].children.push(new Paragraph({ text: "Body参数(x-www-form-urlencoded)", spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(tableOfUrlencoedParams);
                } else if (data.item.contentType) {
                    document.sections[0].children.push(new Paragraph({ text: `Body参数(${data.item.contentType})`, spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(new Paragraph({ text: data.item.requestBody.raw.data }));
                }
                if (headerParamsOfDoc.length > 0) {
                    document.sections[0].children.push(new Paragraph({ text: "请求头", spacing: { before: 150, after: 30 } }));
                    document.sections[0].children.push(tableOfHeaderParams);
                }
                //=====================================返回参数====================================//
                document.sections[0].children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: "返回参数",
                            bold: true,
                        })
                    ],
                    spacing: {
                        before: 250
                    },
                }));
                data.item.responseParams.forEach(res => {
                    document.sections[0].children.push(new Paragraph({
                        text: `名称：${res.title}`,
                        spacing: {
                            before: 200
                        },
                    }));
                    document.sections[0].children.push(new Paragraph({
                        text: `状态码：${res.statusCode}`,
                    }));
                    document.sections[0].children.push(new Paragraph({
                        text: `参数类型：${res.value.dataType}`,
                    }));
                    if (res.value.dataType === "application/json") {
                        const jsonDoc = [];
                        this.ctx.helper.astJson(res.value.json).forEach(str => {
                            jsonDoc.push(new Paragraph({ 
                                shading: {
                                    type: ShadingType.SOLID,
                                    color: "f3f3f3",
                                },
                                children: [
                                    new TextRun({
                                        text: str,
                                    })
                                ]
                            }))
                        })
                        document.sections[0].children.push(...jsonDoc);
                    } else {
                        document.sections[0].children.push(new Paragraph({ text: res.value.text }));
                    }
                })
            }
        });
        const doc = new Document(document);
        const file = await Packer.toBuffer(doc);
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.docx`)}`);
        return file;
    }
    /** 
     * @description        导出为摸鱼文档
     * @author              shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {Array}     selectedNodes 被选择的需要导出的节点
     * @return {String}    返回字符串
     */
    async exportAsMoyuDoc(params) { 
        const { projectId, selectedNodes = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const userInfo = this.ctx.userInfo;
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId });
        const porjectRules = await this.ctx.service.apidoc.project.projectRules.readProjectRulesById(params);
        const hosts = await this.ctx.service.apidoc.docs.docsServices.getServicesList(params);
        let docs = [];
        if (selectedNodes.length > 0) { //选择导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
                _id: { $in: selectedNodes }
            }).lean();
        } else { //直接导出
            docs = await this.ctx.model.Apidoc.Docs.Docs.find({
                projectId,
                enabled: true,
            }).lean();
        }
        this.ctx.set("content-type", "application/force-download");
        this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(`${projectInfo.projectName}.json`)}`);
        const result = {
            type: "moyu",
            info: {
                projectName: projectInfo.projectName,
            },
            rules: porjectRules,
            docs,
            hosts
        };
        
        //添加历史记录
        const record = {
            operation: "export", //导出为moyu
            projectId,
            recordInfo: {
                exportType: "moyu"
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return JSON.stringify(result);
    }
    /**
     * @description        导入文档
     * @author             shuxiaokai
     * @create             2021-03-01 14:04
     * @param {any}        projectId - 项目id
     * @param {boolean}    cover - 是否覆盖原有数据
     * @param {moyu}       moyuData - 摸鱼接口文档类型数据
     * @return {String}    返回字符串
     */
    async importAsMoyuDoc(params) { 
        const { projectId, cover, moyuData = {} } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const { docs = [], hosts = [] } = moyuData;
        const convertDocs = docs.map((docInfo) => {
            const newId = this.app.mongoose.Types.ObjectId()
            const oldId = docInfo._id.toString();
            docs.forEach(originDoc => {
                if (originDoc.pid === oldId) {
                    originDoc.pid = newId
                }
            })
            docInfo.projectId = projectId;
            docInfo._id = newId;
            docInfo.item.method = docInfo.item?.method?.toUpperCase() || "GET";
            return docInfo;
        })
        const convertHosts = hosts && hosts.map(host => {
            host._id = this.app.mongoose.Types.ObjectId();
            host.projectId = projectId;
            return host;
        })
        if (cover) {
            await this.ctx.model.Apidoc.Docs.Docs.updateMany({ projectId }, { $set: { enabled: false } })
            await this.ctx.model.Apidoc.Docs.DocsServices.updateMany({ projectId }, { $set: { enabled: false } });
        }
        await this.ctx.model.Apidoc.Docs.DocsServices.create(convertHosts);
        await this.ctx.model.Apidoc.Docs.Docs.create(convertDocs)
        const docLen = await this.ctx.model.Apidoc.Docs.Docs.find({ projectId, isFolder: false, enabled: true }).countDocuments();
        await this.ctx.model.Apidoc.Project.Project.findByIdAndUpdate({ _id: projectId }, { $set: { docNum: docLen }});
        //文档导入
        const userInfo = this.ctx.userInfo;
        const record = {
            operation: "import",
            projectId,
            recordInfo: {
                importNum: docs.length,
                importIsCover: cover
            },
            operator: userInfo.realName || userInfo.loginName,
        };
        await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return;
    }

    /** 
     * @description        生成在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    shareName 分享标题
     * @param  {String}    projectId 项目id
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @param  {Array}     selectedDocs 被选择的需要导出的节点
     * @return {String}    返回在线链接
     */
    async generateOnlineLink(params) { 
        const { shareName, projectId, password, maxAge = 86400000, selectedDocs = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        let expire = Date.now();
        if (!maxAge || maxAge > 31536000000 * 5) {
            expire += 31536000000 * 5; //五年后过期
        } else {
            expire += maxAge
        }
        const projectInfo = await this.ctx.model.Apidoc.Project.Project.findOne({ _id: projectId }, { projectName: 1 }).lean();
        const shareInfo = {
            shareId: this.ctx.helper.uuid(),
            shareName,
            projectId,
            password,
            projectName: projectInfo.projectName,
            expire,
            selectedDocs
        }
        const result = await this.ctx.model.Apidoc.Project.ProjectShare.create(shareInfo);
        return result.shareId;
    }

    /** 
     * @description        修改在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String}    _id 在线链接id
     * @param  {String}    shareName 分享标题
     * @param  {String?}   password 密码
     * @param  {String?}   maxAge 过期时间
     * @param  {Array}     selectedDocs 被选择的需要导出的节点
     * @return {String}    返回在线链接
     */
     async editOnlineLink(params) { 
        const { shareName, projectId, _id, password, maxAge = 86400000, selectedDocs = [] } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        let expire = Date.now();
        if (!maxAge || maxAge > 31536000000 * 5) {
            expire += 31536000000 * 5; //五年后过期
        } else {
            expire += maxAge
        }
        await this.ctx.model.Apidoc.Project.ProjectShare.findByIdAndUpdate({ _id }, {
            $set: {
                shareName,
                password,
                expire,
                selectedDocs
            }
        });
        return;
    }

    /** 
     * @description        删除在线链接
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    projectId 项目id
     * @param  {String?}   _id 项目id
     */
     async deleteOnlineLink(params) { 
        const { projectId, _id } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        await this.ctx.model.Apidoc.Project.ProjectShare.update({ projectId, _id }, { $set: { enabled: false } });
        return;
    }

    /** 
     * @description        获取在线链接列表
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {number}    pageNum 页码
     * @param  {number}    pageSize 每页数量
     * @param  {string}    projectId 项目id
     * @param  {boolean}   isAll 是否展示全部项目
     * @return {Array}    
     */
     async getOnlineLinkList(params) { 
        const { projectId, isAll } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(projectId);
        const rows = await this.ctx.model.Apidoc.Project.ProjectShare.find({ projectId, enabled: true }, { enabled: 0, createdAt: 0, updatedAt: 0 });
        const total = await this.ctx.model.Apidoc.Project.ProjectShare.find({ projectId, enabled: true }).countDocuments();
        return {
            rows,
            total
        };
    }

     /** 
     * @description        fork项目中部分文档
     * @author             shuxiaokai
     * @create             2020-11-13 21:24
     * @param  {String}    sourceProjectId 源项目id
     * @param  {String}    targetProjectId 目标项目id
     * @param  {String}    targetMountedId 挂载点文档id
     * @param  {Number}    targetNodeSort 目标节点排序
     * @param  {Array}     selectedDocIds 被选择的需要导出的节点
     * @param  {String}    sourceRootId 源节点根元素id
     * @return {String}    返回字符串
     */
    async forkDocs(params) { 
        const { sourceProjectId, targetProjectId, targetMountedId, selectedDocIds, sourceRootId, targetNodeSort } = params;
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(sourceProjectId);
        await this.ctx.service.apidoc.docs.docs.checkOperationDocPermission(targetProjectId);
        const docsIdMap = {};
        const sourceDocs = await this.ctx.model.Apidoc.Docs.Docs.find({ _id: { $in: selectedDocIds }, projectId: sourceProjectId }).lean();
        const sourceRootDoc = sourceDocs.find(doc => doc._id.toString() === sourceRootId);
        sourceRootDoc.sort = targetNodeSort;
        sourceRootDoc.pid = targetMountedId || "";
        sourceDocs.forEach(doc => {
            const newId = this.app.mongoose.Types.ObjectId()
            const oldId = doc._id.toString();
            docsIdMap[oldId] = newId;
            sourceDocs.forEach(originDoc => {
                if (originDoc.pid === oldId) {
                    originDoc.pid = newId
                }
            })
            doc._id = newId;
            doc.projectId = targetProjectId;
        })
        await this.ctx.model.Apidoc.Docs.Docs.insertMany(sourceDocs);
        //文档导出
        // const userInfo = this.ctx.userInfo;
        // const record = {
        //     operation: "export",
        //     projectId,
        //     recordInfo: {
        //         exportType: "fork"
        //     },
        //     operator: userInfo.realName || userInfo.loginName,
        // };
        // await this.ctx.model.Apidoc.Docs.DocsHistory.create(record);
        return docsIdMap;
    }


}

module.exports = docsOperationService;