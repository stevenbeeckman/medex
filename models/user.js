var mongoose = require('mongoose')
	, crypto = require('crypto');

/* ----------- User -------------- */
var schemaUser = new mongoose.Schema({
	username: String
	, email: String
	, hash: String
	, salt: String
	, created: { type: Date, default: Date.now }
	, createdBy: String
});

schemaUser.index({username: 1}, {unique: true});

schemaUser.virtual("id").get(function() { 
	return this._id.toHexString();
});

schemaUser.virtual("password").get(function() {
	return this._password;
});

schemaUser.virtual("password").set(function(password) {
	console.log("password: " + password);
	this._password = password;
	this.salt = this.makeSalt();
	this.hash = this.encryptPassword(password);
});

schemaUser.methods.authenticate = function(plainText) {
	return this.encryptPassword(plainText) === this.hash;
};

schemaUser.methods.makeSalt = function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
};


schemaUser.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schemaUser.methods.isValid = function() {
	// TODO: Better validation
	console.log("Validating user:");
	console.log("this.email: " + this.email);
	console.log("this.email.length: " + this.email.length);
	console.log("this.password: " + this.password);
	console.log("this.password.length: " + this.password.length);
	return this.email && this.email.length > 0 && this.email.length < 255
	 && this.password && this.password.length > 0 && this.password.length < 255;
};

schemaUser.statics.classicLogin = function(account, pass, cb) {
	if( account && pass ) {
		mongoose.models.User
			.where( 'username', account)
			.where( 'hash', schemaUser.methods.encryptPassword(pass))
			.findOne(cb);
	}
}

exports.User = function(db) {
	return db.model('User', schemaUser);
}