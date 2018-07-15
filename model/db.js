// model/db.js 

// Using a Mongoose Database

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var dbURI = 'mongodb://localhost/blog_database';
var db = mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

/* ********************************************
     USER SCHEMA
  ******************************************** */
   var userSchema = new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, unique:true, required: true},
        password: {type: String, required: true},
        createdOn: { type: Date, default: Date.now },
        modifiedOn: Date,
        lastLogin: Date
});

   // methods ======================
   // generating a hash
   userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
   };

   // checking if password is valid
   userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
   };

      // Build the User model
   mongoose.model( 'User', userSchema );


/* ********************************************
     PROJECT SCHEMA
  ******************************************** */
  var commentSchema = new mongoose.Schema({
        commentName: { type: String, required: true},
        name: String,
        commentDesc: String,
        createdOn: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        modifiedOn: Date,
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   });

   var projectSchema = new mongoose.Schema({
    name: String,
    projectName: String,
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // contributors: String,
    tasks: String,
    comments: [commentSchema]
});

projectSchema.statics.findByUserID = function (userid, callback) {
    this.find(
        { createdBy: userid },
        '_id projectName createdOn modifiedOn createdBy',
        {sort: '-modifiedOn'},
        callback);
};

   // Build the Project model
   mongoose.model( 'Project', projectSchema );

   module.exports = db;




