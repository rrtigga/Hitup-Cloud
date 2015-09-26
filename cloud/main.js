
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

//Parse AfterSave of group:
Parse.Cloud.afterSave("Groups", function(request) {
  //query the Groups
  query = new Parse.Query("Groups");
  //get the users joined in the group
  query.get(request.object.get("users_joined").id, {
    success: function(post) {
    	console.log(post);
		//Find all users in User class and check if they are in the users_joined array for the Group
		var User = Parse.Object.extend("User");
		var query = new Parse.Query(User);
		// Where the User/s fb_id is contained in the users_joined array
		console.log(object.get("users_joined"));
		query.containedIn("fb_id", object.get("users_joined"));
		query.first({
		  success: function(object) {
		  	//save the group_id to groups_joined in the User class for that specific user
		  	object.set("groups_joined", post);
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});
