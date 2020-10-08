/* 
    @description  初始化程序
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

//=====================================添加额外数据类型校验====================================//
class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didLoad() {
        //添加代理中间件
        //=====================================添加常见验证规则====================//
        this.app.validator.addRule("requestRule", (rule, value) => {
            if (
                !value.hasOwnProperty("description") ||
                !value.hasOwnProperty("methods") ||
                !value.hasOwnProperty("url") ||
                !value.hasOwnProperty("header") ||
                !value.hasOwnProperty("requestParams") ||
                !value.hasOwnProperty("responseParams")
            ) {
                return "item参数下面必须存在description,methods,url,header,params";
            }
        });
        this.app.validator.addRule("email", (rule, value) => {
            // const rule = 
        });


        //=========================================================================//
        this.app.once("server", server => {
            // websocket
        });
        this.app.on("request", ctx => {});
        this.app.on("response", ctx => {
            const used = Date.now() - ctx.starttime;
            ctx.logger.info("操作用时", used, ctx.request.url);
        });
    }
}



module.exports = AppBootHook;
