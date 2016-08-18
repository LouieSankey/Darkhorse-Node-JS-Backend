/*jslint node: true */
'use strict';

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

var lastSeasonsScheduleDate = moment().subtract(281, 'days');
var scheduleDate = lastSeasonsScheduleDate.format('ddd MMM D YYYY');
var apiDate = lastSeasonsScheduleDate.format('MM/DD/YYYY');
var firebaseFormatDate = lastSeasonsScheduleDate.format('YYYY_MM_DD');


 var initializeEntries = require('./initializeEntries.js');
 var updatePrices = require('./updatePrices.js');
 var availablePlayers = require('./availablePlayers.js');
  var initializeContests = require('./newContestInit.js');
 var updateScores = require('./updateScores.js');





var scoreContests = require('./scoreContests');
 //var groupScheduleDates = require('./groupScheduleDates');

  //updatePrices.update(firebase);
  //availablePlayers.update(firebase, scheduleDate, firebaseFormatDate);
	//updateScores.update(firebase, apiDate, firebaseFormatDate);
  initializeContests.update(firebase, scheduleDate);
  initializeEntries.update(firebase, firebaseFormatDate);
//scoreContests.update(firebase, firebaseFormatDate);
 //groupScheduleDates.update(firebase, scheduleDate);






