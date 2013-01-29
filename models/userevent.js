var mongoose = require('mongoose');

var schemaUserevent = new mongoose.Schema({
	username: String
	, eventtype: String
	, date: { type: Date, default: Date.now }
});

schemaUserevent.index({username: 1});

exports.Userevent = function(db) {
	return db.model('UserEvent', schemaUserevent);
}