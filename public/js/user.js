// public/js/user.js

console.log('userID passed into user.js:', userID);
$(document).ready(function(){
    $.ajax('/project/byuser/' + userID, {
        dataType: 'json',
        error: function(){
        console.log("ajax error :(");
       },
       success: function (data) {
        console.log("Returned 'data': ", data);
        //  if (data.length > 0) {
        //    if (data.status && data.status === 'error'){
        //      strHTMLOutput = "<li>Error: " + data.error + "</li>";

            var myprojectsTemplate = $("#myprojectsTemplate").html();

            for(var intItem = 0; intItem < data.length; intItem++) {
                var lastModified =  data[intItem].modifiedOn ? data[intItem].modifiedOn : data[intItem].createdOn;
                data[intItem].lastModified = new Date(lastModified.toString());
            };

            var blogsTemplate = Handlebars.compile(myprojectsTemplate);
            $("#myprojects").append(blogsTemplate({blogs: data}));
        }

    }); 
});

