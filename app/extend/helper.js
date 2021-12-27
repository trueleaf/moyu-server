/** 
    @description  工具函数
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/
const { v4: uuidv4 } = require("uuid")
function generateAstInfo() {
    return {
        id: "",
        indent: 4, //缩进
        line: 0, //行号
        path: { //键
            value: "", //值
            widthQuote: true, //是否存在双引号
        },
        value: "", //值
        valueType: "", //值类型
        colon: "", //冒号
        comma: "", //逗号
        description: "", //备注信息
        required: true, //是否必填
        leftCurlBrace: { //左花括号
            pairId: "", //与之相匹配的另一个括号id
            value: "", //值
        },
        rightCurlBrace: { //右花括号
            pairId: "", //与之相匹配的另一个括号id
            value: "", //值
        },
        leftBracket: { //左中括号
            pairId: "", //与之相匹配的另一个括号id
            value: "", //值
        },
        rightBracket: { //右中括号
            pairId: "", //与之相匹配的另一个括号id
            value: "", //值
        },
    };
}
function getUuid() {
    return uuidv4();
}

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
        if (error.name === "TokenExpiredError") { //jwt过期
            this.ctx.body = {
                code: 4100,
                msg: error.message,
            };
            return;
        }
        if (error.name === "proxyError") { //代理错误
            this.ctx.body = {
                code: 4200,
                msg: error.message,
            };
            return
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
     * @description        深度优先遍历数组
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-01-31 17:14
     * @update             2020-01-31 17:14
     * @param {Array}      forestData - 数据(森林结构)       
     * @return {null}     无返回值
     */

    dfsForest(forestData, fn, options = {}) {
        if (!Array.isArray(forestData)) {
            throw new Error("第一个参数必须为数组类型");
        }
        const childrenKey = options.childrenKey || "children";
        const foo = (forestData, hook, level) => {
            for (let i = 0; i < forestData.length; i += 1) {
                const currentData = forestData[i];
                hook(currentData, level);
                if (!currentData[childrenKey]) {
                    continue;
                }
                if (!Array.isArray(currentData[childrenKey])) {
                    continue;
                }
                if ((currentData[childrenKey]).length > 0) {
                    foo(currentData[childrenKey], hook, level + 1);
                }
            }
        };
        foo(forestData, fn, 1);
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
     * 将扁平数据转换为嵌套结构
     * [{id: 1, pid: ""}, {id: 2, pid: 1}, {id: 3, pid: 1}]
     */
    buildTree(array = [], options = {}) {
        const id = options.id || "_id";
        const pid = options.pid || "pid";
        const temp = new Map();
        const result = [];
        array.forEach(item => {
            if (!item.children) {
                item.children = [];
            }
            temp.set(item[id].toString(), item)
        })
        array.forEach(item => {
            if (!item[pid]) { //根元素
                result.push(item);
            } else {
                const parent = temp.get(item.pid);
                parent.children.push(item)
            }
        })
        return result;
    },

    /**
     * 参数数组转换为json结构
     */
     astJson(data, indent = 8) {
        if (!Array.isArray(data)) {
            return [];
        }
        const result = [];
        const foo = (arrayData, level, deepth, parent) => {
            const parentIsArray = (parent && parent.type === "array");
            for (let i = 0; i < arrayData.length; i += 1) {
                const item = arrayData[i];
                const itemValue = item.value;
                const itemType = item.type;
                const hasItemValue = (itemType === "string" && item.value != null) || item.value; //字符串可以为空""
                const itemPath = item.key;
                const isObject = itemType === "object";
                const isArray = itemType === "array";
                const objectHasValue = (isObject && item.children.length > 0);
                const arrayHasValue = (isArray && item.children.length > 0 && item.children.some((val) => val.key !== "" || val.value !== "" || val.type === "object"));
                const isSimpleType = ((itemType === "string") || (itemType === "boolean") || (itemType === "number") || (itemType === "file"));
                const astInfo = generateAstInfo();
                astInfo.id = item._id;
                if (isSimpleType && !itemValue && !itemPath) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                astInfo.description = item.description;
                astInfo.required = item.required;
                if (isSimpleType) { //简单类型数据 x: 1
                    astInfo.indent = indent * level;
                    astInfo.path.value = itemPath;
                    astInfo.colon = parentIsArray ? "" : ":";
                    // astInfo.value = itemType === "string" ? `"${itemValue}"` : itemValue;
                    if (hasItemValue && itemType === "string") {
                        astInfo.value = `"${itemValue}"`;
                    } else if (hasItemValue && itemType !== "string") {
                        astInfo.value = itemValue;
                    } else {
                        astInfo.value = item.type.replace(/./, ($1) => $1.toUpperCase())
                    }
                    astInfo.valueType = itemType;
                    astInfo.comma = ",";
                    result.push(astInfo);
                    // wordNum += 1;
                } else if (isObject && !objectHasValue) { //对象类型并且子元素无值 x: {}
                    if (level !== 0) {
                        astInfo.path.value = itemPath;
                        astInfo.colon = ":";
                        astInfo.comma = ",";
                    }
                    const uuid = getUuid();
                    astInfo.leftCurlBrace.pairId = uuid;
                    astInfo.leftCurlBrace.value = "{";
                    astInfo.rightCurlBrace.value = "}";
                    astInfo.rightCurlBrace.pairId = uuid;
                    astInfo.indent = indent * level;
                    result.push(astInfo);
                    // wordNum += 1;
                } else if (isObject && objectHasValue) { //对象类型并且子元素有值 x: {
                    if (level !== 0) {
                        astInfo.path.value = itemPath;
                        astInfo.colon = itemPath ? ":" : ""; //无key值代表父元素为数组类型
                    }
                    const uuid = getUuid();
                    const rightCurlyBraceInfo = generateAstInfo();
                    astInfo.leftCurlBrace.pairId = uuid;
                    astInfo.leftCurlBrace.value = "{";
                    astInfo.indent = indent * level;
                    result.push(astInfo);
                    foo(item.children, level + 1, deepth + 1, item);
                    rightCurlyBraceInfo.indent = indent * level;
                    rightCurlyBraceInfo.rightCurlBrace.value = "}";
                    rightCurlyBraceInfo.comma = ",";
                    rightCurlyBraceInfo.rightCurlBrace.pairId = uuid;
                    result.push(rightCurlyBraceInfo);
                    // wordNum += 1;
                } else if (isArray && !arrayHasValue) { //数组类型并且子元素无值  x: [],
                    if (level !== 0) {
                        astInfo.path.value = itemPath;
                        astInfo.colon = ":";
                    }
                    const uuid = getUuid();
                    // astInfo.path.value = itemPath;
                    astInfo.leftBracket.pairId = uuid;
                    // astInfo.colon = ":";
                    astInfo.leftBracket.value = "[";
                    astInfo.rightBracket.value = "]";
                    astInfo.rightBracket.pairId = uuid;
                    astInfo.indent = indent * level;
                    result.push(astInfo);
                    // wordNum += 1;
                } else if (isArray && arrayHasValue) { //数组类型并且子元素有值 x: [
                    if (level !== 0) {
                        astInfo.path.value = itemPath;
                        astInfo.colon = ":";
                    }
                    if (parentIsArray) {
                        astInfo.colon = ""; //父元素为array，则不显示：
                    }
                    const uuid = getUuid();
                    const currentLevel = indent * level;
                    const rightBracketInfo = generateAstInfo();
                    // astInfo.path.value = itemPath;
                    astInfo.leftBracket.value = "[";
                    astInfo.leftBracket.pairId = uuid;
                    astInfo.indent = currentLevel;
                    // astInfo.colon = ":";
                    result.push(astInfo);
                    foo(item.children, level + 1, deepth + 1, item);
                    rightBracketInfo.indent = currentLevel;
                    rightBracketInfo.rightBracket.value = "]";
                    rightBracketInfo.rightBracket.pairId = uuid;
                    rightBracketInfo.comma = ",";
                    result.push(rightBracketInfo);
                    // wordNum += 1;
                }
            }
        }
        foo(data, 1, 1, null);
        result.forEach((astItem, index) => {
            astItem.line = index + 1;
        });
        const strResult = [];
        for(let i = 0; i < result.length; i ++) {
            const item = result[i];
            let str = "";
            str += " ".repeat(item.indent);
            if (item.path.value) { //键
                str += item.path.value;
            }
            if (item.colon) { //键值对之间符号
                str += item.colon + " ";
            }
            if (item.leftCurlBrace.value) { //左花括号
                str += item.leftCurlBrace.value;
            }
            if (item.value) { //值
                str += item.value;
            }
            if (item.comma && !item.rightCurlBrace.value) { //末尾逗号
                str += item.comma;
            }
            if (item.description) { //备注
                str += " //" + item.description;
            }
            if (item.rightCurlBrace.value) { //右花括号
                str += item.rightCurlBrace.value;
            }
            strResult.push(str)
        }
        // console.log(strResult)

        return strResult;
    }
};