
function update(){

var http = require('http');
var moment =require('moment');
var firebase = require("./node_modules/firebase");

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(process.env.PORT, '0.0.0.0');

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});


var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var injuredPlayers = [];


request('http://www.cbssports.com/nba/injuries/daily', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    $('tr.row1').each(function(i, element){
    	var a = $(this).children('td').eq(5);
    	injuredPlayers.push(a.text());

      	//var b = $(this).children('td').eq(5);

    });

       $('tr.row2').each(function(i, element){
    	var a = $(this).children('td').eq(5);
    	injuredPlayers.push(a.text());

      	//var b = $(this).children('td').eq(5);

    });

       for (var i = 0; i < injuredPlayers.length; i++) {
       	console.log(injuredPlayers[i]);
       };



  }
});


}

update();




