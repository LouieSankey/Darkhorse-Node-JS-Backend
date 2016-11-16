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
var schedule = firebaseDb.ref('2016DatedSchedule');
var contestsRef = firebaseDb.ref("Contests");
var userRef = firebaseDb.ref("Users");
var formattedScheduleDate = moment().utc().format('YYYY_MM_DD');

console.log(formattedScheduleDate);


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
							var contestOrder = 0;



							for (var i = 0; i < gameTimes.length; i++) {


//possibly add "&& i < 3 to shrink number of contests"
								if(gameTimes[i] !== gameTimes[i + Number(1)] || i <= 2){

									console.log(gameTimes[i] + " times");
									console.log(i + " i");

									if((i === gameTimes.length) || (gameTimes[i].charAt(3) === "0") || i <= 2){

										console.log(gameTimes[i] + " inside");

									var gamesAmnt = i + Number(1);


									//these two variables are the same but formatted differently
									var buyingPeriodEnds = moment(gameTimes[i], 'HH:mm A').utc().valueOf();


											if(loopsCompleted < 2){

												console.log(loopsCompleted + "completed");
												

												loopsCompleted++;

											switch(true){

												case (gamesAmnt >= 7):


													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "1 on 1 Tournement",
														"gameType": " NBA 10 Token 1 on 1 Tournement",
														"scoring": "[Double-Up]",
														"positionsPaid": 4,
					    								"entryAmnt": 10,
					    								"accepting": 8,
					    								"prize": 18,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds,
														"contestOrder": ++contestOrder

													});

													

												case(gamesAmnt >= 1):


													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "1 on 1 Tournement",
														"gameType": " NBA 20 Token 1 on 1 Tournement",
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
														"firstContestGame": buyingPeriodEnds,
														"contestOrder": ++contestOrder

													});

													contestsRef.child(formattedScheduleDate).push({

														"Entries": "",
														"gameTypeShort": "1 on 1 Tournement",
														"gameType": " NBA 20 Token 1 on 1 Tournement",
														"scoring": "[Double-Up]",
														"positionsPaid": 2,
					    								"entryAmnt": 20,
					    								"accepting": 4,
					    								"prize": 36,
														"draftEnds":  buyingPeriodEnds - buyingWindow,
														"contestStatus": "Accepting...",
														"nbaGamesAmnt": gamesAmnt,
														"buyingEnds": buyingWindow,
														"firstContestGame": buyingPeriodEnds,
														"contestOrder": ++contestOrder
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
														"firstContestGame": buyingPeriodEnds,
														"contestOrder": ++contestOrder

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
														"firstContestGame": buyingPeriodEnds,
														"contestOrder": ++contestOrder
													});
									

												
											}
										}
										

										}


								}

							}
						}
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

