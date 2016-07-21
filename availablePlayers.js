function update(firebase){

var firebaseDb = firebase.database();
var rawPlayersRef = firebaseDb.ref("RawPlayerData");

	var pts = 0;
	var reb = 0;
	var ast = 0;
	var stl = 0;
	var blk = 0;
	var _3pt = 0;
	var to = 0;

//loops through the first time to establish an organic upper bound

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

//loops through the second time to reevaluate each player with a normalized value
	  var upperBound = ((pts-2)+(reb-2)+(ast-2)+(stl-2)+(blk-2)+(_3pt-2)+(to-2)) / 7;
	  var lowerBound = 0;

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



	  	var availablePlayersRef = firebaseDb.ref("AvailablePlayers");

	  	availablePlayersRef.child(j).set(normalizedPlayer);
	  	availablePlayersRef.child(j).update({

	  			  "_3g": normalizedPlayer['3g']
	  	});



		}
		


	});


	


}

module.exports.update = update;
