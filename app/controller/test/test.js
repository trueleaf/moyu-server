/**
    @description  test控制器
    @author        shuxiaokai
    @create       2021-04-12 15:17"
*/

const Controller = require("egg").Controller;

class testController extends Controller {
    async test() {
        try {
            

        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = testController;
