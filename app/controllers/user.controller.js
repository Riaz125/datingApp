const User = require('../models/user.model.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

exports.indexPage = function(req, res){
  return res.render('index', {title: 'Login'});
},

exports.getSignUp = function(req, res){
  return res.render('signup', {title: 'SignUp'});
},

exports.signUp = function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	if(req.file){
		console.log('Uploading File...');
		var profileimage = req.file.filename;
	} else {
		console.log('No File Uploaded...');
		var profileimage = 'noimage.jpg';
	}

	// Form Validator
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check Errors
	var errors = req.validationErrors();
  console.log(errors);

    if(user){
      return done(null, false, req.flash('error', 'User with email already exists'));
    }

  	if(errors){
  		res.render('signup',
      {message: req.flash('alert-danger', 'Please fill out all of the information.')});
  	}	else{
  		console.log('No Errors');
  		var newUser = new User({
  			name: name,
  			email: email,
  			username: username,
  			password: password,
  			profileimage: profileimage,
  			secretToken: "",
  			active: false,
  			age: "",
  			height: "",
  			politics: "",
  			social: ""
  		});

      User.createUser(newUser, function(error, user){
        if(error) {
  				res.render('signup',
  				{message: req.flash('alert-danger', 'Email or Username already taken')});
  			} else {
  				res.render('index', {message: req.flash('success', 'You are now registered and can login')});
  		}});
  		}
  	};

exports.getLogin = function(req, res, next) {
    res.render('login', {title:'Login'});
};

exports.login = passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
  function(req, res, next) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
    global.name2 = req.body.username;
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown User'});
		}

		User.comparePassword(password, user.password, function(err,isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid Password'});
			}
		});
	});
}));
