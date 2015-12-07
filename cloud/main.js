Parse.Cloud.define("getAllHittupsToday", function(request, response) {
  Parse.Cloud.useMasterKey();
	var query = new Parse.Query("Hittups2");
  //the parameters will be passed in on a client side
  //fbID and PFGeoPoint coordinates
  //the facebook id needs to be contained in the friends list of other users
   query.containedIn(request.params.fbID, Parse.User.get("fb_friendIds"));
   
   //get coordinates of Hittups using the Hittup2 class in Parse
   var Hittups2 = Parse.Object.extend("Hittups2");
   
   //get the coordinates
   var coordinates = Hittups2.get("coordinates");
   //put restraints of 50 miles only
   query.withinMiles(request.params.coordinates, coordinates, 50);
   
   //query time is greater than now
   var expire_time = Hittups2.get("expire_time");
   var createdAt = Hittups2.get("createdAt");
   query.greaterThan(expire_time,createdAt);

  query.find({
    success: function(results) {
    	console.log(results);

    },
    error: function() {
      response.error("hittup retrieval failed");
    }
  });
});


