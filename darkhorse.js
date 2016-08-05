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

var lastSeasonsScheduleDate = moment().subtract(280, 'days');
var scheduleDate = lastSeasonsScheduleDate.format('ddd MMM D YYYY');
var apiDate = lastSeasonsScheduleDate.format('MM/DD/YYYY');
var firebaseDate = lastSeasonsScheduleDate.format('MM-DD-YYYY');

var initializeEntries = require('./initializeEntries.js');
var updatePrices = require('./updatePrices.js');
var availablePlayers = require('./availablePlayers.js');
var updateScores = require('./updateScores.js');
var initializeContests = require('./initializeContests.js');
var scoreContests = require('./scoreContests');

updatePrices.update(firebase);
availablePlayers.update(firebase, scheduleDate);
updateScores.update(firebase, apiDate, scheduleDate);
initializeContests.update(firebase, scheduleDate);
//initializeEntries.update(firebase, scheduleDate);
scoreContests.update(firebase, scheduleDate);




