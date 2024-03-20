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
        //=========================================================================//
        this.app.once("server", server => {
            // websocket
        });
        this.app.on("request", ctx => {});
        this.app.on("response", ctx => {
            const used = Date.now() - ctx.starttime;
            ctx.logger.info("操作用时", used, ctx.request.url, ctx.ip);
        });
    }
}



module.exports = AppBootHook;
