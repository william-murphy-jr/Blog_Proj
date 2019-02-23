// controllers/project.js

var mongoose = require("mongoose");
var Project = mongoose.model( 'Project' );

// GET a project-form
exports.create = function(req, res) {
    res.render('project-form', {
        title: 'Create A New Blog',
        subtitle: '',
        name: req.session.user.name,
        loginName: req.session.user.name,
        email: req.session.user.email,
        projectName: "",
        tasks: "",
        // tasks: "Start your blog here!",
        method: 'POST',
        buttonText: 'Save Post'
    });
};

// POST the data to the database
exports.doCreate = function(req, res) {  
    Project.create({
        name: req.session.user.name,
        projectName: req.body.projectName,
        createdBy: req.session.user._id,
        tasks: req.body.tasks,       
        modifiedOn : Date.now(),
        lastLogin : Date.now()
    }, function( err, project ){
        if(err){
            if(err.code===11000){
                res.redirect( '/user/new?exists=true' );
            } else {
             res.redirect('/?error=true');
            }
        } else {
            // Success
            console.log("Blog created and saved: " + project);
            req.session.loggedIn = true;
            console.log("req.session.user: ", req.session.user);
            // res.redirect( '/user' );
                if(req.session.loggedIn === true){
                    res.render('user-page', {
                        title: req.session.user.name,
                        name: req.session.user.name,
                        loginName: req.session.user.name,
                        email: req.session.user.email,
                        userID: req.session.user._id
                    });
                }
            }
    }); 
 // };
}

 // GET Projects by UserID
exports.byUser = function (req, res) {
    console.log("Getting user projects");

    if (req.params.userid){
        Project.findByUserID(
            req.params.userid,
            function (err, projects) {
                if(!err){
                    console.log("*1***** Projects: *1**** ",projects);
                    res.json(projects);
                } else {
                    console.log(err);
                    res.json({"status":"error", "error":"Error finding projects"});
                } 
            });
    } else {
        console.log("No user id supplied");
        res.json({"status":"error", "error":"No user id supplied"});
    } 
};

// GET project info
exports.displayInfo = function(req, res) {
    console.log("Finding project _id: " + req.params.id);

    if (req.params.id) {
        Project.findById( req.params.id, function(err, project) {
            if(err){
                console.log(err);
                res.redirect('/user?404=project');
            } else {
                console.log(project);
                res.render('project-page', {
                    title: project.projectName,
                    projectName: project.projectName,
                    tasks: project.tasks,
                    createdBy: project.createdBy,
                    modifiedOn: project.modifiedOn,
                    name: project.name,
                    loginName: req.session.user.name,
                    comments: project.comments,
                    projectID: req.params.id
                });
            }
        });
    } else {
     res.redirect('/user');
    }
    // }
};

// GET project info
exports.edit = function(req, res) {
     console.log("Finding project _id for edits: " + req.params.id);

   if (req.params.id) {
        Project.findById( req.params.id, function(err, project) {
            if(err){
                console.log(err);
                res.redirect('/user?404=project');
            } else {
                // console.log(project);
                res.render('project-form', {
                    title: 'Edit Blog',
                    subtitle: project.projectName,
                    name: req.session.user.name,
                    loginName: req.session.user.name,
                    email: req.session.user.email,
                    projectName: project.projectName,
                    tasks: project.tasks,
                    createdBy: project.createdBy,
                    projectID: req.params.id,
                    method: 'PUT',
                    buttonText: 'Save'
                });
            }
        });
    } else {
        res.redirect('/user');
    }
        // }
};

// POST perform the edits on the blog title and author
exports.doEdit = function(req, res) {
    if (req.session.user._id) {
        Project.findById( req.params.id,
        function (err, project) {
            doEditSave (req, res, err, project);
        }); 
    }
};

var doEditSave = function(req, res, err, project) {
        if(err){
           console.log(err);
           res.redirect( '/user?error=finding');
        } else {
            project.projectName = req.body.projectName;
            project.tasks = req.body.tasks;
            project.modifiedOn = Date.now();
            project.save(function (err, user) {
            onEditSave (req, res, err, project);
        });
   }
};

var onEditSave = function (req, res, err, project) {
    if(err){
        console.log(err);
        res.redirect( '/user?error=saving');
    } else {
        res.redirect( '/user');
    }
};

// GET project delete confirmation form
exports.confirmDelete = function(req, res){
    res.render('project-delete-form', {
        title: 'Delete Blog',
        loginName: req.session.user.name,
        _id: req.params._id,
        name: req.session.user.name
    }); 
};

 // POST project delete form
exports.doDelete = function(req, res) {
    console.log('req.params.id: ', req.params.id);
    if (req.params.id) {
        Project.findByIdAndRemove(
            req.params.id,
            function (err, project) {
                if(err){
                    console.log(err);
                    return res.redirect('/user?error=deleting');
                }
        console.log("Blog deleted:", project);
        res.redirect('/user');
            });
    }
};

exports.commentCreate = function(req, res) {
    console.log("*** in commentCreate ***");
    console.log("req.params:", req.params);

    Project.findById( req.params.id,
        function(err, project) {
            if (err) {
                console.log('error finding individual blog');
            } else {
                res.render('blog-comment-page', {
                    method: "post",
                    buttonText: "Submit Comment",
                    name: project.name,
                    loginName: req.session.user.name,
                    blog: project.tasks,
                    commnts: project.tasks,
                    bloggerid: project.createdBy,
                    _id: req.params.id
                });
            }

        }
    );
};

exports.commentDoCreate = function(req, res) {
    console.log('Inside commentDoCreate');
    Project.findById( req.params.id, 'comments modifiedOn',
        function (err, project) {
            if(!err){
                project.comments.push({
                name: req.session.user.name,
                loginName: req.session.user.name,
                commentName: req.body.commentName,
                commentDesc: req.body.commentDesc,
                createdBy: req.session.user._id
                });

                project.modifiedOn = Date.now();
                project.save(function (err, project){
                    if(err){
                        console.log('Oh dear', err);
                    } else {
                        console.log('Comment saved: ' + req.body.commentName);
                        res.redirect( '/home/blog/' + req.params.id);
                    } 
                });
            } 
        }
    );
};

exports.commentDoCreateEdit = function(req, res) {
    console.log('Inside commentDoCreateEdit');
    Project.findById( req.params.comment_id, 'comments modifiedOn',
        function (err, project) {
            if(!err){
                console.log('project.comments: ', project.comments);

                if(err){
                    console.log('Oh dear', err);
                } else {
                    console.log('Comment saved: ' + req.body.commentName);
                    res.redirect( '/home/blog/' + req.params.id);
                } 
            } 
        }
    );
};
