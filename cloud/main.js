Parse.Cloud.define("getAllHittupsToday", function(request, response) {
  Parse.Cloud.useMasterKey();

  var userId = request.user.get("fb_id")
  var friends_list = request.user.get("fb_friendIds");
  friends_list.push(userId);
  var now = new Date();
  var today = new Date(now - 16*60*60*1000);


  var generalQuery = new Parse.Query("Hittups2");
  generalQuery.containedIn("ihost_Id", friends_list);
  generalQuery.equalTo("isPrivate", false);
  generalQuery.greaterThan("expire_time", today);

  var privateQuery = new Parse.Query("Hittups2");
  privateQuery.containedIn("iInvited_Ids", userId);
  privateQuery.equalTo("isPrivate", true);
  privateQuery.greaterThan("expire_time", today);


  generalQuery.find({
    success: function(results) {

      response.success(results);

      // privateQuery.find({
      //   success: function(results2) {
      //     response.success(results.concat(results2));

      //   },
      //   error: function() {
      //     // console.log("error in this bitch");
      //     response.error("Error2: " + error.code + " " + error.message);
      //   }
      // });

    },
    error: function() {
      console.log("error in this bitch");
      response.error("Error1: " + error.code + " " + error.message);
    }
  });

});


