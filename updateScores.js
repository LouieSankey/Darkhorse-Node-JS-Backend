function update(firebase, httpDate){



var firebaseDb = firebase.database();
var PlayerStatsRef = firebaseDb.ref("PlayerStats");

console.log("updateScores");

//every game night query the the api and import all stats into firebase. 

// var cron = require('cron');
// var cronJob = cron.job("0 */10 * * * *", function(){
//     // perform operation e.g. GET request http.get() etc.
//     console.info('cron job completed');
// }); 
// cronJob.start();


//first get game ids by date then for each game idea get player box scores and add them to firebase

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
            //console.log(body);

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
                            //console.log(object);

                            var date1 = httpDate.replace('/', '-');
                            var date2 = date1.replace('/', '-');

                            PlayerStatsRef.child(date2).child(object.player_id).set(object);

                            
                        }
                            
                    }
                });


            }

        }
    }
);

//then

}




module.exports.update = update;


