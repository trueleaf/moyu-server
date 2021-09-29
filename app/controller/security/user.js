/* 
    @description  用户控制器
    @author       shuxiaokai
    @create       
*/

const Controller = require("egg").Controller;
const svgCaptcha = require("svg-captcha");
const fs = require("fs-extra");
const path = require("path");
const FileType = require("file-type");

class userController extends Controller {
    /** 
     * @description        获取短信验证码
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-03-15 20:40
     * @update             2020-03-15 20:40
     * @param {string}        String - 手机号码       
     */
    async getMsgCode(params) {
        try {
            const params = this.ctx.query;
            const reqRule = {
                phone: {
                    type: "string"
                }
            };
            this.ctx.validate(reqRule, params);

            const result = await this.ctx.service.security.user.getMsgCode(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        获取svg图形验证码
     * @author              shuxiaokai
     * @updateAuthor       shuxiaokai
     * @create             2020-03-15 20:40
     * @update             2020-03-15 20:40
     */
    async getSVGCaptcha(params) {
        try {
            const params = this.ctx.query;
            const reqRule = {
                width: {
                    type: "string",
                    required: false,
                    default: "100"
                },
                height: {
                    type: "string",
                    required: false,
                    default: "100"
                },
            };
            this.ctx.validate(reqRule, params);
            const captcha = svgCaptcha.create({
                width: params.width,
                height: params.height
            });
            this.ctx.session.captcha = captcha.text;
            this.ctx.set("content-type", "image/svg+xml");
            this.ctx.response.body = captcha.data;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  用户注册
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            loginName 登录名称
        @params {String}            realName 真实姓名
        @params {String}            phone 手机号码
        @params {String}            password 密码
        @params {String}            smsCode 验证码
        @return       null
    */

    async register() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                loginName: {
                    type: "string"
                },
                realName: {
                    type: "string",
                    required: false
                },
                password: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                smsCode: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.register(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        来宾用户登录
     * @author              shuxiaokai
     * @create             2020-09-21 14:22  
     * @return {String}    返回字符串
     */
    async loginGuest() {
        try {
            const params = {
                loginName: "guest" + "_" + Date.now().toString().slice(-8),
                password: "111111"
            };
            const result = await this.ctx.service.security.user.loginGuest(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        新增用户
     * @author              shuxiaokai
     * @create             2020-06-15 19:42
       @params {String}    loginName 登录名称
       @params {String}    realName 真实姓名
       @params {String}    phone 手机号码
       @params {Array<string>}  roleIds //角色ids
       @params {Array<string>}  roleNames //角色名称
     */

    async addUser() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                loginName: {
                    type: "string"
                },
                realName: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                roleIds: { 
                    type: "array",
                    itemType: "string",
                    required: false
                },
                roleNames: {
                    type: "array",
                    itemType: "string",
                    required: false
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.addUser(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  用户登录（用户名密码）
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            loginName 登录名称
        @params {String}            password 密码
        @params {String?}           captcha 验证码 3次登录错误以后出现
        @return       null
    */

    async loginWithPassword() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                loginName: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                captcha: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.loginWithPassword(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  用户登录（手机号验证码）
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}            phone 登录名称
        @params {String}            smsCode 密码
        @return       null
    */
    async loginWithPhone() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                phone: {
                    type: "string"
                },
                smsCode: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.loginWithPhone(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  忘记密码
        @author       shuxiaokai
        @create       2021-10-2 22:10
        @params {String}            phone 手机号
        @params {String}            smsCode 验证码
        @params {String}            password 密码
        @return       null
    */
    async resetPassword() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                phone: {
                    type: "string"
                },
                smsCode: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.resetPassword(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /* 
        @description  删除用户
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {Array<String>}            ids 
        @return       null
    */
    async deleteUser() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.deleteUser(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  修改用户权限
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}         _id 
        @params {String}         loginName 
        @params {String}         phone 
        @params {Array<string>}  roleIds //角色ids
        @params {Array<string>}  roleNames //角色名称
        @return       null
    */
    async changeUserPermission() {
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string"
                },
                loginName: {
                    type: "string"
                },
                phone: {
                    type: "string",
                    required: false,
                },
                realName: {
                    type: "string",
                    required: false,
                },
                roleIds: {
                    type: "array",
                    itemType: "string"
                },
                roleNames: {
                    type: "array",
                    itemType: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.changeUserPermission(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取用户
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String?}           loginName 登录名称
        @params {String?}           realName 真实姓名
        @params {String?}           phone 手机号码
        @params {String?}           title 职位
        @params {String?}           department 部门
        @params {Number?}           pageNum 当前页码
        @params {Number?}           pageSize 每页大小   
        @params {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @params {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @return       null
    */
    async getUserList() {
        try {
            const params = this.ctx.query;
            const reqRule = {
                loginName: {
                    type: "string",
                    required: false
                },
                realName: {
                    type: "string",
                    required: false
                },
                phone: {
                    type: "string",
                    required: false
                },
                title: {
                    type: "string",
                    required: false
                },
                department: {
                    type: "string",
                    required: false
                },
                pageNum: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                pageSize: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                startTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                endTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.getUserList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  修改用户状态
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @params {String}      _id 
        @params {Boolean}      enable 
        @return       null
    */
    async changeUserState() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                enable: {
                    type: "boolean"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.changeUserState(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        获取用户基本信息
     * @author              shuxiaokai
     * @create             2020-06-14 17:38
     */
    async getUserBaseInfo() { 
        try {
            const result = await this.ctx.service.security.user.getUserBaseInfo();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  通过用户id获取用户信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}           _id 用户id
        @return       null
    */
    async getUserInfoById() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                _id: { 
                    type: "string",
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.getUserInfoById(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  获取用户信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */
    async getUserInfo() { 
        try {
            const result = await this.ctx.service.security.user.getUserInfo();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  下载用户批量导入模板
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}            name 文档名称
        @return       null
    */
    async getUserExcelTemplate() {
        try {
            const fileName = "用户批量导入模板";
            const filePath = path.resolve(this.app.config.static.dir, `excel_template/${fileName}.xlsx`)
            const file = await fs.readFile(filePath);
            const fileType = await FileType.fromFile(filePath);
            this.ctx.set("content-type", fileType.mime);
            this.ctx.set("content-disposition", `attachment;filename=${encodeURIComponent(fileName)}`);
            this.ctx.body = file;
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  通过名称获取用户列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}     name 用户真实名称或者登录名
        @return       null
    */
    async getUserListByName() {
        try {
            const params = this.ctx.query;
            const reqRule = {
                name: { 
                    type: "string",
                    required: false
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.getUserListByName(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
        @description  通过excel批量导入用户信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */
    async addUserByExcel() {
        try {
            const files = this.ctx.request.files;
            const file = files[0];
            const fileType = file.mimeType;
            const filePath = file.filepath;
            if (fileType !== "application/vnd.ms-excel" && fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                this.ctx.helper.throwCustomError("文件格式不正确", 1006);
            }
            const result = await this.ctx.service.security.user.addUserByExcel({ filePath });
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        修改用户密码
     * @author              shuxiaokai
     * @create             2020-09-01 11:25
     * @param {String}     oldPassword - 原始密码       
     * @param {String}     newPassword - 新密码       
     * @return {null}      返回null
     */
    async changeUserPassword() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                oldPassword: {
                    type: "string",
                },
                newPassword: {
                    type: "string"
                }
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.changeUserPassword(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        添加最近访问页面
     * @author             shuxiaokai
     * @create             2020-12-18 16:41
     * @param {any}        projectId - 项目id       
     * @return {null}      返回null
     */
    async addLastVisit() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.addLastVisit(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        收藏项目
     * @author             shuxiaokai
     * @create             2020-12-18 16:41
     * @param {any}        projectId - 项目id       
     * @return {null}      返回null
     */
    async starProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.starProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
     * @description        取消收藏项目
     * @author             shuxiaokai
     * @create             2020-12-18 16:41
     * @param {any}        projectId - 项目id       
     * @return {null}      返回null
     */
    async unStarProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.security.user.unStarProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

}

module.exports = userController;
