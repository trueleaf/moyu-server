/**
 * 全局配置
 */
export type GlobalConfig = {
  smsConfig: {
    base: {
      accessKeyId: string;
      accessKeySecret: string;
      endpoint: string;
      apiVersion: string;
    };
    template: {
      RegionId: string;
      SignName: string;
      TemplateCode: string;
    };
    maxAge: number;
  };
};
