/*jslint node: true */
'use strict';
function update(){

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


var ScheduleDate = moment().utc();

var date = ScheduleDate.format('MMMM D, YYYY');
var firebaseFormatDate = ScheduleDate.format('YYYY_MM_DD');
console.log(firebaseFormatDate);

var firebaseDb = firebase.database();
var rawPlayersRef = firebaseDb.ref("RawPlayerData").child("Sheet 1");
var nbaSchedule = firebaseDb.ref("2016Schedule");
var availablePlayersRef = firebaseDb.ref("AvailablePlayers");


var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var injuredPlayers = [];
var questionablePlayers = [];

request('http://www.cbssports.com/nba/injuries/daily', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    $('tr.row1').each(function(i, element){

		var injuredPlayer = $(this).children('td').eq(2);
    	var questionable = $(this).children('td').eq(5);
    	if(questionable.text() === "Game Time Decision"){
    		questionablePlayers.push(injuredPlayer.text().replace(/\./g,''));
    	}else{
    		injuredPlayers.push(injuredPlayer.text().replace(/\./g,''));

    	}

    });

       $('tr.row2').each(function(i, element){
    			var injuredPlayer = $(this).children('td').eq(2);
    	var questionable = $(this).children('td').eq(5);
    	if(questionable.text() === "Game Time Decision"){
    		questionablePlayers.push(injuredPlayer.text().replace(/\./g,''));
    	}else{
    		injuredPlayers.push(injuredPlayer.text().replace(/\./g,''));

    	}

    });

  }
});


nbaSchedule.on('value', function (snapshot){
	var allGames = snapshot.val();

	var pts = 0;
	var reb = 0;
	var ast = 0;
	var stl = 0;
	var blk = 0;
	var _3pt = 0;
	var to = 0;

//loops through the raw player data to establish an organic upper bound
	rawPlayersRef.on('value', function (snapshot) {


		var allPlayers = snapshot.val();

		for (var i = 0; i < allPlayers.length; i++) {

			var rawPlayer = allPlayers[i];


		if(rawPlayer.pV > pts){
			pts = rawPlayer.pV;
		}
		if(rawPlayer.rV > reb){
			reb = rawPlayer.rV;
		}
		if(rawPlayer.aV > ast){
			ast = rawPlayer.aV;
		}
		if(rawPlayer.sV > stl){
			stl = rawPlayer.sV;
		}
		if(rawPlayer.bV > blk){
			blk = rawPlayer.bV;
		}
		if(rawPlayer['3V'] > _3pt){
			_3pt = rawPlayer['3V'];
		}
		if(rawPlayer.toV > to){
			to = rawPlayer.toV;
		}

	}

	  var upperBound = ((pts-2)+(reb-2)+(ast-2)+(stl-2)+(blk-2)+(_3pt-2)+(to-2)) / 7;
	  var lowerBound = 0;


//loops through the second time to reevaluate each player with a normalized value

	  for (var j = 0; j < allPlayers.length; j++) {

	  	var normalizedPlayer = allPlayers[j];

	  	var normalizedValue = 0.5 + (normalizedPlayer.Value - lowerBound) * (0.95 - 0.5) / (upperBound - lowerBound);
	  	var price = normalizedValue * 10000;

	  	normalizedPlayer.Value = Math.ceil(price/5)*5;

	  	normalizedPlayer.p = Math.round(normalizedPlayer.p * 10 ) / 10;
	  	normalizedPlayer.a = Math.round(normalizedPlayer.a * 10 ) / 10;
	  	normalizedPlayer.b = Math.round(normalizedPlayer.b * 10 ) / 10;
	  	normalizedPlayer.s = Math.round(normalizedPlayer.s * 10 ) / 10;
	  	normalizedPlayer.r = Math.round(normalizedPlayer.r * 10 ) / 10;
	  	normalizedPlayer.to = Math.round(normalizedPlayer.to * 10 ) / 10;
	  	normalizedPlayer['3'] = Math.round(normalizedPlayer['3'] * 10 ) / 10;

	  	if(normalizedPlayer.Team === "NOR"){
	  		normalizedPlayer.Team = "NOP";
	  	}



			if(injuredPlayers.contains(normalizedPlayer.Name)){
				normalizedPlayer.Inj = "Injured";
			}else if(questionablePlayers.contains(normalizedPlayer.Name)){
				normalizedPlayer.Inj = "Questionable";
			}else{
				normalizedPlayer.Inj = "";
			}
	

	

		for (var k = allGames.length - 1; k >= 0; k--) {
			if(allGames[k].Date === date){

			
						var gameTimeUtc = moment(allGames[k]['Start (ET)'], 'HH:mm A').utc().subtract(5, "hours").valueOf();

						normalizedPlayer.game_time = allGames[k]['Start (ET)'];
	  					normalizedPlayer.home = allGames[k].Home;
	  					normalizedPlayer.visiting = allGames[k].Visitor;

	  				
				//date = moment(date, 'YYYY MM DD').format('YYYY_MM_DD');


				if(allGames[k].Home === normalizedPlayer.Team){

				
					availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).set(normalizedPlayer);
	  		 		availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).update({"_3": normalizedPlayer['3']});
	  		 	  	availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).child('gameTimeUtc').set(gameTimeUtc);


				}
				if(allGames[k].Visitor === normalizedPlayer.Team){

					 availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).set(normalizedPlayer);
	  		 		availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).update({"_3": normalizedPlayer['3']});
	  		 	  	availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).child('gameTimeUtc').set(gameTimeUtc);
				}



			}

		}



	}

});

});




var initializeContests = require("./getContestsFromSchedule.js");
initializeContests.update(firebase);


}

	Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
update();

module.exports.update = update;
