/** 
    @description  项目model
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/

module.exports = app => {
	const mongoose = app.mongoose;
	const Schema = mongoose.Schema;
	// const membersSchema = new Schema();

	const ProjectSchema = new Schema({
		projectName: {
			required: [true, "请正确输入项目名称"],
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 30
		},
		projectType: {
			type: String,
			trim: true,
			minlength: 1,
			maxlength: 30
		},
		remark: {
			type: String,
			trim: true,
			maxlength: 255,
			default: ""
		},
		docNum: {
			type: Number,
			default: 0,
		},
		enabled: { //使能
			type: Boolean,
			default: true,
		},
		owner: { //创建者
			id: {
				type: String, //用户id
			},
			name: {
				type: String, //用户名称
			}
		},
		members: [{ //成员信息
			userId: {
				type: String,
				required: true
			},
			loginName: { //登录名称(冗余字段)
				type: String,
				default: ""
			},
			realName: { //真实姓名(冗余字段)
				type: String,
				default: ""
			},
			permission: {
				type: String,
				required: true,
				enum: ["readOnly", "readAndWrite", "admin"], //可读，读写，管理员
			}
		}]
	}, {
		timestamps: true,
	});
	return mongoose.model("project", ProjectSchema);
};
