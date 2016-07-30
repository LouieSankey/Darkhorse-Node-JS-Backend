/*jslint node: true */
'use strict';

// var express = require('express');
// var app     = express();

// app.set('port', (process.env.PORT || 5000));

// //For avoidong Heroku $PORT error
// app.get('/', function(request, response) {
//     var result = 'App is running';
//     response.send(result);
// }).listen(app.get('port'), function() {
//     console.log('App is running, server is listening on port ', app.get('port'));
// });



var firebase = require("./node_modules/firebase");
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

// var http = require('http'); 
// http.createServer(function (req, res) { 
// 	res.writeHead(200, {
// 		'Content-Type': 'text/plain'
// 	}); res.send('it is running\n'); 
// }).listen(process.env.PORT || 5000);

