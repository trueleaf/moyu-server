import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/security/user';
import { Sms } from '../entity/security/sms';
import { ClientMenu } from '../entity/security/client_menu';
import { Role } from '../entity/security/role';
import { ClientRoutes } from '../entity/security/client_routes';
import { ServerRoutes } from '../entity/security/server_routes';

export default {
  keys: '1683383633312_1890',
  session: {
    name: 'apiflow',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 3600 * 1000 * 30,
      httpOnly: true,
      sameSite: null,
    },
  },
  koa: {
    port: 7001,
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/test',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: [User, Sms, ClientMenu, ClientRoutes, Role, ServerRoutes],
      },
    },
  },
  validate: {
    errorStatus: 200,
  },
  smsConfig: {
    accessKeyId: '',
    accessKeySecret: '',
    endpoint: '',
    RegionId: '',
    SignName: '',
    templateCode: '',
    maxAge: 0,
  },
  apiflow: {
    defaultRegisterPassword: '111111',
  },
} as MidwayConfig;
