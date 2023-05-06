import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1683383633312_1890',
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
        entities: [],
      },
    },
  },
} as MidwayConfig;
