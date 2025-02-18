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


var firebaseDb = firebase.database();

//in heroku SCHEDULER will be after utc day changes so +1 day more than running DURING THE DAY i.e. 282 for scheduler 281 for local/day time
//leave set to scheduler time

var firebaseFormatDate = moment().subtract(1, 'days').utc().format('YYYY_MM_DD');
var httpDate = moment().utc().subtract(1, 'days').format('MM/DD/YYYY');
var PlayerStatsRef = firebaseDb.ref("PlayerStats");


console.log("get stats at " + httpDate);
console.log("put stats as " + firebaseFormatDate);

// //first get game ids by date then for each game id get player box scores and add them to firebase

var request = require('request');

var game_ids = [];

request.post(
    'http://api.probasketballapi.com/game',
    { form: { 
    	api_key: 'iSXHqcobFZlEJaWvs5mnk9eQU0fOpKMP',
    	date: httpDate
     } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            var jsonData = JSON.parse(body);

            for (var i = 0; i < jsonData.length; i++) {
                var game_id = jsonData[i].id;
                game_ids.push(game_id);
            }
// create a new request for each of the game_ids
            for (var j =0; j < game_ids.length; j++) {



      request.post(
                'http://api.probasketballapi.com/boxscore/player',
                { form: { 
                    api_key: 'iSXHqcobFZlEJaWvs5mnk9eQU0fOpKMP',
                    game_id: game_ids[j]
                 } },

                function (error, response, body) {

                    
                    if (!error && response.statusCode == 200) {

                        var jsonArray = JSON.parse(body);

                        for (var i = 0; i < jsonArray.length; i++) {
                            
                            var object = jsonArray[i];
                            PlayerStatsRef.child(firebaseFormatDate).child(object.player_id).set(object);


                        }

                            
                    }else{
                        console.log("error: " +error);
                    }
                });


            }


                        setTimeout(function(){
                    
                        var scoreContests = require("./calculateScores.js");
                        scoreContests.update(firebaseDb, firebaseFormatDate);
                        }, 30000);

                      


                         

                  


        }
    }
);

}

update();

module.exports.update = update;


