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
}

module.exports = mockController;
