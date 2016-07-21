//gets values for every player and uses them to compute a price for each state based on standard deviation

function update(firebase){

var math = require('mathjs');

var firebaseDb = firebase.database();

var playersRef = firebaseDb.ref("Players");

	playersRef.on("value", function(snapshot){

	var players = snapshot.val();

	var pts = [];
	var reb = [];
	var ast = [];
	var stl = [];
	var blk = [];
	var _3pt = [];
	var to = [];

		 for (var i = 0; i < players.length; i++) {
		 	var player = players[i];

		 		pts.push(player.pg);
		 		reb.push(player.rg);
		 		ast.push(player.ag);
		 		stl.push(player.sg);
		 		blk.push(player.bg);
		 		_3pt.push(player['3g']);
		 		to.push(player.tog);

		 };

		 var priceAdjust = 600;

		 var sPts = priceAdjust - math.std(pts) * 100;
		 var sReb = priceAdjust - math.std(reb) * 100;
		 var sAst = priceAdjust - math.std(ast) * 100;
		 var sStl = priceAdjust - math.std(stl) * 100;
		 var sBlk = priceAdjust - math.std(blk) * 100;
		 var s3pt = priceAdjust - math.std(_3pt) * 100;
		 var sTo = priceAdjust - math.std(to) * 100;

		 var pricesRef = firebaseDb.ref("Prices");

		 pricesRef.child("pts").set(Math.ceil(sPts/5)*5);
		 pricesRef.child("reb").set(Math.ceil(sReb/5)*5);
		 pricesRef.child("ast").set(Math.ceil(sAst/5)*5);
		 pricesRef.child("stl").set(Math.ceil(sStl/5)*5);
		 pricesRef.child("blk").set(Math.ceil(sBlk/5)*5);
		 pricesRef.child("_3pt").set(Math.ceil(s3pt/5)*5);
		 pricesRef.child("to").set(Math.ceil(sTo/5)*5);


	});

}

module.exports.update = update;
