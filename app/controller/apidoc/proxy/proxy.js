/**
    @description  web端接口转发控制器
    @author       shuxiaokai
    @create       2021-09-22 22:18"
*/

const Controller = require("egg").Controller;
const got = require("got");
const FileType = require("file-type");
gotInstance = got.extend({
    timeout: 60000, //超时时间
    retry: 0,
    throwHttpErrors: false,
    followRedirect: true,
    allowGetBody: true,
});

async function formatResponseBuffer(bufferData, contentType) {
    const typeInfo = await FileType.fromBuffer(bufferData.buffer);
    const mime = contentType ? contentType : (typeInfo ? typeInfo.mime : ""); //优先读取contentType
    const textContentType = ["text/", "application/json", "application/javascript", "application/xml"];
    if (textContentType.find(type => contentType.match(type))) {
        return bufferData.toString();
    } else {
        return bufferData.toString();
    }
}


class ProxyController extends Controller {

    /**
        @description  接口转发
        @author       shuxiaokai
        @create       2021-09-22 22:19"
        @return       null
    */
    async proxyWebApi() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                headers: {
                    type: "object"
                },
                url: {
                    type: "string"
                },
                body: {
                    type: "string",
                    required: false,
                }
            };
            this.ctx.validate(reqRule, params);
            const { url, method, body, headers } = params
            if (url.startsWith("http://127.0.0.1")) {
                const err = new Error("无法代理内网请求");
                err.name = "proxyError"
                this.ctx.helper.throwError(err);
                return;
            }
            const response = await gotInstance(url, {
                method,
                body,
                headers,
                responseType: "buffer"
            });
            // const data = await formatResponseBuffer(response.body, response.headers["content-type"]);
            // console.log(response.body)
            this.ctx.helper.successResponseData({
                httpVersion: response.httpVersion,
                ip: response.ip,
                statusCode: response.statusCode,
                statusMessage: response.statusMessage,
                contentType: response.headers["content-type"],
                cookies: response.headers["set-cookie"] || [],
                headers: response.headers,
                rt: response.timings.phases.total,
                data: response.body,
            });
        } catch (error) {
            const err = new Error(error.message);
            err.name = "proxyError"
            this.ctx.helper.throwError(err);
            return;
        }
    }
}

module.exports = ProxyController;
