
/*jslint node: true */
'use strict';
function update(firebase, date, firebaseFormatDate){

var firebaseDb = firebase.database();
var rawPlayersRef = firebaseDb.ref("RawPlayerData");
var nbaSchedule = firebaseDb.ref("2015Schedule");
var availablePlayersRef = firebaseDb.ref("AvailablePlayers");
var moment = require('moment');

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

		//availablePlayersRef.remove();


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

	  	normalizedPlayer.pg = Math.round(normalizedPlayer.pg * 10 ) / 10;
	  	normalizedPlayer.ag = Math.round(normalizedPlayer.ag * 10 ) / 10;
	  	normalizedPlayer.bg = Math.round(normalizedPlayer.bg * 10 ) / 10;
	  	normalizedPlayer.sg = Math.round(normalizedPlayer.sg * 10 ) / 10;
	  	normalizedPlayer.rg = Math.round(normalizedPlayer.rg * 10 ) / 10;
	  	normalizedPlayer.tog = Math.round(normalizedPlayer.tog * 10 ) / 10;
	  	normalizedPlayer['3g'] = Math.round(normalizedPlayer['3g'] * 10 ) / 10;

	  	if(normalizedPlayer.Team === "NOR"){
	  		normalizedPlayer.Team = "NOP";
	  	}

	

		for (var k = allGames.length - 1; k >= 0; k--) {
			if(allGames[k].Date === date){

				


						var gameTimeUtc = moment(allGames[k]['Start (ET)'], 'HH:mm A').utc().valueOf();

						normalizedPlayer.game_time = allGames[k]['Start (ET)'];
	  					normalizedPlayer.home = allGames[k].Home;
	  					normalizedPlayer.visiting = allGames[k].Visitor;

	  				
				//date = moment(date, 'YYYY MM DD').format('YYYY_MM_DD');


				if(allGames[k].Home === normalizedPlayer.Team){

				
					availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).set(normalizedPlayer);
	  		 		availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).update({"_3g": normalizedPlayer['3g']});
	  		 	  	availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).child('gameTimeUtc').set(gameTimeUtc);


				}
				if(allGames[k].Visitor === normalizedPlayer.Team){

					 availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).set(normalizedPlayer);
	  		 		availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).update({"_3g": normalizedPlayer['3g']});
	  		 	  	availablePlayersRef.child(firebaseFormatDate).child(normalizedPlayer.Name).child('gameTimeUtc').set(gameTimeUtc);
				}



			}
		}



	}

});

		

});


	


}

module.exports.update = update;
