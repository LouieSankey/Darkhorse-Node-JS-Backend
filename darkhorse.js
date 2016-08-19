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



//gets the current eastern standard time which is two hours ahead of Denver, and 4 hours ahead of cali
var lastSeasonsScheduleDate = moment().utc().subtract(281, 'days').subtract(4, 'hours');
var scheduleDate = lastSeasonsScheduleDate.format('ddd MMM D YYYY');
var apiDate = lastSeasonsScheduleDate.format('MM/DD/YYYY');
var firebaseFormatDate = lastSeasonsScheduleDate.format('YYYY_MM_DD');


 var initializeEntries = require('./initializeEntries.js');
 var updatePrices = require('./updateStatPrices.js');
 var availablePlayers = require('./getAvailablePlayers.js');
 var initializeContests = require('./initializeContests.js');
 var getPlayerStats = require('./getPlayerStats.js');

 //var scoreContests = require('./scoreContests');

 //var groupScheduleDates = require('./groupScheduleDates');


availablePlayers.update(firebase, scheduleDate, firebaseFormatDate);
getPlayerStats.update(firebase, apiDate, firebaseFormatDate);
initializeContests.update(firebase, scheduleDate);
initializeEntries.update(firebase, firebaseFormatDate);
updatePrices.update(firebase);

//scoreContests.update(firebase, firebaseFormatDate);

//groupScheduleDates.update(firebase, scheduleDate);






