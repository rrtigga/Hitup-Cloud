Parse.Cloud.define("getAllHittupsToday", function(request, response) {
  Parse.Cloud.useMasterKey();

  var userId = request.user.get("fb_id")
  var friends_list = request.user.get("fb_friendIds");
  friends_list.push(userId);
  var now = new Date();
  now.setHours(0,0,0,0);
  var today = new Date(now - 8*60*60*1000);


  var generalQuery = new Parse.Query("Hittups2");
  generalQuery.containedIn("ihost_Id", friends_list);
  generalQuery.notEqualTo("isPrivate", true);
  generalQuery.greaterThan("expire_time", today);

  var privateQuery = new Parse.Query("Hittups2");
  privateQuery.containsAll("iInvited_Ids", [userId]);
  privateQuery.equalTo("isPrivate", true);
  privateQuery.greaterThan("expire_time", today);

  var mineQuery = new Parse.Query("Hittups2");
  mineQuery.equalTo("ihost_Id", userId);
  mineQuery.greaterThan("expire_time", today);

  var eventQuery = new Parse.Query("Hittups2");
  eventQuery.equalTo("eventType", true);
  eventQuery.greaterThan("expire_time", today);

  var mainQuery = Parse.Query.or(generalQuery, privateQuery, mineQuery, eventQuery);

  mainQuery.withinMiles("coordinates", request.params.coordinates, 700);
  mainQuery.exists("coordinates");

  mainQuery.find({
    success: function(results) {

      response.success(results);

    },
    error: function() {
      console.log("error in this bitch");
      response.error("Error1: " + error.code + " " + error.message);
    }
  });

});

Parse.Cloud.define("getFriends", function(request, response) {
  Parse.Cloud.useMasterKey();

  var userId = request.user.get("fb_id")
  var friends_list = request.user.get("fb_friendIds");
  friends_list.push(userId)
  // friends_list.remove(userId);
  // d

  var userQuery = new Parse.Query(Parse.User);
  userQuery.containedIn("fb_id", friends_list);
  userQuery.find({
    success: function(results) {
      var userJson = [];
      for (var i = 0; i < results.length; i++) {

        var jsonData = {};
        jsonData["fb_id"] =  results[i].get("fb_id");
        jsonData["first_name"] = results[i].get("first_name");
        jsonData["last_name"] = results[i].get("last_name");
        jsonData["city_code"] = results[i].get("city_code");
        jsonData["city"] = results[i].get("city");
        jsonData["postal_code"] = results[i].get("postal_code");
        jsonData["last_location_update"] = results[i].get("last_location_update");
        userJson.push(jsonData);

      }
      response.success(userJson);
    },
    error: function() {
      console.log("error in this bitch");
      response.error("Error1: " + error.code + " " + error.message);
    }
  });

});

Parse.Cloud.afterSave("Hittups2", function(request, response) {
  
  console.log("test");

  if (request.object.get("isPrivate") == true) {
    console.log("Private Hittup1");
    // response.success(true);
  } else {
    console.log("Not a Private Hittup");
    var userId = request.user.get("fb_id");
    var friends_list = request.user.get("fb_friendIds");
    // friends_list.remove(userId);

    var installQuery = new Parse.Query(Parse.Installation);
    installQuery.containedIn("fb_id", friends_list);
    installQuery.withinMiles("latestLocation", request.object.get("coordinates"), 40);
    installQuery.exists("latestLocation");

    Parse.Push.send({
      where: installQuery, // Set our Installation query
      data: {
        alert: request.object.get("ihost_firstName") + " posted \"" + request.object.get("header") + "\"" + " nearby"
      }
    }, {
      success: function() {
        // response.success(true);
      },
      error: function(error) {
        response.error("Error1: " + error.code + " " + error.message);
      }
    });
  }

});


Parse.Cloud.job("removeOldHittups", function(request, status) {

  var query = new Parse.Query("Hittups2");
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  query.lessThan("createdAt",yesterday);

  query.find({
    success: function(results) {
      var num = results.length;
      for (var i = 0; i < results.length; i++) {
        results[i].destroy();
      }
      status.success("24 Hour deletion completed successfully." + " " + num + " deleted");

    },
    error: function() {
      console.log("error in this bitch");
      status.error("Error1: " + error.code + " " + error.message);
    }
  });
});








