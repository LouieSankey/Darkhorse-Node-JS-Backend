/*jslint node: true */
'use strict';

var http = require('http');
var moment =require('moment');
var firebase = require("./node_modules/firebase");
 var cron = require('cron').CronJob;



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
 var updatePrices = require('./updatePrices.js');
 var availablePlayers = require('./availablePlayers.js');
 var initializeContests = require('./newContestInit.js');
 var updateScores = require('./updateScores.js');

//var scoreContests = require('./scoreContests');
 //var groupScheduleDates = require('./groupScheduleDates');


//every 10 minuts: "0 */10 * * * *"  -- every day at 8pm system time '00 00 20 * * 1-7'

var cronJob = cron.job('00 00 01 * * 1-7', function(){

availablePlayers.update(firebase, scheduleDate, firebaseFormatDate);
updateScores.update(firebase, apiDate, firebaseFormatDate);
initializeContests.update(firebase, scheduleDate);
initializeEntries.update(firebase, firebaseFormatDate);

}); 

cronJob.start();


availablePlayers.update(firebase, scheduleDate, firebaseFormatDate);
updateScores.update(firebase, apiDate, firebaseFormatDate);
initializeContests.update(firebase, scheduleDate);
initializeEntries.update(firebase, firebaseFormatDate);

//updatePrices.update(firebase);
//scoreContests.update(firebase, firebaseFormatDate);
//groupScheduleDates.update(firebase, scheduleDate);






