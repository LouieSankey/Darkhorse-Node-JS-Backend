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

var lastSeasonsScheduleDate = moment().utc();
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

		 var leagueAverageRef = firebaseDb.ref("LeagueAverages").child(firebaseFormatDate);


		 // leagueAverageRef.child("pts").set(average(pts));
		 // leagueAverageRef.child("reb").set(average(reb));
		 // leagueAverageRef.child("ast").set(average(ast));
		 // leagueAverageRef.child("stl").set(average(stl));
		 // leagueAverageRef.child("blk").set(average(blk));
		 // leagueAverageRef.child("_3pt").set(average(_3pt));
		 // leagueAverageRef.child("to").set(average(to));

		 leagueAverageRef.child("pts").set(100);
		 leagueAverageRef.child("reb").set(325);
		 leagueAverageRef.child("ast").set(350);
		 leagueAverageRef.child("stl").set(550);
		 leagueAverageRef.child("blk").set(500);
		 leagueAverageRef.child("_3pt").set(500);
		 leagueAverageRef.child("to").set(525);



	});

}

function average(category){
	var sum = 0;
	for(var i = 0; i < category.length; i++){
		sum += category[i];
	}
	return sum/category.length;

}

update();

module.exports.update = update;
