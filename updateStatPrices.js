//gets values for every player and uses them to compute a price for each state based on standard deviation

function update(){

var firebase = require("./node_modules/firebase");
var http = require('http');
var moment = require('moment');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.PORT, '0.0.0.0');

firebase.initializeApp({
  serviceAccount: "serviceAccountCredentials.json",
  databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
});

var lastSeasonsScheduleDate = moment().utc().subtract(293, 'days');
var firebaseFormatDate = lastSeasonsScheduleDate.format('YYYY_MM_DD');
console.log(firebaseFormatDate);


var math = require('mathjs');

var firebaseDb = firebase.database();

var playersRef = firebaseDb.ref("AvailablePlayers").child(firebaseFormatDate);

	playersRef.on("value", function(snapshot){

	var players = snapshot.val();
	console.log(snapshot.val());

	var pts = [];
	var reb = [];
	var ast = [];
	var stl = [];
	var blk = [];
	var _3pt = [];
	var to = [];


		 for (var key in players) {

		 	var player = players[key];

		 		pts.push(player.pg);
		 		reb.push(player.rg);
		 		ast.push(player.ag);
		 		stl.push(player.sg);
		 		blk.push(player.bg);
		 		_3pt.push(player['3g']);
		 		to.push(player.tog);

		 }

		 var priceAdjust = 600;

		 console.log("pts", math.std(pts));
		 console.log("rebs", math.std(reb));
		 console.log("ast", math.std(ast));
		 console.log("stl", math.std(stl));
		 console.log("blk", math.std(blk));



		 var sPts = priceAdjust - math.std(pts) * 100;
		 var sReb = priceAdjust - math.std(reb) * 100;
		 var sAst = priceAdjust - math.std(ast) * 100;
		 var sStl = priceAdjust - math.std(stl) * 100;
		 var sBlk = priceAdjust - math.std(blk) * 100;
		 var s3pt = priceAdjust - math.std(_3pt) * 100;
		 var sTo = priceAdjust - math.std(to) * 100;

		 var pricesRef = firebaseDb.ref("Prices").child(firebaseFormatDate);

		 pricesRef.child("pts").set(Math.ceil(sPts/5)*5);
		 pricesRef.child("reb").set(Math.ceil(sReb/5)*5);
		 pricesRef.child("ast").set(Math.ceil(sAst/5)*5);
		 pricesRef.child("stl").set(Math.ceil(sStl/5)*5);
		 pricesRef.child("blk").set(Math.ceil(sBlk/5)*5);
		 pricesRef.child("_3pt").set(Math.ceil(s3pt/5)*5);
		 pricesRef.child("to").set(Math.ceil(sTo/5)*5);


	});

}

update();

module.exports.update = update;
