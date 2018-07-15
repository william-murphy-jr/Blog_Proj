// controllers/home.js

var mongoose = require("mongoose");
var User = mongoose.model( 'User' );
var Project = mongoose.model( 'Project' );

exports.index = function(req, res) {

    if (req.session.user !== undefined){

        res.render('home', {
            loginName: req.session.user.name
        });        
    } 
    
    res.render('home', {});
    
};

exports.homeUsers = function(req, res) {
    var user
    var tempUser = {}, tempSingleBlog = {}, tempBlogs = [], results = [];
    // var allBlogs;
    User.find({},
        function(err, user) {
            if(err) {
                console.log("error finding all bloggers");
            } else {
                res.json(user);
            } // else
        }
    ); // User
};

exports.homeBlogs = function(req, res) {
    Project.find({ "createdBy": req.params.userid }, 
        function(err, project) {
            if (err) {
                console.log('There was an error finding user blogs.',err);
            } else {
                if (project[0]){
                    var name = project[0].name;
                }
                res.json(project);
            }
        }
    ).sort({modifiedOn: -1}).limit(5);
};

exports.findBlogger = function(req, res) {
    // console.log('In find', req.params.userid);
    Project.find({ "createdBy": req.params.userid }, {}, {sort: '-modifiedOn'},
        function(err, project) {
            if (err) {
                console.log('There was an error finding user blogs.',err);
            } else {
                if (project[0]){
                    var name = project[0].name;
                }
                if (req.session.user) {
                    res.render('blogs', {
                        name: name,
                        loginName: req.session.user.name,
                        blogs: project
                    });                                        
                } else {
                    res.render('blogs', {
                        name: name,
                        // loginName: req.session.user.name,
                        blogs: project
                    });
                }
            }
        }
    );
};

exports.displayBlog = function(req, res) {
    // console.log('In displayBlog');
    Project.findById({_id: req.params.blogid},
        function(err, project) {
            if (err) {
                console.log('error finding individual blog');
            } else {
                // console.log('blog-page "project": ', project);
                console.log('blog-page "project.createdBy": ', project.createdBy);

                var lastModified =  project.modifiedOn ? project.modifiedOn : project.createdOn;
                        project.lastModified = new Date(lastModified.toString()); 
                // if (req.session.user.name === undefined) loginNam

                if (req.session.user){
                    console.log('req.session.user:', req.session.user);
                    res.render('blog-page', {
                        name: project.name,
                        loginName: req.session.user.name,
                        blog: project.tasks,
                        lastModified: project.lastModified,
                        comments: project.comments,
                        _bloggerId: project.createdBy,
                        _id: project._id

                    });                    
                } else {
                        res.render('blog-page', {
                        name: project.name,
                        // loginName: req.session.user.name,
                        blog: project.tasks,
                        lastModified: project.lastModified,
                        comments: project.comments,
                        _bloggerId: project.createdBy,
                        _id: project._id

                    }); 

                }

            }

    })
};




