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
};
