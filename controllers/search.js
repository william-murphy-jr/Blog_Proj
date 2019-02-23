// controllers/search.js 

var mongoose = require("mongoose");
var User = mongoose.model( 'User' );
var Project = mongoose.model( 'Project' );


exports.doSearch = function(req, res) {
    console.log('In search', req.body);

    var search = req.body.search;
    search = search.trim();

    var searchRegExp = new RegExp(search, "gi");
    // console.log('trim: ', search);

    Project.find({ "$or" : [{"name": searchRegExp}, {"tasks": searchRegExp}, {"projectName": searchRegExp}] }, {}, {sort: '-modifiedOn'},
        function(err, project) {
            if (err) {
                console.log('There was an error finding user blogs.',err);
            } else {
                console.log('search project: ', project)
                if (req.session.user) {
                    res.render('search-results', {
                        results: project,
                        loginName: req.session.user.name
                    });
                }
                else {
                    res.render('search-results', {
                        results: project,
                        // loginName: req.session.user.name
                    });
                }
            }
        }
    );
};
