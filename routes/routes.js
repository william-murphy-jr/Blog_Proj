// routes/routes.js 

var home = require('../controllers/home');
var search = require('../controllers/search');
var user = require('../controllers/user');
var project = require('../controllers/project');


module.exports = function(app, passport) {

	// USER ROUTES
	app.get('/', home.index);
    app.get('/home/find/:userid', home.findBlogger);
    app.get('/homeUsers', home.homeUsers);
    app.get('/homeUsers/:userid', home.homeBlogs);
    app.get('/home/blog/:blogid', home.displayBlog);

    app.post('/search', search.doSearch);

	app.get('/user', isLoggedIn, user.index);   // Current user profile
	app.get('/user/new', user.create);          // Create new user form

    app.post('/user/new', passport.authenticate('local-signup', {
        successRedirect : '/user', // redirect to the secure profile section
        failureRedirect : '/user/new', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));	

    // app.post('/user/new', user.doCreate);              // Create new user action
	app.get('/user/edit', isLoggedIn, user.edit);         // Edit current user form
	app.put('/user/edit', isLoggedIn, user.doEdit);       // Edit current user action
	app.get('/user/delete', isLoggedIn, user.confirmDelete);    // delete current user form
	app.delete('/user/delete', isLoggedIn, user.doDelete);      // Delete current user action

	app.get('/login', user.login);              // Login form

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/user',  // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true         // allow flash messages
    }));

    	// app.post('/login', isLoggedIn, user.doLogin);    // Login action
	app.get('/logout', isLoggedIn, user.confirmLogout);     // Confirm logout of current user
	app.post('/logout', isLoggedIn, user.doLogout);         // Logout current user

	// PROJECT/BLOG ROUTES
	app.get('/project/new', isLoggedIn, project.create);
	app.post('/project/new', isLoggedIn, project.doCreate);
	app.get('/project/byuser/:userid', isLoggedIn, project.byUser); // Projects Created by a user 
    app.get('/project/:id', isLoggedIn, project.displayInfo);       // Display project info 
    app.get('/project/:id/comment/new', isLoggedIn, project.commentCreate);       // Display project comment
    app.post('/project/:id/comment/new', isLoggedIn, project.commentDoCreate);       // Display project comment
    app.get('/project/:id/comment/edit/:comment_id', isLoggedIn, project.commentDoCreate);       // Display project comment
    // app.post('/project/:id/comment/edit/:comment_id', isLoggedIn, project.commentDoCreate);       // Display project comment
	app.get('/project/edit/:id', isLoggedIn, project.edit);    // Edit selected project form
	app.put('/project/edit/:id', isLoggedIn, project.doEdit);  // Edit selected project action
	app.get('/project/delete/:id', isLoggedIn, project.confirmDelete); // Delete selected
	                                                                   // product form
	app.delete('/project/delete/:id', isLoggedIn, project.doDelete);   // Delete
	// app.post('/project/delete/:id', isLoggedIn, project.doDelete);  // Delete
	                                                                   //selected project action
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


