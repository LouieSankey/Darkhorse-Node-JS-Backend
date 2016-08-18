
// a script for organizing the raw schedule data by dates instead of arbitrary numbers


function update(firebase){

var moment = require('moment');
var cron = require('node-cron');
var scoreContests = require('./scoreContests');
var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('2015Schedule');
var datedSchedule = firebaseDb.ref('DatedSchedule');


schedule.on('value', function (snapshot){

	for (var i = 0; i < snapshot.val().length; i++) {
		
		var scheduledGame = snapshot.val()[i];

		var gameDate = moment(scheduledGame.Date, ['ddd MMM D YYYY']).format('YYYY_MM_DD');

		var gameTime = moment(scheduledGame['Start (ET)'], ["h:mm A"]).format("HH:mm");

		datedSchedule.child(gameDate).child(gameTime).child(i).set(scheduledGame);

	}

});



}

module.exports.update = update;