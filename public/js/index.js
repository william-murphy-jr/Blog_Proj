// public/js/index.js

console.log('index.js:');

$(document).ready(function(){
    var myprojectsTemplate = $("#myprojectsTemplate").html();
    var blogsTemplate = Handlebars.compile(myprojectsTemplate);

    var allData = [];
    // var copy = [];
    // var copy2 = [];
    var allUsersBlogs = [];


    $.ajax('/homeUsers', {
        dataType: 'json',
        error: function(){
        console.log("ajax error :(");
       },
       success: function (allBloggers) {
        console.log("Returned from '/' routedata homeUsers': ", allBloggers);
        //  if (data.length > 0) {
        //    if (data.status && data.status === 'error'){
        // strHTMLOutput = "<li>Error: " + data.error + "</li>";

        //    '/homeUsers/:bloggerid' 


        allBloggers.forEach(function(singleBlogger) {

            $.ajax('/homeUsers/' + singleBlogger._id, {
                dataType: 'json',
                // we could wrap the call in a function. See stackoverflow
                // Search: passing data out of  $.ajax
                // Result: Trying to store value of jquery callback, 
                // but code is running out of sequence
                async: false,
                error: function(){
                console.log("ajax error :(");
                },
                success: function (singleBloggersBlogs) {
                console.log("Returned from 'singleBloggersBlogs' : ", singleBloggersBlogs);
                    var temp = [];

                    singleBloggersBlogs.forEach(function(blog) {
                        // console.log('blog.tasks:***** ', blog.tasks);
                        temp = blog.tasks.split(' ');
                        // console.log('temp:***** ', temp);

                        var lastModified =  blog.modifiedOn ? blog.modifiedOn : blog.createdOn;
                        blog.lastModified = new Date(lastModified.toString());

                        if(temp.length >= 55) {
                            blog.tasks = temp.slice(0, 50).join(' ');
                            blog.tasks += '   ...view full post';

                            // console.log('blog:***** ', blog);
                        };
                    });
       
                     singleBlogger.blogs = singleBloggersBlogs;
                }

            }); // End of inside ajax call

            allUsersBlogs.push(singleBlogger);

        });  // forEach()

            $("#myUsers").append(blogsTemplate({bloggers: allUsersBlogs}));
        }

    }); 
});

