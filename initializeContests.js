//depending on popularity 
//no more contests should be created less than 5 min before DRAFT ENDS to allow time for full draft

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


//var scoreContests = require('./scoreContests');

var schedule = firebaseDb.ref('DatedSchedule');
var contestsRef = firebaseDb.ref("Contests");

var fullContestsRef = firebaseDb.ref("FullContests");
var userRef = firebaseDb.ref("Users");
var formattedScheduleDate = moment().utc().subtract(281, 'days').format('YYYY_MM_DD');
//var formattedScheduleDate = moment(scheduleDate, ['ddd MMM D YYYY']).subtract(0, 'days').format('YYYY_MM_DD');
console.log(formattedScheduleDate);

schedule.child(formattedScheduleDate).on('value', function (snapshot){
	
				contestsRef.once("value", function(location) {

						var utc = moment.utc().valueOf();
						var buyingWindow = 60000 * 30;

							var gameTimes = [];
							var gamesInDraft = 0;

							for (var timeKey in snapshot.val()) {
								var index = 0;
					
									  for(var game in snapshot.val()[timeKey]){
									  		gameTimes.push(timeKey);
									  		++gamesInDraft;
									  }
							}


							gameTimes.reverse();
							var setGameTime;

							if(!location.child(formattedScheduleDate).exists()){

							for (var i = 0; i < gameTimes.length; i++) {

//possibly add "&& i < 3 to shrink number of contests"
								if(gameTimes[i] !== gameTimes[i + Number(1)]){
										console.log("not okay" + gameTimes[i]);


									if((i === 0 || i === gameTimes.length) || (gameTimes[i].charAt(3) === "0")){

										console.log("okay" + gameTimes[i]);

									var gamesAmnt = i + Number(1);

									//these two variables are the same but formatted differently
									var buyingPeriodEnds = moment(gameTimes[i], 'HH:mm A').utc().valueOf();
									

											// switch(true){

											// 	case (gamesAmnt >= 7):

											// 	console.log(gamesAmnt + "/ accepting 7");

											// 		contestsRef.child(formattedScheduleDate).push({

											// 			"Entries": "",
											// 			"gameType": "* NBA Free Round Royal 1 on 1",
											// 			"positionsPaid": 0,
					    		// 						"entryAmnt": 0,
					    		// 						"accepting": 7,
					    		// 						"prize": 0,
											// 			"draftEnds":  buyingPeriodEnds - buyingWindow,
											// 			"contestStatus": "drafting",
											// 			"nbaGamesAmnt": gamesAmnt,
											// 			"buyingEnds": buyingWindow,
											// 			"firstContestGame": buyingPeriodEnds

											// 		});

													

											// 	case(gamesAmnt >= 3):


											// 		contestsRef.child(formattedScheduleDate).push({

											// 			"Entries": "",
											// 			"gameType": "* NBA Free Round Royal 1 on 1",
											// 			"positionsPaid": 0,
					    		// 						"entryAmnt": 0,
					    		// 						"accepting": 5,
					    		// 						"prize": 0,
											// 			"draftEnds":  buyingPeriodEnds - buyingWindow,
											// 			"contestStatus": "drafting",
											// 			"nbaGamesAmnt": gamesAmnt,
											// 			"buyingEnds": buyingWindow,
											// 			"buyingEndsUtc": buyingPeriodEnds,
											// 			"firstContestGame": buyingPeriodEnds

											// 		});

											// 		contestsRef.child(formattedScheduleDate).push({

											// 			"Entries": "",
											// 			"gameType": "* NBA Free Round Royal 1 on 1",
											// 			"positionsPaid": 0,
					    		// 						"entryAmnt": 0,
					    		// 						"accepting": 5,
					    		// 						"prize": 0,
											// 			"draftEnds":  buyingPeriodEnds - buyingWindow,
											// 			"contestStatus": "drafting",
											// 			"nbaGamesAmnt": gamesAmnt,
											// 			"buyingEnds": buyingWindow,
											// 			"firstContestGame": buyingPeriodEnds
											// 		});


											// 		case(gamesAmnt >= 1):


											// 			contestsRef.child(formattedScheduleDate).push({

											// 			"Entries": "",
											// 			"gameType": "* NBA Free Heads Up 1 on 1",
											// 			"positionsPaid": 0,
					    		// 						"entryAmnt": 0,
					    		// 						"accepting": 2,
					    		// 						"prize": 0,
											// 			"draftEnds":  buyingPeriodEnds - buyingWindow,
											// 			"contestStatus": "drafting",
											// 			"nbaGamesAmnt": gamesAmnt,
											// 			"buyingEnds": buyingWindow,
											// 			"firstContestGame": buyingPeriodEnds

											// 		});


											// 			contestsRef.child(formattedScheduleDate).push({

											// 			"Entries": "",
											// 			"gameType": "* NBA Free Heads Up 1 on 1",
											// 			"positionsPaid": 0,
					    		// 						"entryAmnt": 0,
					    		// 						"accepting": 2,
					    		// 						"prize": 0,
											// 			"draftEnds":  buyingPeriodEnds - buyingWindow,
											// 			"contestStatus": "drafting",
											// 			"nbaGamesAmnt": gamesAmnt,
											// 			"buyingEnds": buyingWindow,
											// 			"firstContestGame": buyingPeriodEnds

											// 		});

												
											// }
										}


								}

							}
						}
					});


						
						// contestsRef.child(formattedScheduleDate).on('child_added', function(contestSnapshot){

						// 	var contest = contestSnapshot.val();
						// 	console.log(contest);

						// 	var accepting = contest.accepting;
						// 	var draftEnds = contest.draftEnds;
						// 	var entryAmnt = contest.entryAmnt;
						// 	var gameType = contest.gameType;
						// 	var NBAGames = contest.nbaGamesAmnt; 
						// 	var positionsPaid = contest.positionsPaid;
						// 	var prize = contest.prize;
						// 	var contestStatus = contest.contestStatus;
						// 	var buyingWindow = contest.buyingEnds;

						// 	var contestEntryRef = contestsRef.child(formattedScheduleDate).child(contestSnapshot.key).child("Entries");

								

						// 		contestEntryRef.on('child_added', function(entrySnapshot){

						// 			var playersEntered;
						// 			contestEntryRef.once("value", function(children) {
						// 				playersEntered = children.numChildren();
						// 			});


							
						// 			if(playersEntered === accepting){

						// 				console.log("buying set");

						// 				contestsRef.child(formattedScheduleDate).child(contestSnapshot.key).child("contestStatus").set("buying");

						// 				contestsRef.child(formattedScheduleDate).push({

						// 					"accepting": accepting,
						// 					"draftEnds":  draftEnds,
						// 					"contestStatus": "drafting",
						// 					"gameType": gameType,
						// 					"nbaGamesAmnt": NBAGames,
						// 					"buyingEnds": buyingWindow,
						// 					"positionsPaid": positionsPaid,
						// 					"entryAmnt": entryAmnt,
						// 					"prize": prize

						// 				});

						// 				//should calculate scores after buying window closes
						// 				//updateContestStatus(buyingWindow);
						// 			}


						// 		});



						// 	});



					

	

});



function updateContestStatus(time){
	console.log("set with " + time + "to scoring");

		setTimeout(function() {

		//scoreContests.update(firebase, formattedScheduleDate);

		}, time);

}


}

update();


module.exports.update = update;

