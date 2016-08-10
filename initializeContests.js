//there should always be 7 or 8 contests going
//finished contests should move to a different reference, or single in a node
//finished contests should be replaced by another of the same game type
//contests should be organized by date ** (eventually)
//contests should count down to 30 minutes before the first scheduled game
//no more contests should be created less than 20 min before BUYING CLOSES to allow time

function update(firebase, scheduleDate){

	console.log("inside initialize");

var moment = require('moment');
var cron = require('cron');

var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('2015NBASchedule');
var contestsRef = firebaseDb.ref("Contests");
var fullContestsRef = firebaseDb.ref("FullContests");
var userRef = firebaseDb.ref("Users");
var scoreContests = require('./scoreContests');



//gets earliest game time for today, maybe code runs 8:00 every morning
schedule.on('value', function (snapshot){
	
	var earliestGameTime = moment('23:59', ["h:mm A"]).format("HH:mm");
	var gamesInDraft = 0;


	for (var i = 0; i < snapshot.val().length; i++) {
		
		var scheduledGame = snapshot.val()[i];
		if(scheduledGame.Date === scheduleDate){

			var gameTime = moment(scheduledGame['Start (ET)'], ["h:mm A"]).format("HH:mm");


			++gamesInDraft;

			if(gameTime <= earliestGameTime){

				earliestGameTime = gameTime;

			}

		}

	}


//gets the time that the drafts must end in order 
//for there to be a 15 min buying period before the first game

				var utc = moment.utc().valueOf();
				//for testing, change earliestGameTime to anytime in '00:00' format.
				var firstBuyingEnds = moment('21:00', 'HH:mm A').utc().valueOf();
				var buyingWindow = 60000 * 30;

				//var hourEnds = moment(earliestGameTime, 'HH').format("HH");
				//var minuteEnds = moment(earliestGameTime, 'mm').format("HH");

				contestsRef.once("value", function(location) {

					if(!location.child(scheduleDate).exists()){


							contestsRef.child(scheduleDate).push({
									"Entries": "",
									"gameType": "* NBA Free Round Royal 1 on 1",
									"positionsPaid": 0,
    								"entryAmnt": 0,
    								"accepting": 7,
    								"prize": 0,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});


						

									contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 1,
    								"entryAmnt": 50,
    								"prize": 250,
									"gameType": "* NBA $50 Round Royal 1 on 1",
    								"accepting": 5,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});



								contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 1,
    								"entryAmnt": 20,
    								"prize": 100,
									"gameType": "* NBA $20 Round Royal 1 on 1",
    								"accepting": 5,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});

									contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 1,
    								"entryAmnt": 10,
    								"prize": 20,
									"gameType": "* NBA $10 Round Royal 1 on 1",
    								"accepting": 2,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});


								contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 1,
    								"entryAmnt": 100,
    								"prize": 200,
									"gameType": "* NBA $100 Heads Up 1 on 1",
    								"accepting": 2,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});

									contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 0,
    								"entryAmnt": 0,
    								"prize": 0,
									"gameType": "* NBA Free Heads Up 1 on 1",
    								"accepting": 3,
									"draftEnds":  firstBuyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});


							}


						
						contestsRef.child(scheduleDate).on('child_added', function(contestSnapshot){

							var contest = contestSnapshot.val();

							var accepting = contest.accepting;
							var draftEnds = contest.draftEnds;
							var entryAmnt = contest.entryAmnt;
							var gameType = contest.gameType;
							var positionsPaid = contest.positionsPaid;
							var prize = contest.prize;
							var contestStatus = contest.contestStatus;

							var contestEntryRef = contestsRef.child(scheduleDate).child(contestSnapshot.key).child("Entries");

								var i = 0;

								contestEntryRef.on('child_added', function(entrySnapshot){

								var playersEntered = ++i;

									if(playersEntered === accepting){

										contestsRef.child(scheduleDate).child(contestSnapshot.key).child("contestStatus").set("buying");

										contestsRef.child(scheduleDate).push({

											"accepting": accepting,
											"draftEnds":  firstBuyingEnds - buyingWindow,
											"contestStatus": "drafting",
											"gameType": gameType,
											"nbaGamesAmnt": gamesInDraft,
											"buyingEnds": buyingWindow,
											"positionsPaid": positionsPaid,
											"entryAmnt": entryAmnt,
											"prize": prize

										});

										updateContestStatus(2 * 60000);
									}


								});



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

