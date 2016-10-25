
// a script for organizing the raw schedule data by dates instead of arbitrary numbers


function update(){

var http = require('http');
var firebase = require("./node_modules/firebase");

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.PORT, '0.0.0.0');

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});

var moment = require('moment');
var firebaseDb = firebase.database();
var schedule = firebaseDb.ref('2016Schedule');
var datedSchedule = firebaseDb.ref('2016DatedSchedule');


schedule.on('value', function (snapshot){

	for (var i = 0; i < snapshot.val().length; i++) {
		
		var scheduledGame = snapshot.val()[i];

		var gameDate = moment(scheduledGame.Date, ['MMMM D, YYYY']).format('YYYY_MM_DD');

		var gameTime = moment(scheduledGame['Start (ET)'], ["h:mm A"]).format("HH:mm");

		datedSchedule.child(gameDate).child(gameTime).child(i).set(scheduledGame);

	}

});



}

update();