
function update(firebase){

var firebaseDb = firebase.database();


var contestRef = firebaseDb.ref("Contests");

//sets up to listen for new contests
contestRef.on('child_added', function (contest, prevChildKey) {

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
                               "name": newEntry.val().name
                        });


                  var vsRef = entries.child(newEntry.key).child("VS");

//for new entries, adds a default "scores" object with a path to each entry already in the contest


                  for (var i = 0; i < playersInContest.length; i++) {

                         if(playersInContest[i].playerKey != newEntry.key){

                              vsRef.child(playersInContest[i].playerKey).update({
                                    
                                    "0": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "Pts",
                                    },
                                    "1": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "Reb",
                                    },
                                    "2": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "Ast",
                                    },
                                    "3": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "Stl",
                                    },
                                    "4": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "Blk",
                                    },
                                    "5": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "3Pt",
                                    },
                                    "6": {
                                          "matchSet": false,
                                          "opponentname": playersInContest[i].name,
                                          "playerBuy": "0",
                                          "name": newEntry.val().name,
                                          "statCategory": "-TO",
                                    }
                                    
                                    
                              });


                              var oppVsRef = entries.child(playersInContest[i].playerKey).child("VS");


//for entries already in the contest, adds a "scores" object for the new entry. 

                               oppVsRef.child(newEntry.key).update({

                                    "0": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "Pts",
                                    },
                                    "1": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "Reb",
                                    },
                                    "2": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "Ast",
                                    },
                                    "3": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "Stl",
                                    },
                                    "4": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "Blk",
                                    },
                                    "5": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "3Pt",
                                    },
                                    "6": {
                                          "matchSet": false,
                                          "opponentname": newEntry.val().name,
                                          "playerBuy": "0",
                                          "name": playersInContest[i].name,
                                          "statCategory": "-TO",
                                    }
                                    
                                    });


                                  }


                  }

    }, function (error) {

    });
}, function (error) {

});

}

module.exports.update = update;







