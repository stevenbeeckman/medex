/*
 * GET admin.
 */

var User
	, DeathRegistration;

exports.admin = function(req, res){
	res.redirect('/admin/deaths');
	/*
	var u, d;
	User = require('../models/user').User(req.db);
	DeathRegistration = require('../models/deathregistration').DeathRegistration(req.db);
	User.find(function(err, us) {
		if(err){
			console.dir(err);
		}else{
			u = us;
			DeathRegistration.find({}, null, {sort: {date: -1}}, function(errd, deaths) {
				if(errd){
					console.dir(errd);
				} else {
					d = deaths;
					console.log("Rendering /admin for " + req.user.username);
					res.render('admin/index', { title: 'Admin page', users: u, deaths: d, user: req.user.username });
				}
			});		
		}
	});*/
};

// create session
exports.login = function(req, res){
	//res.render('admin/login', {Log in});
	console.log('Created session.');
};

// destroy session
exports.logout = function(req, res){
	console.log('Destroyed session.');
};

/* ******* USERS ************* */

exports.users = function(req, res){
	// show page with users, include ajax "add user functionality"
	if(typeof req.user.username == "undefined"){
		res.redirect('/login');
	}
	var u;
	User = require('../models/user').User(req.db);
	User.find(function(err, us) {
		if(err){
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		}else{
			u = us;
			console.log("Rendering /admin/users for " + req.user.username);
			res.render('admin/users', {title: 'Users', users: u, user: req.user.username});
		}
	});
};

exports.addUser = function(req, res){
	console.dir(req.body);
	console.log("username: " + req.body.username);
	console.log("email: " + req.body.email);
	console.log("password: " + req.body.password);
	var user = new Object();
	user.username = req.body.username;
	user.email = req.body.email;
	user.password = req.body.password;
	user.twitter = req.body.twitter;
	user.facebook = req.body.facebook;
	user.createdBy = req.user.username;
	User = require('../models/user').User(req.db);
	var u = new User(user);
	u.save(function(err, us) {
		if(err){
			console.log(req.user.username + " tried adding user " + user.username + " but there was an error.");
			console.log("This was the user which should have been added:");
			console.dir(user);
			console.log("And this is the error message:");
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			// no error
			console.log(req.user.username + " added user " + user.username);
			console.dir(user);

			res.json(user);
		}
	});
	
}

exports.addUserView = function(req, res){
	res.render('admin/user/add', {title: 'Add user', user: req.user.username});
};
exports.addUserPersist = function(req, res){
	var user = new Object();
	user.username = req.body.username;
	user.email = req.body.email;
	user.password = req.body.password;
	user.twitter = req.body.twitter;
	user.facebook = req.body.facebook;
	user.createdBy = req.user.username;
	User = require('../models/user').User(req.db);
	var u = new User(user);
	u.save(function(err, us) {
		if(err){
			console.log(req.user.username + " tried adding user " + user.username + " but there was an error.");
			console.log("This was the user which should have been added:");
			console.dir(user);
			console.log("And this is the error message:");
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			// no error
			console.log(req.user.username + " added user " + user.username);
			console.dir(user);

			res.redirect("/admin/user/" + user.username);
		}
	});
};
exports.viewUser = function(req, res){
	var u;
	User = require('../models/user').User(req.db);
	console.log(req.user.username + " wants to view user " + req.params.username);
	User.findOne({username: req.params.username}, function(err, foundUser){
		if(err) {
			console.log("An error occured: ");
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			console.log("Found user " + foundUser.username);
			u = foundUser;
			console.dir(u);
			res.render('admin/user/view', {title: 'View user', user: req.user.username, requestedUser: u});
		}
	});
};
exports.editUserView = function(req, res){
	var u;
	User = require('../models/user').User(req.db);
	console.log(req.user.username + " wants to view user " + req.params.username);
	User.findOne({username: req.params.username}, function(err, foundUser){
		if(err) {
			console.log("An error occured: ");
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			console.log("Found user " + foundUser.username);
			u = foundUser;
			console.dir(u);
			res.render('admin/user/edit', {title: 'Edit user', user: req.user.username, requestedUser: u});
		}
	});

};
exports.editUserPersist = function(req, res){
	var user = new Object();
	user.username = req.body.username;
	user.email = req.body.email;
	user.password = req.body.password;
	user.createdBy = req.user.username;
	User = require('../models/user').User(req.db);
	User.findOne({username: user.username}, function(err, us) {
		if(err){
			console.log(req.user.username + " tried editing user " + user.username + " but there was an error.");
			console.log("This is the user which should have been saved:");
			console.dir(user);
			console.log("And this is the error message:");
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			// no error
			us.username = req.body.username;
			if(req.body.password){
				us.password = req.body.password;
			}
			us.email = req.body.email;
			us.createdBy = req.user.username;
			us.save(function(savingError, savedUser){
				if(savingError){
					console.log(req.user.username + " tried editing user " + user.username + " but there was an error.");
					console.log("This is the user which should have been saved:");
					console.dir(us);
					console.log("And this is the error message:");
					console.dir(savingError);
					res.render('admin/error', {title: "Error", user: req.user.username, error: err});
				} else {
					console.log(req.user.username + " edited user " + user.username + " to:");
					console.dir(user);
					console.log("This is the new version returned by the database:");
					console.dir(savedUser);


					res.redirect("/admin/user/" + user.username);
				}
			});
		}
	});
};
exports.deleteUserView = function(req, res){
	console.log(req.user.username + " wants to delete user " + req.params.username);
	res.render("admin/user/delete", {title: 'Delete user', user: req.user.username, requestedUser: req.params.username});

};
exports.deleteUserPersist = function(req, res){
	console.log(req.user.username + " confirmed wanting to delete user " + req.params.username);
	User = require('../models/user').User(req.db);
	User.findOneAndRemove({username: req.params.username}, function(err) {
		if(err){
			console.log("Something went wrong while deleting user " + req.params.username);
			console.dir(err);
			res.render('admin/error', {title: "Error", user: req.user.username, error: err});
		} else {
			console.log("User " + req.params.username + " removed from the database by " + req.user.username);
			res.redirect("/admin/users");
		}
	});

};