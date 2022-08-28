/**
    @description  test控制器
    @author        shuxiaokai
    @create       2021-04-12 15:17"
*/

const Controller = require("egg").Controller;
const PImage = require("pureimage");
const path = require("path")
const fs = require("fs-extra")
const { PassThrough } = require("stream");

const streamToBase64 = (stream) => {
    return new Promise((resolve, reject) => {
        const buffers = [];
        stream.on("data", (chunk) => { buffers.push(chunk); });
        stream.once("end", () => {
            let buffer = Buffer.concat(buffers);
            resolve(buffer.toString("base64"));
        });
        stream.on("error", (error) => {
            reject(error)
        });
    })
}
class mockController extends Controller {
    /**
     * 获取图片数据
     */
    async image() {
        try {
            let { w = 200, h = 200, bg = "#eeeeee" } = this.ctx.query;
            if (w > 1000) {
                w = 1000;
            }
            if (h > 1000) {
                h = 1000;
            }
            const font = PImage.registerFont(path.resolve(this.ctx.app.baseDir, "app/public/font/number.ttf"),"number");
            font.loadSync()
            const image = PImage.make(w, h);
            const ctx = image.getContext("2d");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#777";
            ctx.font = `${w / 8}px number`;
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(`${w}X${h}`, w / 2, h / 2);
            const stream = new PassThrough()
            await PImage.encodePNGToStream(image, stream)
            this.ctx.set("content-type", "image/png")
            this.ctx.body = stream;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * 获取base64图片数据
     */
     async base64Image() {
        try {
            let { w = 200, h = 200, bg = "#eeeeee" } = this.ctx.query;
            if (w > 1000) {
                w = 1000;
            }
            if (h > 1000) {
                h = 1000;
            }
            const font = PImage.registerFont(path.resolve(this.ctx.app.baseDir, "app/public/font/number.ttf"),"number");
            font.loadSync()
            const image = PImage.make(w, h);
            const ctx = image.getContext("2d");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#777";
            ctx.font = `${w / 8}px number`;
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(`${w}X${h}`, w / 2, h / 2);
            const stream = new PassThrough()
            await PImage.encodePNGToStream(image, stream)
            const base64 = await streamToBase64(stream);
            console.log(`data:image/png;base64,${base64}`)
            this.ctx.body = `data:image/png;base64,${base64}`
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * 获取内置文件数据
     */
    async file() {
        try {
            const { type } = this.ctx.query;
            if (type === "doc") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.doc");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/msword")
                this.ctx.body = fileInfo;
            } else if (type === "docx") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.docx");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                this.ctx.body = fileInfo;
            } else if (type === "xls") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.xls");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/vnd.ms-excel")
                this.ctx.body = fileInfo;
            } else if (type === "xlsx") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.xlsx");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                this.ctx.body = fileInfo;
            } else if (type === "pdf") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.pdf");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/pdf")
                this.ctx.body = fileInfo;
            } else if (type === "zip") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.zip");
                const fileInfo = await fs.readFile(filePath);
                this.ctx.set("content-type", "application/x-zip-compressed")
                this.ctx.body = fileInfo;
            } else {
                this.ctx.body = `无效的文件类型${type}`
            }
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }  
    }
    /**
     * 远端mock
     */
    async remote() {
        try {
            const { id } = this.ctx.params;
            const docInfo = await this.ctx.model.Apidoc.Docs.Docs.findById({ _id: id });
            const { mockInfo, projectId } = docInfo;
            const variables = await this.ctx.service.apidoc.project.projectVariable.getProjectVariableEnum({ projectId })
            mockInfo.responseHeaders.filter(v => v.key && v.value && v.select).forEach(header => {
                const realValue = apidocConvertValue(header.value);
                if (realValue.match(/[\u4E00-\u9FA5]/)) {
                    throw new Error("不允许请求头值为中文")
                }
                this.ctx.set(header.key, realValue)
            })
            const { responseType, json, image, file, text } = mockInfo;
            await this.ctx.helper.sleep(mockInfo.responseDelay)
            this.ctx.status = mockInfo.httpStatusCode;
            if (responseType === "json" && json) {
                const realJson = this.ctx.helper.convertMockJsonToRealJson(json, variables);
                this.ctx.body = JSON.parse(realJson);
            } else if (responseType === "json" && !json) {
                this.ctx.body = this.ctx.helper.convertMockJsonToRealJson(responseStrJson, variables);
            } else if (responseType === "image") {
                const imageStream = await this.ctx.helper.createMockImage(mockInfo.image.width, mockInfo.image.height, mockInfo.image.backgroundColor);
                this.ctx.set("Content-Type", `image/${image.type}`);
                this.ctx.body = imageStream
            } else if (responseType === "file" && file.type === "doc") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.doc");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/msword");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "docx") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.docx");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "xls") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.xls");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/vnd.ms-excel");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "xlsx") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.xlsx");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "pdf") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.pdf");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/pdf");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "zip") {
                const filePath = path.resolve(this.ctx.app.baseDir, "app/public/mock-file/mock.zip");
                const fileData = await fs.readFile(filePath);
                this.ctx.set("Content-Type", "application/x-zip-compressed");
                this.ctx.body = fileData
            } else if (responseType === "file" && file.type === "custom") {
                this.ctx.body = "暂不支持自定义文件远程mock";
            } else if (responseType === "text") {
                this.ctx.set("Content-Type", "text/plain; charset=utf-8");
                this.ctx.body = text;
            } else {
                this.ctx.body = "";
            }
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }  
    }
}

module.exports = mockController;
