/*jslint node: true */
'use strict';

// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(process.env.PORT, '0.0.0.0');



var firebase = require("firebase");
//will be used for scheduling jobs
//var CronJob = require('cron').CronJob;

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});

var initializeEntries = require('./initializeEntries.js');
var updatePrices = require('./updatePrices.js');
var availablePlayers = require('./availablePlayers.js');

initializeEntries.update(firebase);
updatePrices.update(firebase);
availablePlayers.update(firebase);

