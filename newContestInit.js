//there should always be 7 or 8 contests going
//finished contests should move to a different reference, or single in a node
//finished contests should be replaced by another of the same game type
//contests should be organized by date ** (eventually)
//contests should count down to 30 minutes before the first scheduled game
//no more contests should be created less than 20 min before BUYING CLOSES to allow time

function update(firebase, scheduleDate){

var moment = require('moment');
var cron = require('node-cron');
var scoreContests = require('./scoreContests');

var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('datedSchedule');
var contestsRef = firebaseDb.ref("Contests");
var fullContestsRef = firebaseDb.ref("FullContests");
var userRef = firebaseDb.ref("Users");

var formattedScheduleDate = moment(scheduleDate, ['ddd MMM D YYYY']).subtract(0, 'days').format('YYYY MM DD');

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

							if(!location.child(scheduleDate).exists()){

							for (var i = 0; i < gameTimes.length; i++) {


								if(gameTimes[i] !== gameTimes[i + Number(1)]){

								var gamesAmnt = i + Number(1);

								//these two variables are the same but formatted differently
								var buyingPeriodEnds = moment(gameTimes[i], 'HH:mm A').utc().valueOf();
								


										switch(true){

											case (gamesAmnt >= 7):

											console.log(gamesAmnt + "/ accepting 7");

												contestsRef.child(scheduleDate).push({

													"Entries": "",
													"gameType": "* NBA Free Round Royal 1 on 1",
													"positionsPaid": 0,
				    								"entryAmnt": 0,
				    								"accepting": 7,
				    								"prize": 0,
													"draftEnds":  buyingPeriodEnds - buyingWindow,
													"contestStatus": "drafting",
													"nbaGamesAmnt": gamesAmnt,
													"buyingEnds": buyingWindow,
													"firstContestGame": buyingPeriodEnds

												});

											console.log(gamesAmnt + "/ accepting 5");


											contestsRef.child(scheduleDate).push({

													"Entries": "",
													"gameType": "* NBA Free Round Royal 1 on 1",
													"positionsPaid": 0,
				    								"entryAmnt": 0,
				    								"accepting": 5,
				    								"prize": 0,
													"draftEnds":  buyingPeriodEnds - buyingWindow,
													"contestStatus": "drafting",
													"nbaGamesAmnt": gamesAmnt,
													"buyingEnds": buyingWindow,
													"firstContestGame": buyingPeriodEnds
												});

												

											case(gamesAmnt >= 3):

												console.log(gamesAmnt + "/ accepting 5");


												contestsRef.child(scheduleDate).push({

													"Entries": "",
													"gameType": "* NBA Free Round Royal 1 on 1",
													"positionsPaid": 0,
				    								"entryAmnt": 0,
				    								"accepting": 5,
				    								"prize": 0,
													"draftEnds":  buyingPeriodEnds - buyingWindow,
													"contestStatus": "drafting",
													"nbaGamesAmnt": gamesAmnt,
													"buyingEnds": buyingWindow,
													"firstContestGame": buyingPeriodEnds

												});

													console.log(gamesAmnt + "/ accepting 2");

													contestsRef.child(scheduleDate).push({

													"Entries": "",
													"gameType": "* NBA Free Round Royal 1 on 1",
													"positionsPaid": 0,
				    								"entryAmnt": 0,
				    								"accepting": 2,
				    								"prize": 0,
													"draftEnds":  buyingPeriodEnds - buyingWindow,
													"contestStatus": "drafting",
													"nbaGamesAmnt": gamesAmnt,
													"buyingEnds": buyingWindow,
													"firstContestGame": buyingPeriodEnds

												});

												case(gamesAmnt >= 1):

												console.log(gamesAmnt + "/ accepting 2");

													contestsRef.child(scheduleDate).push({

													"Entries": "",
													"gameType": "* NBA Free Heads Up 1 on 1",
													"positionsPaid": 0,
				    								"entryAmnt": 0,
				    								"accepting": 2,
				    								"prize": 0,
													"draftEnds":  buyingPeriodEnds - buyingWindow,
													"contestStatus": "drafting",
													"nbaGamesAmnt": gamesAmnt,
													"buyingEnds": buyingWindow,
													"firstContestGame": buyingPeriodEnds

												});

											
										}


								}

							}
						}
					});


						
						contestsRef.child(scheduleDate).on('child_added', function(contestSnapshot){

							var contest = contestSnapshot.val();
							console.log(contest);

							var accepting = contest.accepting;
							var draftEnds = contest.draftEnds;
							var entryAmnt = contest.entryAmnt;
							var gameType = contest.gameType;
							var NBAGames = contest.nbaGamesAmnt; 
							var positionsPaid = contest.positionsPaid;
							var prize = contest.prize;
							var contestStatus = contest.contestStatus;
							var buyingWindow = contest.buyingEnds;

							var contestEntryRef = contestsRef.child(scheduleDate).child(contestSnapshot.key).child("Entries");

								

								contestEntryRef.on('child_added', function(entrySnapshot){

									var playersEntered;
									contestEntryRef.once("value", function(children) {
										playersEntered = children.numChildren();
									});


							
									if(playersEntered === accepting){

										console.log("buying set");

										contestsRef.child(scheduleDate).child(contestSnapshot.key).child("contestStatus").set("buying");

										contestsRef.child(scheduleDate).push({

											"accepting": accepting,
											"draftEnds":  draftEnds,
											"contestStatus": "drafting",
											"gameType": gameType,
											"nbaGamesAmnt": NBAGames,
											"buyingEnds": buyingWindow,
											"positionsPaid": positionsPaid,
											"entryAmnt": entryAmnt,
											"prize": prize

										});

										//should calculate scores after buying window closes
										updateContestStatus(buyingWindow);
									}


								});



							});



					

	

});



function updateContestStatus(time){
	console.log("set with " + time + "to scoring");

		setTimeout(function() {

		scoreContests.update(firebase, scheduleDate);

		}, time);

}


}


module.exports.update = update;

