//there should always be 7 or 8 contests going
//finished contests should move to a different reference, or single in a node
//finished contests should be replaced by another of the same game type
//contests should be organized by date ** (eventually)
//contests should count down to 30 minutes before the first scheduled game
//no more contests should be created less than 20 min before BUYING CLOSES to allow time

function update(firebase, scheduleDate){

var moment = require('moment');
var cron = require('cron');

var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('2015NBASchedule');
var contestsRef = firebaseDb.ref("Contests");
var fullContestsRef = firebaseDb.ref("FullContests");
var userRef = firebaseDb.ref("Users");


//gets earliest game time for today, maybe code runs 8:00 every morning
schedule.on('value', function (snapshot){
	
	var earliestGameTime = moment('23:59', ["h:mm A"]).format("HH:mm");

	var gamesInDraft = 0;

	for (var i = 0; i < snapshot.val().length; i++) {
		
		var scheduledGame = snapshot.val()[i];
		if(scheduledGame.Date === scheduleDate){
			++gamesInDraft;
			var gameTime = moment(scheduledGame['Start (ET)'], ["h:mm A"]).format("HH:mm");

			if(gameTime < earliestGameTime){
				earliestGameTime = gameTime;
			}

		}

	}


//gets the time that the drafts must end in order 
//for there to be a 15 min buying period before the first game

				var utc = moment.utc().valueOf();
				//for testing, change earliestGameTime to anytime in '00:00' format.
				var buyingEnds = moment("21:00", 'HH:mm A').utc().valueOf();
				var buyingWindow = 60000 * 30;

				var hourEnds = moment(earliestGameTime, 'HH').format("HH");
				var minuteEnds = moment(earliestGameTime, 'mm').format("HH");

				contestsRef.once("value", function(location) {
					if(!location.child(scheduleDate).exists()){

						//initialize all begining contests

								contestsRef.child(scheduleDate).push({
									"Entries": "",
									"gameType": "* NBA Free Round Royal 1 on 1 1",
									"positionsPaid": 0,
    								"entryAmnt": 0,
    								"accepting": 2,
    								"prize": 0,
									"draftEnds":  buyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});

								contestsRef.child(scheduleDate).push({
									"Entries": "",
									"positionsPaid": 0,
    								"entryAmnt": 0,
    								"prize": 0,
									"gameType": "* NBA Free Round Royal 1 on 1 2",
    								"accepting": 2,
									"draftEnds":  buyingEnds - buyingWindow,
									"contestStatus": "drafting",
									"nbaGamesAmnt": gamesInDraft,
									"buyingEnds": buyingWindow
								});


				
		

//gets the contest ref and goes throught each available contest once
//if contest are from the night before, all contests should be renewed -- how to tell??? check the draft time remaining

				contestsRef.child(scheduleDate).once('child_added', function (contestSnapshot){

			
						contestsRef.child(scheduleDate).child(contestSnapshot.key).on('value', function(childSnapshot){

							console.log(contestSnapshot.key);
							var playersEntered = childSnapshot.child('Entries').numChildren();
							var key = childSnapshot.key;
							var contest = childSnapshot.val();
							var accepting = contest.accepting;
							var draftEnds = contest.draftEnds;
							var entryAmnt = contest.entryAmnt;
							var gameType = contest.gameType;
							var positionsPaid = contest.positionsPaid;
							var prize = contest.prize;
							var contestStatus = contest.contestStatus;



							// if the contest has reached "buying" or the contest is full, remove
							// if(playersEntered === accepting && contestStatus !== "full"){

							// 	contestsRef.child(scheduleDate).child(key).child('contestStatus').set("full");


							// 	contestsRef.child(scheduleDate).push({

							// 		"accepting": accepting,
							// 		"draftEnds":  buyingEnds - buyingWindow,
							// 		"contestStatus": "drafting",
							// 		"gameType": gameType + "3",
							// 		"nbaGamesAmnt": gamesInDraft,
							// 		"buyingEnds": buyingWindow,
							// 		"positionsPaid": positionsPaid,
							// 		"entryAmnt": entryAmnt,
							// 		"prize": prize

							// 	});

						 // //updateContestStatus(key, "buying", buyingEnds - utc - buyingWindow);
						 // //updateContestStatus(key, "buying ended", buyingEnds - utc);

							// }

					
						});
					

	
			});

			}


		

	});
			


				

});



function updateContestStatus(key, updateText, time){

		setTimeout(function() {

			contestsRef.child(scheduleDate).child(key).update({
				"contestStatus":  updateText			
			});

		}, time);

}


}


module.exports.update = update;

