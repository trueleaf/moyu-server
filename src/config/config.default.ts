import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/security/user';

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
        entities: [User],
      },
    },
  },
} as MidwayConfig;
