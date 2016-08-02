//there should always be 7 or 8 contests going
//finished contests should move to a different reference
//finished contests should be replaced by another of the same game type
//contests should be organized by date ** (eventually)
//contests should count down to 15 minutes before the first scheduled game
//no more contests should be created 10 minutes before the first game to allow draft time

function update(firebase, date){

var moment = require('moment');

//var date1 = httpDate.replace('/', '-');
//var date2 = date1.replace('/', '-');

var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('2015NBASchedule');

schedule.on('value', function (snapshot){

	var earliestGameTime = moment('23:59', ["h:mm A"]).format("HH:mm");
	var gamesInDraft = 0;

	for (var i = 0; i < snapshot.val().length; i++) {
		
		var scheduledGame = snapshot.val()[i];
		if(scheduledGame.Date === date){
			++gamesInDraft;
			var gameTime = moment(scheduledGame['Start (ET)'], ["h:mm A"]).format("HH:mm");

			if(gameTime < earliestGameTime){
				earliestGameTime = gameTime;
			}

		}

	}


//gets the time that the drafts must end in order 
//for there to be a 15 min buying period before the first game


				var contestsEnd = moment(earliestGameTime, 'HH:mm A').utc().valueOf();

				var contestsRef = firebaseDb.ref("Contests");
				contestsRef.on('value', function (snapshot){

					for (var i = 0; i < snapshot.val().length; i++) {

						var contest = snapshot.val()[i];

						contestsRef.child(i).update({
							"draftEnds":  contestsEnd - 60000 * 30,
							"nbaGamesAmnt": gamesInDraft,
							"buyingEnds": 60000 * 30
						});

		
					}


				});


});



//then

}


module.exports.update = update;

