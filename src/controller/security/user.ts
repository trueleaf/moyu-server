import {
  Inject,
  Controller,
  Get,
  Post,
  Query,
  SetHeader,
  Body,
  Put,
  Del,
  Files,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  AddLastVisitedDto,
  AddUserDto,
  ChangePasswordByUserDto,
  ChangeUserInfoDto,
  ChangeUserStateDto,
  DisableUserDto,
  GetUserInfoByIdDto,
  GetUserListByNameDto,
  GetUserListDto,
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterByPhoneDto,
  ResetPasswordDto,
  SMSDto,
  StarProjectDto,
  SvgCaptchaDto,
  UnStarProjectDto,
} from '../../types/dto/security/user.dto';
import { UserService } from '../../service/security/user';
import * as svgCaptcha from 'svg-captcha';
import { UploadFileInfo } from '@midwayjs/upload';
import { throwError } from '../../utils/utils';

@Controller('/api')
export class UserController {
  @Inject()
    ctx: Context;

  @Inject()
    userService: UserService;

  /**
   * 获取手机验证码
   */
  @Get('/security/sms')
  async getSMSCode(@Query() params: SMSDto) {
    const data = await this.userService.getSMSCode(params);
    return data;
  }
  /**
   * 获取图形验证码
   */
  @Get('/security/captcha')
  @SetHeader('content-type', 'image/svg+xml')
  async getSVGCaptcha(@Query() params: SvgCaptchaDto) {
    const captcha = svgCaptcha.create({
      width: params.width,
      height: params.height,
    });
    return captcha.data;
  }
  /**
   * 手机号用户注册
   */
  @Post('/security/register')
  async registerByPhone(@Body() params: RegisterByPhoneDto) {
    const data = await this.userService.registerByPhone(params);
    return data;
  }
  /**
   * 根据账号密码登录
   */
  @Post('/security/login_password')
  async loginByPassword(@Body() params: LoginByPasswordDto) {
    const data = await this.userService.loginByPassword(params);
    return data;
  }
  /**
   * 根据手机号码登录
   */
  @Post('/security/login_phone')
  async loginByPhone(@Body() params: LoginByPhoneDto) {
    const data = await this.userService.loginByPhone(params);
    return data;
  }
  /**
   * 修改密码(用户主动修改)
   */
  @Put('/security/user_password')
  async changePasswordByUser(@Body() params: ChangePasswordByUserDto) {
    const data = await this.userService.changePasswordByUser(params);
    return data;
  }
  /**
   * 批量禁用用户
   */
  @Del('/security/delete_user')
  async disableUser(@Body() params: DisableUserDto) {
    const data = await this.userService.disableUser(params);
    return data;
  }
  /**
   * 管理员重置密码
   */
  @Put('/security/reset_password')
  async resetPasswordByAdmin(@Body() params: ResetPasswordDto) {
    const data = await this.userService.resetPasswordByAdmin(params);
    return data;
  }
  /**
   * 手动添加用户
   */
  @Post('/security/useradd')
  async addUser(@Body() params: AddUserDto) {
    const data = await this.userService.addUser(params);
    return data;
  }
  /**
   * 获取用户列表
   */
  @Get('/security/user_list')
  async getUserList(@Query() params: GetUserListDto) {
    const data = await this.userService.getUserList(params);
    return data;
  }
  /**
   * 禁用启用用户
   */
  @Put('/security/user_state')
  async changeUserState(@Body() params: ChangeUserStateDto) {
    const data = await this.userService.changeUserState(params);
    return data;
  }
  /**
   * 根据用户id获取用户信息
   */
  @Get('/security/user_info_by_id')
  async getUserInfoById(@Query() params: GetUserInfoByIdDto) {
    const data = await this.userService.getUserInfoById(params);
    return data;
  }
  /**
   * 获取自身登录用户信息
   */
  @Get('/security/user_info')
  async getLoggedInUserInfo() {
    const data = await this.userService.getLoggedInUserInfo();
    return data;
  }
  /**
   * 根据用户名称查询用户列表
   */
  @Get('/security/userListByName')
  async getUserListByName(@Query() params: GetUserListByNameDto) {
    const data = await this.userService.getUserListByName(params);
    return data;
  }
  /**
   * 改变用户权限，手机号，登录名称，真实姓名
   */
  @Put('/security/user_permission')
  async changeUserInfo(@Body() params: ChangeUserInfoDto) {
    const data = await this.userService.changeUserInfo(params);
    return data;
  }
  /**
   * 下载用户批量导入模板
   */
  @Get('/security/user_excel_template')
  async getBatchUserImportTemplate() {
    const data = await this.userService.getBatchUserImportTemplate();
    return data;
  }
  /**
   * 访客登录(默认创建一个固定密码的用户)
   */
  @Post('/security/login_guest')
  async guestLogin() {
    const data = await this.userService.guestLogin();
    return data;
  }
  /**
   * 通过excel批量导入用户
   */
  @Post('/security/add_user_by_excel')
  async addUserByExcel(@Files() files: UploadFileInfo<string>[]) {
    if (files?.length === 0) {
      throwError(1006, '文件格式不正确');
    }
    if (files?.[0].mimeType !== 'application/vnd.ms-excel' && files?.[0].mimeType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throwError(1006, '文件格式不正确');
    }
    const data = await this.userService.addUserByExcel(files[0]);
    return data;
  }
  /**
   * 添加最近访问页面
   */
  @Put('/project/visited')
  async addLastVisited(@Body() params: AddLastVisitedDto) {
    const data = await this.userService.addLastVisited(params);
    return data;
  }
  /**
   * 收藏项目
   */
  @Put('/project/star')
  async starProject(@Body() params: StarProjectDto) {
    const data = await this.userService.starProject(params);
    return data;
  }
  /**
   * 取消收藏项目
   */
  @Put('/project/unstar')
  async unStarProject(@Body() params: UnStarProjectDto) {
    const data = await this.userService.unStarProject(params);
    return data;
  }
}
