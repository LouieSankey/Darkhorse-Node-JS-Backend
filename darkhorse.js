function update(){


var http = require('http');
var moment =require('moment');
var firebase = require("./node_modules/firebase");

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.PORT, '0.0.0.0');

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});


var firebaseDb = firebase.database();
var request = require('request');
var FCM = require('fcm-node');
var serverKey = 'AIzaSyDgYtB8klH4KbDgeml3YmzpAnhb2_m6Y8s';  
var fcm = new FCM(serverKey);
var serverTimeRef = firebaseDb.ref("serverTime");

serverTimeRef.on("value",  function (){

  var ScheduleDate = moment().utc().format('YYYY_MM_DD');
  var allContestsRef = firebaseDb.ref("Contests");
  var contestRef = allContestsRef.child(ScheduleDate);

console.log(ScheduleDate);

contestRef.once('value', function (refSnapshot){

    if(!refSnapshot.hasChildren()){
    

//sets up to listen for new contests
contestRef.on('child_added', function (contestSnapshot) {

      console.log("listening to new contest ");

    var entries = contestRef.child(contestSnapshot.key).child("Entries");
    var playersInContest = [];


//for testing, removes players if entries are deleted from database
    entries.on('child_removed', function(){
      
      playersInContest = [];
            
    });

              var contest = contestSnapshot.val();
              var accepting = contest.accepting;
              var draftEnds = contest.draftEnds;
              var entryAmnt = contest.entryAmnt;
              var gameType = contest.gameType;
              var gameTypeShort = contest.gameTypeShort;
              var scoring = contest.scoring;
              var NBAGames = contest.nbaGamesAmnt; 
              var positionsPaid = contest.positionsPaid;
              var prize = contest.prize;
              var contestStatus = contest.contestStatus;
              var firstContestGame = contest.firstContestGame;
              var buyingWindow = contest.buyingEnds;
              var contestOrder = contest.contestOrder;
          
                  var counter = 0;
                  var entryListener = entries.on('child_added', function(entriesSnapshot){

                    ++counter;

                    console.log("child_changed: " + counter);
                  

                  if(counter === accepting){

                    contestRef.child(contestSnapshot.key).child("contestStatus").set("Buying...");

                    contestRef.push({

                      "accepting": accepting,
                      "draftEnds":  draftEnds,
                      "contestStatus": "Accepting...",
                      "gameTypeShort": gameTypeShort,
                      "scoring": scoring,
                      "gameType": gameType,
                      "nbaGamesAmnt": NBAGames,
                      "buyingEnds": buyingWindow,
                      "positionsPaid": positionsPaid,
                      "entryAmnt": entryAmnt,
                      "firstContestGame": firstContestGame,
                      "prize": prize,
                      "contestOrder": contestOrder

                    });


                    //unregister listener
                    entries.off("child_changed", entryListener);

                    //should calculate scores after buying window closes
                    //updateContestStatus(buyingWindow);
                    }
                
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

                              var message = { 
                                  to: '/topics/' + contestSnapshot.key + playersInContest[i].playerKey, 
                                  data: {
                                      title:'Draft Alert!',
                                      message: "Buy stasts now against " + newEntry.val().name,
                                      contestId: contestSnapshot.key,
                                      dateKey: ScheduleDate

                                  }
                              };

                              fcm.send(message, function(err, response){
                                  if (err) {
                                      console.log("Something has gone wrong!");
                                      console.log(err);
                                  } else {
                                      console.log("Successfully sent:", response);
                                  }
                              });


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



                              //notifies entries already in the contest of the new entry



                              var oppVsRef = entries.child(playersInContest[i].playerKey).child("VS");
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

    }
});

});


}

module.exports.update = update;

update();







