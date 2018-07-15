// controllers/user.js

var mongoose = require("mongoose");
var User = mongoose.model( 'User' );
var Project = mongoose.model( 'Project' );


exports.home = function(req, res) {
        res.render('home', {
            loginName: req.session.user.name
        });
    }

// GET logged in user page
exports.index = function (req, res) {
    // if(req.session.loggedIn === true){
        res.render('user-page', {
            title: req.session.user.name,
            name: req.session.user.name,
            loginName: req.session.user.name,
            email: req.session.user.email,
            userID: req.session.user._id
    });
    // } else {
    //    res.redirect('/login');
    // }
}


exports.create = function(req, res) {
    // console.log("******* session:", req.session)
    res.render('user-form', {
        title: 'Signup',
        name: "",
        email: "",                      
        buttonText: "Join!",
        message: req.flash('signupMessage'),
        method: 'post'
    });
};


// GET login page
exports.login = function (req, res) {
     res.render('login-form', { 
        title: 'Log in', 
        message: req.flash('loginMessage') 
    });
}


// GET user edit form
   exports.edit = function(req, res){
     // if (req.session.loggedIn !== true){
       // res.redirect('/login');
     // }else{
        res.render('user-form', {
            title: 'Edit profile',
            _id: req.session.user._id,
            name: req.session.user.name,
            loginName: req.session.user.name,
            email: req.session.user.email,
            buttonText: "Save",
            method: 'put'
    });
  // }
};

exports.doEdit = function(req, res) {
    if (req.session.user._id) {
        User.findById( req.session.user._id,
            function (err, user) {
                doEditSave (req, res, err, user);
            });
    }
};

 var doEditSave = function(req, res, err, user) {
        if(err){
            console.log(err);
            res.redirect( '/user?error=finding');
        } else {
            user.name = req.body.name;
            user.password = user.generateHash(req.body.password);
            user.email = req.body.email;
            user.modifiedOn = Date.now();

            user.save(function (err, user) {
                onEditSave (req, res, err, user);
        });
    }
};

var onEditSave = function (req, res, err, user) {
    if(err){
        console.log(err);
        if (err.code === 11000) {
            res.render('user-form', {
                message: 'That email address is already taken',
                title: 'Edit profile',
                _id: req.session.user._id,
                name: req.session.user.name,
                loginName: req.session.user.name,
                email: req.session.user.email,
                buttonText: "Save" })
        } else { 
                res.redirect( '/user?error=saving');
        }
    } else {
       console.log('User updated: ' + req.body.name);
       req.session.user.name = req.body.name;
       req.session.user.email = req.body.email;
       res.redirect( '/user' );
    } 
};

// GET user delete confirmation form
exports.confirmDelete = function(req, res){
    res.render('user-delete-form', {
        title: 'Delete account',
        _id: req.session.user._id,
        name: req.session.user.name,
        loginName: req.session.user.name,
        email: req.session.user.email
    }); 
 };

 // POST user delete form
exports.doDelete = function(req, res) {
        console.log(req.body._id);
    if (req.body._id) {
        User.findByIdAndRemove(
            req.body._id,
            function (err, user) {
                if(err){
                    console.log(err);
                    return res.redirect('/user?error=deleting');
            }
            console.log("User deleted:", user);
            deleteUserBlog(req.body._id);
            clearSession(req.session, function() {
                res.redirect('/');
            });
        });
    } 
};

var clearSession = function(session, callback){
    session.destroy();   // works w/'session-express'
    // session = null;  // This will remove the session data
    // delete session.user;  // This will remove the session data
    callback();
};

 var deleteUserBlog = function(userID) {
    if(userID) {
        Project.remove({"createdBy": userID},
            function(err, project) {
                if(err) {
                    console.log('Error blog removal failed for userID: ' + userID);
                } else {
                    console.log('Blogs removed for userID: ' + userID);
                }
            } );
    } else {
        console.log('No userID passed into function deleteUserBlog')
    }
 };

// GET user log out confirmation form
   exports.confirmLogout = function(req, res){
    res.render('user-logout-form', {
        title: 'Logout',
        _id: req.session.user._id,
        name: req.session.user.name,
        loginName: req.session.user.name,
        email: req.session.user.email
    }); 
 };

// Logout User
exports.doLogout = function(req, res) {
    clearSession(req.session, function() {
        res.redirect('/');
    });
};
