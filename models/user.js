var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({

	unique_id: {
		type: Number,
	},
	name: {
		type: String,
		
	},
	email: {
		type: String,
		trim: true,
		lowercase: true
	},
	username: {
		type: String,
		trim: true
	},
	password: {
		type: String,
		trim: true
	},
	passwordConf: {
		type: String,
		trim: true
	},
	DateofBirth: {
		type: String,
	},
	role: {
		type: String
	},
	Address: {
		type: String,
	},
}),
	User = mongoose.model('User', userSchema);

module.exports = User;