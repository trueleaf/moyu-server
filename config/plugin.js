/**
 * @Description: 
 * @author: bubao
 * @Date: 2021-08-01 12:04:47
 * @LastEditors: bubao
 * @LastEditTime: 2021-08-01 14:09:28
 */

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
