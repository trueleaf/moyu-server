/** 
 * @description        mock数据拦截器
 * @author              shuxiaokai
 * @create             2020-08-26 17:28
 */

module.exports = options => {
    return async function mock(ctx, next) {
        if (ctx.request.url.startsWith("/mock")) {
            
            const params = ctx.request.query;
            const doc = await ctx.model.Apidoc.Docs.Docs.findOne({ _id: params._mockId, enabled: true }).lean();
            ctx.body = convertPlainParamsToTreeData(doc.item.responseParams);
        }
        await next();
    };
};

function convertPlainParamsToTreeData(plainData, jumpChecked) {
    const result = {};
    const foo = (plainData, result) => {
        for (let i = 0, len = plainData.length; i < len; i++) {
            if (jumpChecked && !plainData[i]._select) { //若请求参数未选中则不发送请求
                continue;
            }
            const key = plainData[i].key.trim();
            const value = plainData[i].value;
            const type = plainData[i].type;
            const resultIsArray = Array.isArray(result);
            const isComplex = (type === "object" || type === "array");
            let arrTypeResultLength = 0; //数组类型值长度，用于数组里面嵌套对象时候对象取值
            if (!isComplex && (key === "" || value === "")) { //非复杂数据需要填写参数名称才可以显示
                continue;
            }
            /*eslint-disable indent*/ 
            switch (type) {
                case "number": //数字类型需要转换为数字，转换前所有值都为字符串
                    resultIsArray ? result.push(Number(value)) : result[key] = Number(value);
                    break;
                case "boolean": //字符串类型不做处理
                    resultIsArray ? result.push(result[key] = (value === "true" ? true : false)) : (result[key] = (value === "true" ? true : false));
                    break;
                case "object":
                    resultIsArray ? (arrTypeResultLength = result.push({})) : (result[key] = {});
                    if (plainData[i].children && plainData[i].children.length > 0) {
                        foo(plainData[i].children, resultIsArray ? (result[arrTypeResultLength - 1]) : result[key]);
                    }
                    break;
                case "array":
                    result[key] = [];
                    if (plainData[i].children && plainData[i].children.length > 0) {
                        foo(plainData[i].children, result[key]);
                    }
                    break;
                default: //字符串或其他类型类型不做处理
                    resultIsArray ? result.push(value) : (result[key] = value);
                    break;
            }
        }
    }
    foo(plainData, result);
    return result;
}