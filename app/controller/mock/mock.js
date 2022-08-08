/**
    @description  test控制器
    @author        shuxiaokai
    @create       2021-04-12 15:17"
*/

const Controller = require("egg").Controller;
const PImage = require("pureimage");
const path = require("path")
const { PassThrough } = require("stream")

class mockController extends Controller {
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
}

module.exports = mockController;
