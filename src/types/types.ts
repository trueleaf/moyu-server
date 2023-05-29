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
};
