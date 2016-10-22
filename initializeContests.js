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
var schedule = firebaseDb.ref('DatedSchedule');
var contestsRef = firebaseDb.ref("Contests");
var fullContestsRef = firebaseDb.ref("FullContests");
var userRef = firebaseDb.ref("Users");
var formattedScheduleDate = moment().utc().subtract(281, 'days').format('YYYY_MM_DD');


schedule.child(formattedScheduleDate).once('value', function (snapshot){
	
				contestsRef.on("value", function(location) {

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

				
							var loopsCompleted = 0;



							for (var i = 0; i < gameTimes.length; i++) {


//possibly add "&& i < 3 to shrink number of contests"
								if(gameTimes[i] !== gameTimes[i + Number(1)] || i === 0){

									if((i === gameTimes.length) || (gameTimes[i].charAt(3) === "0")){

									var gamesAmnt = i + Number(1);


									//these two variables are the same but formatted differently
									var buyingPeriodEnds = moment(gameTimes[i], 'HH:mm A').utc().valueOf();


											if(loopsCompleted < 2){
												console.log(gameTimes[i]);

												loopsCompleted++;

											switch(true){

												case (gamesAmnt >= 7):


													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "Battle Royal",
														"gameType": " NBA 10 Token Battle Royal",
														"scoring": "[6x Multiplier]",
														"positionsPaid": 1,
					    								"entryAmnt": 10,
					    								"accepting": 6,
					    								"prize": 54,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds

													});

													

												case(gamesAmnt >= 2):


													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "Battle Royal",
														"gameType": " NBA 20 Token Battle Royal",
														"scoring": "[Double-Up]",
														"positionsPaid": 3,
					    								"entryAmnt": 20,
					    								"accepting": 6,
					    								"prize": 36,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"buyingEndsUtc": buyingPeriodEnds,
														"firstContestGame": buyingPeriodEnds

													});

													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "Battle Royal",
														"gameType": " NBA 20 Token Battle Royal",
														"scoring": "[Triple-Up]",
														"positionsPaid": 1,
					    								"entryAmnt": 20,
					    								"accepting": 3,
					    								"prize": 54,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds
													});


														contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "1 on 1",
														"gameType": " NBA 20 Token 1 on 1",
														"scoring": "[H2H]",
														"positionsPaid": 1,
					    								"entryAmnt": 20,
					    								"accepting": 2,
					    								"prize": 36,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds

													});

														contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "1 on 1",
														"gameType": " NBA 30 Token 1 on 1",
														"scoring": "[H2H]",
														"positionsPaid": 1,
					    								"entryAmnt": 30,
					    								"accepting": 2,
					    								"prize": 54,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds
													});
									

												
											}
										}
										

										}


								}

							}
						}
					});


						
						contestsRef.child(formattedScheduleDate).on('child_added', function(contestSnapshot){

							console.log("called for : " + contestSnapshot.key);


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
							var buyingWindow = contest.buyingEnds;


							var contestEntryRef = contestsRef.child(formattedScheduleDate).child(contestSnapshot.key).child("Entries");
					

						
									contestEntryRef.on('child_changed', function(entriesSnapshot){

										console.log("child_changed");


									var totalEntries = entriesSnapshot.numChildren();

									if(totalEntries === accepting){

										contestsRef.child(formattedScheduleDate).child(contestSnapshot.key).child("contestStatus").set("Buying...");

										contestsRef.child(formattedScheduleDate).push({

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
											"prize": prize

										});

										//should calculate scores after buying window closes
										//updateContestStatus(buyingWindow);
										}
								
									});




			});



		});



	function updateContestStatus(time){
		console.log("set with " + time + "to scoring");

			setTimeout(function() {

			//scoreContests.update(firebase, formattedScheduleDate);

			}, time);

		}

	//});


}

update();


module.exports.update = update;

