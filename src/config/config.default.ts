import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/security/user';
import { Sms } from '../entity/security/sms';
import { ClientMenu } from '../entity/security/client_menu';
import { Role } from '../entity/security/role';
import { ClientRoutes } from '../entity/security/client_routes';
import { ServerRoutes } from '../entity/security/server_routes';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1683383633312_1890',
  koa: {
    port: 7001,
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/moyu',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: [User, Sms, ClientMenu, ClientRoutes, Role, ServerRoutes],
      },
    },
  },
  smsConfig: {
    base: {
      //基础信息
      accessKeyId: '',
      accessKeySecret: '',
      endpoint: '',
      apiVersion: '2017-05-25',
    },
    template: {
      //模板配置
      RegionId: '',
      SignName: '',
      TemplateCode: '',
    },
    maxAge: 1000 * 60 * 5, //五分钟过期
  },
} as MidwayConfig;
