Parse.Cloud.define("getAllHittupsToday", function(request, response) {
  Parse.Cloud.useMasterKey();

	var Hittups2 = new Parse.Object.extend("Hittups2");
  var query = new Parse.Query(Hittups2);
  //make a new user query
  var friends_list;
  
  var userquery = new Parse.Query(Parse.User);
  userquery.equalTo("fb_id", request.params.fbID);
  userquery.first({
  success: function(results) {
    var friends_list = results.get("fb_friendIds");
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
  });

  //the parameters will be passed in on a client side
  //fbID and PFGeoPoint coordinates
  //the facebook id needs to be contained in the friends list of other users
   query.containedIn(request.params.fbID, friends_list);

   //put restraints of 50 miles only
   query.withinMiles("coordinates",request.params.coordinates, 50);
   
   var now = new Date();
   console.log(now);

   //query.greaterThan("expire_time", now);

  query.find({
    success: function(results) {
      return results;

    },
    error: function() {
      response.error("hittup retrieval failed");
    }
  });
});


