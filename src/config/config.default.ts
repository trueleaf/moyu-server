import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/security/user';
import { Sms } from '../entity/security/sms';
import { ClientMenu } from '../entity/security/client_menu';
import { Role } from '../entity/security/role';
import { ClientRoutes } from '../entity/security/client_routes';
import { ServerRoutes } from '../entity/security/server_routes';
import { LoginRecord } from '../entity/security/login_record';
import { Project } from '../entity/project/project';
import { ProjectVariable } from '../entity/project/project_variable';
import { ProjectCode } from '../entity/project/project_code';
import { Doc } from '../entity/doc/doc';
import { DocPrefix } from '../entity/doc/doc_prefix';
import { DocMindParams } from '../entity/doc/doc_mind_params';
import { ProjectShare } from '../entity/project/project_share';

export default {
  keys: 'apiflow',
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
        uri: 'mongodb://localhost:27017/apiflow',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: [
          User,
          Sms,
          ClientMenu,
          ClientRoutes,
          Role,
          ServerRoutes,
          LoginRecord,
          Project,
          ProjectVariable,
          ProjectCode,
          ProjectShare,
          Doc,
          DocPrefix,
          DocMindParams,
        ],
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
  jwtConfig: {
    secretOrPrivateKey: 'apiflow', //私钥
    expiresIn: `${1000 * 60 * 60 * 24 * 7}`, //过期时间
  },
  permission: {
    isFree: false,
    whiteList: [
      '/mock/image',
      '/mock',
      '/api/security/register',
      '/api/project/share',
      '/api/security/client_routes_multi',
      '/api/security/login_password',
      '/api/security/login_phone',
      '/api/security/sms',
      '/api/security/login_guest',
      '/api/security/captcha',
      '/api/project/doc_mock',
      '/api/project/share_info',
      '/api/project/share_check',
      '/api/project/export/share_banner',
      '/api/project/export/share_project_info',
      '/api/project/share_doc_detail',
    ],
  },
  security: {
    strictPassword: true,
    defaultUserPassword: '111111'
  },
  pagination: {
    max: 100,
  },
  upload: {
    whitelist: ['.xlsx']
  },
} as MidwayConfig;
