/*jslint node: true */
'use strict';

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.PORT, '0.0.0.0');


//a random date from last season, will eventually get the current date
var date = "Tue Oct 27 2015";
var httpDate = "10/27/2015";

var firebase = require("./node_modules/firebase");

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});

var initializeEntries = require('./initializeEntries.js');
var updatePrices = require('./updatePrices.js');
var availablePlayers = require('./availablePlayers.js');
var updateScores = require('./updateScores.js');
var initializeContests = require('./initializeContests.js');

initializeEntries.update(firebase);
updatePrices.update(firebase);
availablePlayers.update(firebase, date);
updateScores.update(firebase, httpDate);
initializeContests.update(firebase, date);


