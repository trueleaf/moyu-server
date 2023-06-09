import { ObjectId } from 'mongoose';
import { User } from '../entity/security/user';

/**
 * 全局配置
 */
export type GlobalConfig = {
  smsConfig: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: string;
    RegionId: string;
    SignName: string;
    templateCode: string;
    maxAge: number;
  };
  //业务参数
  apiflow: {
    /**
     * 用户注册默认密码
     */
    defaultRegisterPassword: string;
  };
  //jwt相关配置
  jwtConfig: {
    /**
     * 私钥
     */
    secretOrPrivateKey: string;
    /**
     * 过期时间
     */
    expiresIn: number;
  };
  permission: {
    /**
     * 接口白名单，不需要权限验证
     */
    whiteList: string[];
    /**
     * free模式无权限验证(互联网环境不安全!!!)
     */
    isFree: boolean;
  };
  security: {
    /**
     * 是否严格限制密码格式
     */
    strictPassword: boolean;
    /**
     * 初始化&新增用户默认密码
     */
    defaultUserPassword: string;
  };
};

/**
 * 用户信息，登录以后塞入token里面
 */
export type LoginTokenInfo = {
  id: ObjectId;
  roleIds: User['roleIds'];
  loginName: User['loginName'];
  realName: User['realName'];
  phone: User['phone'];
  token: string;
};
