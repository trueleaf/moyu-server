/** 
    @description  工具函数
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/
const { v4: uuidv4 } = require("uuid")
module.exports = {
    /**
     * @description        生成uuid
     * @author             shuxiaokai
     * @create             2021-02-28 21:24
     * @return {String}    返回字符串
     */
    uuid() {
        return uuidv4();
    },

    /** 
     * @description        异常抛出
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-03-15 22:02
     * @update             2020-03-15 22:02
     */

    throwError(error) {
        // console.dir(error);
        const errorCode = error.code;
        this.ctx.logger.error(error);
        console.error(error);
        if (error.name === "TokenExpiredError") { //jwt过期
            this.ctx.body = {
                code: 4100,
                msg: error.message,
            };
            return;
        }

        if (typeof errorCode === "number") {
            this.ctx.body = {
                code: errorCode,
                msg: error.message,
            };
            return;
        }
        
        if (errorCode === "invalid_param") {
            this.ctx.body = {
                code: 1001,
                msg: "请求参数错误",
                data: error.errors
            };
            return;
        }

        this.ctx.body = {
            code: 5000,
            msg: process.env.NODE_ENV === "production" ? "内部错误" : error.message,
        };
    },

    /** 
     * @description        封装异常抛出
     * @author              shuxiaokai
     * @create             2020-03-25 15:57
     * @param {string}     msg - 任意类型变量       
     * @param {number}     code - 任意类型变量       
     */

    throwCustomError(msg = "", code) {
        const error = new Error(msg);
        error.code = code;
        throw error;
    },

    /** 
     * @description        成功返回值封装
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-03-15 22:03
     * @update             2020-03-15 22:03
     * @param {any}        data - 返回数据       
     * @param {string=}    [msg=操作成功] - 成功数据提示       
     */

    successResponseData(data, msg = "操作成功") {
        this.ctx.body = {
            code: 0,
            msg,
            data
        };
    },

    /** 
     * @description        随机数正整数生成
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-03-16 23:27
     * @update             2020-03-16 23:27
     * @param {number}     min - 最小值       
     * @param {number}     max - 最大值       
     * @return {number}    返回包含最大值和最小值的随机数
     */

    rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /** 
     * @description        深度优先?遍历森林
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-01-31 17:14
     * @update             2020-01-31 17:14
     * @param {Array}      forestData - 数据(森林结构)       
     * @param {function}   rCondition(recursionCondition) - 递归条件,第一个参数为递归数据，返回truly或者falsely
     * @param {string}     rKey(recursionKey) - 满足条件时候的递归字段
     * @param {function}   hooks - 每次数据遍历处理函数,第一个参数为递归数据,第二个参数为当前层级循环的下标值       
     * @return {null}     无返回值
     */

    dfsForest(forestData, config) {
        const { rCondition, rKey = "children", hooks } = config;
        if (!Array.isArray(forestData)) {
            throw new Error("第一个参数必须为数组结构森林");
        }
        if (!rKey) {
            throw new Error("必须指定满足递归条件后需要继续递归的字段");
        }
        //开始递归
        const foo = (forestData, rCondition, hooks, rKey, parent) => {
            for (let i = 0, len = forestData.length; i < len; i++) {
                hooks && hooks(forestData[i], i, forestData, parent);
                if (rCondition && rCondition(forestData[i])) {
                    if (!forestData[i][rKey] || !Array.isArray(forestData[i][rKey])) {
                        console.warn("当前指定字段值不为数组，将会忽略本次循环");
                        continue;
                    }
                    foo(forestData[i][rKey], rCondition, hooks, rKey, forestData[i]);
                }
            }
        };
        foo(forestData, rCondition, hooks, rKey, null);
    },
    getType(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLocaleLowerCase();
    },

    //美化请求参数
    convertDocParams(docParams) {
        const result = {};
        const params = {};
        this.addParamsDescription(docParams, result);
        this.convertParamsToJson(docParams, params);
        const treeStrData = JSON.parse(JSON.stringify(result));
        const copyStr = this.convertParamsToCopyStr(treeStrData);
        const resultStr = this.convertDescriptionParamsToFormatStr(treeStrData); //结果
        return {
            str: resultStr,
            data: params,
            copyStr
        };
    },
    //给请求参数添加描述信息
    addParamsDescription(treeData, result) {
        for (let i = 0; i < treeData.length; i++) {
            if (treeData[i].key == null || treeData[i].key.trim() === "") {
                continue;
            }
            const key = treeData[i].key;
            const description = treeData[i].description;
            const required = treeData[i].required ? "" : "(非必填)";
            const type = treeData[i].type;
            const str = key + "-###-" + description + "-###-" + required + "-###-" + type;
            if (treeData[i].children && treeData[i].children.length > 0) {
                result[str] = {};
                this.addParamsDescription(treeData[i].children, result[str]);
            } else {
                result[str] = treeData[i].type === "number" ? Number(treeData[i].value) : treeData[i].value;
            }
        }
    },
    //将添加了描述的请求参数转换为具有一定格式的字符串
    convertDescriptionParamsToFormatStr(treeData) {
        if (Object.keys(treeData).length === 0) {
            return "无";
        }
        let result = "";
        const spaceNum = 8; //基础空格数量
        const space = " ".repeat(spaceNum); //空格字符串
        const foo = (treeData, space) => {
            let str = "";
            for (const i in treeData) {
                if (this.getType(treeData[i]) === "object") {
                    str += `${space}${i.split("-###-")[0]}: {\n${foo(treeData[i], space + space, 1)}${space}}, \n`;
                } else {
                    str += `${space}${i.split("-###-")[0]}: ${treeData[i]}, ${i.split("-###-")[1] ? "//" + i.split("-###-")[1] + i.split("-###-")[2] : ""} \n`;
                }
            }          
            return str;      
        };
        result = foo(treeData, space);
        return `{\n${result}}`;
    },
    convertParamsToCopyStr(treeData) {
        if (Object.keys(treeData).length === 0) {
            return "空";
        }
        let result = "";
        const spaceNum = 16; //基础空格数量
        const space = " ".repeat(spaceNum); //空格字符串
        let isFirstKey = true; //是否是第一个key用于处理vscode换行
        const commentLen = 50; //默认总长度为50，超过总长度不计算宽度

        const foo = (treeData, space) => {
            let str = "";
            const treeDataValueArr = [];
            for (const i in treeData) {
                if (typeof treeData[i] !== "object") {
                    treeDataValueArr.push(treeData[i]);
                }
            }
            //const maxKeysLength = Object.keys(treeData).map(val => val.split("-###-")[0]).sort((a, b) => b.toString().length - a.toString().length)[0].length;
            // const maxValue = treeDataValueArr.sort((a, b) => b.toString().length - a.toString().length)[0];

            for (const i in treeData) {
                if (this.getType(treeData[i]) === "object") { //存在嵌套
                    const key = i.split("-###-")[0];
                    const childStr = foo(treeData[i], space + "    ");
                    if (isFirstKey) {
                        str += `${key}: {\n${childStr}}, \n`;
                        isFirstKey = false;
                    } else {
                        str += `${space}${key}: {\n${childStr}${space}}, \n`;
                    }
                } else {
                    const key = i.split("-###-")[0]; 
                    const comment = i.split("-###-")[1]; //参数值
                    const description = i.split("-###-")[2]; //是否必填
                    const type = i.split("-###-")[3];
                    const value = (type === "string" ? `"${treeData[i]}"` : treeData[i]) || "";
                    let valueLen = 0;
                    Array.from(value.toString()).forEach(val => {
                        if (val.charCodeAt() > 255) {
                            valueLen += 2;
                        } else {
                            valueLen++;
                        }
                    });
                    const currentLength = valueLen + key.toString().length + space.length;
                    const commentLength = (commentLen - currentLength > 0) ? (commentLen - currentLength) : 0;
                    if (isFirstKey) {
                        str += `${key}: ${value}, ${comment ? "//" + "-".repeat(commentLength) + comment + description : ""} \n`;
                        isFirstKey = false;
                    } else {
                        str += `${space}${key}: ${value}, ${comment ? "//" + "-".repeat(commentLength) + comment + description : ""} \n`;
                    }
                }
            }          
            return str;      
        };
        result = foo(treeData, space);
        return result;
    },
    //将参数转换为json格式
    convertParamsToJson(treeData, result) {
        for (let i = 0; i < treeData.length; i++) {
            if (treeData[i].key == null || treeData[i].key.trim() === "") { //跳过key值为空的数据
                continue;
            }
            if (treeData[i].children && treeData[i].children.length > 0) { //存在子数据则递归
                result[treeData[i].key] = {};
                this.convertParamsToJson(treeData[i].children, result[treeData[i].key]);
            } else { 
                const type = treeData[i].type;
                if (type === "number") {
                    result[treeData[i].key] = Number(treeData[i].value);
                } else if (type === "array") {
                    try {
                        result[treeData[i].key] = JSON.parse(treeData[i].value || "[]");
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    result[treeData[i].key] = treeData[i].value;
                }
            }
        }
    },

    /** 
     * @description        将自定义代码包装为可计算代码
     * @author              shuxiaokai
     * @create             2020-06-05 09:10
     * @param {String}     fnName - 可执行函数名称       
     * @param {String}     code - 自定义代码       
     */

    packingCodeToFcCode(fnName, code) {
        const executableCode = `
            exports.handler = (event, context, callback) => {
                try {
                    ${code}
                    callback(null, ${fnName}());
                }catch(e) {
                    callback(null, e.stack);
                } 
            }
        `;
        return executableCode;
    },

    /** 
        @description  将数组对象[{id: 1}]根据指定的key值进行去重,key值对应的数组元素不存在则直接过滤掉，若不传入id则默认按照set形式进行去重。
        @create       2019-11-20 22:40
        @update       2019-11-20 22:42
        @param  {array}  array 需要处理的数组     
        @param  {string?} key 指定对象数组的去重依据     
        @return {Array}  返回一个去重后的新数组，不会改变原数组   
        
        @example
            unique([{id: 1}, {id: 2}, {id: 1}], "id") => [{id: 1}, {id: 2}]
            unique([{id: 1}, {id: 2}, {id: 1}]) => [{id: 1}, {id: 2}, {id: 1}]
            unique([{id: 1}, {}, {id: 1}]) => [{id: 1}, {id: 2}, {id: 1}]
            unique([1, 2, 3, 4, 3, 3]) => [1, 2, 3, 4]
    */
   
    unique(array = [], key) {
        const result = [];
        if (key == null) { //不传key值直接进行简单去重处理
            return Array.from(new Set(array));
        } 
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i] == null) { //fix null undefined直接去除
                continue;
            }
            const isInResult = result.find(val => {
                return val[key] === array[i][key];
            });
            if (array[i][key] && !isInResult) {
                result.push(array[i]);
            }
        }
        return result;
    },

    /**
     * 获取用户信息
     */


};