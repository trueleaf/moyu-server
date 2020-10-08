"use strict";

/** @type Egg.EggPlugin */
module.exports = {
    // mongoose
    mongoose: {
        enable: true,
        package: "egg-mongoose"
    },
    // 参数校验
    validate: {
        enable: true,
        package: "egg-validate"
    },
    // 跨域
    cors: {
        enable: true,
        package: "egg-cors"
    },
};
