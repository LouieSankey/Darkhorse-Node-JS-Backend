/*jslint node: true */
'use strict';

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


