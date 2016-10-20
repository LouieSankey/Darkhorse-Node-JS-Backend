
function update(firebase, scheduleDate){

var firebaseDb = firebase.database();
var request = require('request');



//schedule date === formattedScheduleDate
var contestRef = firebaseDb.ref("Contests").child(scheduleDate);


//sets up to listen for new contests
contestRef.on('child_added', function (contest, prevChildKey) {

      console.log("listening to new contest ");

    var entries = contestRef.child(contest.key).child("Entries");
    var playersInContest = [];


//for testing, removes players if entries are deleted from database
    entries.on('child_removed', function(){
      
      playersInContest = [];
            
    });


//for each contest, sets up to listen for added players
    entries.on('child_added', function (newEntry) {



                        playersInContest.push({
                               "playerKey": newEntry.key,
                               "name": newEntry.val().name,
                               "playerId": newEntry.val().playerId

                        });


                  var vsRef = entries.child(newEntry.key).child("VS");

//for new entries, adds a default "scores" object with a path to each entry already in the contest


                  for (var i = 0; i < playersInContest.length; i++) {


                         if(playersInContest[i].playerKey != newEntry.key){


                              vsRef.child(playersInContest[i].playerKey).update({

                                    
                                    "0": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Pts",
                                          "playerId": playersInContest[i].playerId,
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "1": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Reb",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "2": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Ast",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "3": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Stl",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "4": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Blk",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "5": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "3Pt",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "6": {
                                          "matchSet": false,
                                          "opponentName": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "playerName": newEntry.val().name,
                                          "statCategory": "Low TO",
                                          "plusAmount": 0,
                                          "opponentPlus": 0
                                    }
                                    
                                    
                              });


                              var oppVsRef = entries.child(playersInContest[i].playerKey).child("VS");


//for entries already in the contest, adds a "scores" object for the new entry. 
//also need to notify entries already in the contest of the new entry

                              console.log("notification " + playersInContest[i].playerKey);

                                // request({
                                //   url: 'https://fcm.googleapis.com/fcm/send',
                                //   method: 'POST',
                                //   headers: {
                                //     'Content-Type' :' application/json',
                                //     'Authorization': 'key=AIzaSyDgYtB8klH4KbDgeml3YmzpAnhb2_m6Y8s'
                                //   },
                                //   body: JSON.stringify({
                                //     data: {
                                //       message: "A player has drafted into your contest."
                                //     },
                                //     to : '/topics/user_'+ playersInContest[i].playerKey
                                //   })
                                // });


                                // console.log('/topics/user_'+ playersInContest[i].playerKey);

                                // sendMessageToUser(
                                //   '/topics/user_'+ playersInContest[i].playerKey,
                                //   { message: "A player has drafted into your contest."}
                                // );



                              //sendNotificationToUser(playersInContest[i].playerKey, "a player has drafted into your contest");


                               oppVsRef.child(newEntry.key).update({

                                    "0": {

                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Pts",
                                          "playerId": newEntry.val().playerId,
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "1": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Reb",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "2": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Ast",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "3": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Stl",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "4": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Blk",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "5": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "3Pt",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    },
                                    "6": {
                                          "matchSet": false,
                                          "opponentName": newEntry.val().name,
                                          "playerBuy": "0",
                                          "playerName": playersInContest[i].name,
                                          "statCategory": "Low TO",
                                           "plusAmount": 0,
                                          "opponentPlus": 0
                                    }
                                    
                                    });


                                  }


                  }

    }, function (error) {

    });
}, function (error) {

});

                            // function sendMessageToUser(topic, message) {
                            //     request({
                            //       url: 'https://fcm.googleapis.com/fcm/send',
                            //       method: 'POST',
                            //       headers: {
                            //         'Content-Type' :' application/json',
                            //         'Authorization': 'key=AIzaSyDgYtB8klH4KbDgeml3YmzpAnhb2_m6Y8s'
                            //       },
                            //       body: JSON.stringify(
                            //         { "data": {
                            //           "message": message
                            //         },
                            //           "to" : topic
                            //         }
                            //       )
                            //     }, function(error, response, body) {
                            //       if (error) { 
                            //         console.error(error, response, body); 
                            //       }
                            //       else if (response.statusCode >= 400) { 
                            //         console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
                            //       }
                            //       else {
                            //         console.log('Done!');
                            //       }
                            //     });
                            //   }

}

module.exports.update = update;







