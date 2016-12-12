/*jslint node: true */
'use strict';

function update(firebaseDb, scheduleDate){

var http = require('http');
var moment =require('moment');
//var firebase = require("./node_modules/firebase");

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(process.env.PORT, '0.0.0.0');

// firebase.initializeApp({
//   serviceAccount: "serviceAccountCredentials.json",
//   databaseURL: "https://darkhorsefantasysports.firebaseio.com/"
// });


//var scheduleDate = moment().utc().subtract(1, "days").format('YYYY_MM_DD');
console.log(scheduleDate);

//var firebaseDb = firebase.database();


var contestsRef = firebaseDb.ref('Contests').child(scheduleDate);
var usersRef = firebaseDb.ref("Users");

var playerStatsRef = firebaseDb.ref("PlayerStats").child(scheduleDate);
var availablePlayersRef = firebaseDb.ref("AvailablePlayers").child(scheduleDate);

var playerAwardTotals = {}

availablePlayersRef.on('value', function(allAvailableSnapshot){
playerStatsRef.on('value', function(allReportedSnapshot){

//if(allAvailableSnapshot.numChildren() < allReportedSnapshot.numChildren()){



contestsRef.once('value', function(allContests){



	allContests.forEach(function(singleContest) {

		console.log(singleContest.key)

    var entriesRef = contestsRef.child(singleContest.key).child('Entries');


    entriesRef.orderByChild("reverse_Score").once('value', function(entries){


			if(entries.numChildren() > 0){



				if(singleContest.val().accepting === entries.numChildren()){

					// separate winners from loosers and award winners

					var prize = Number(singleContest.val().prize);
					var positionsPaid = singleContest.val().positionsPaid;


					var lastWinningPositionValue;
					var lastWinningUser;
					var tiedWinningUsers = [];

					var lastWinningCompareValue;
					var compareCount = 0;
					var positionCount = 0;

					var noStatsForPlayer = false;



					entries.forEach(function(singleEntry){
						positionCount++;

						var contestNotificationRef = usersRef.child(singleEntry.key).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var contestPlayerNotificationRef = entriesRef.child(singleEntry.key).child("StatusNotification");


						if(singleEntry.val().score_Total === 0){
							noStatsForPlayer = true;

						
						contestNotificationRef.set("Pending");
						contestPlayerNotificationRef.set("Pending");

						console.log("score pending");


						}else{

							contestNotificationRef.set("Lost");
							contestPlayerNotificationRef.set("Lost")


						if(singleEntry.val().score_Total === lastWinningPositionValue){

							if(lastWinningCompareValue != lastWinningPositionValue){

								compareCount++;
								lastWinningCompareValue = lastWinningPositionValue;
								

								if(compareCount >= 2 && positionsPaid >= (positionCount - 1)){
									tiedWinningUsers = [];
									compareCount--;
								}

							}



							if(compareCount <= 1){

							tiedWinningUsers.push(singleEntry.key);
							//console.log("pushed: " + singleEntry.key + " in " + singleContest.key);

							if(!tiedWinningUsers.contains(lastWinningUser)){
								tiedWinningUsers.push(lastWinningUser);
								//console.log("also pushed: " + lastWinningUser + " in " + singleContest.key);
							}

						}

						}



						lastWinningUser = singleEntry.key;
						lastWinningPositionValue = singleEntry.val().score_Total

					}

					});


					var count = 0;
					var prizePoolsAwarded = 0;

					var awardedTiedUsers = false;

					entries.forEach(function(singleEntry){

						var playerName = singleEntry.key;

						if(noStatsForPlayer){

						var contestNotificationRef = usersRef.child(singleEntry.key).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var contestPlayerNotificationRef = entriesRef.child(singleEntry.key).child("StatusNotification");
						contestNotificationRef.set("Pending");
						contestPlayerNotificationRef.set("Pending");

						console.log("player scores pending")

						}else{
					
				
						++count;
						
						if(count <= positionsPaid){

						var contestNotificationRef = usersRef.child(playerName).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var contestPlayerNotificationRef = entriesRef.child(playerName).child("StatusNotification");

							if(!tiedWinningUsers.contains(singleEntry.key)){

								prizePoolsAwarded++;

							if(!playerAwardTotals.hasOwnProperty(playerName)){
								console.log(playerName + " initialized with " + prize);

								playerAwardTotals[playerName] = prize;
							}else{


								console.log(playerName + " has " + playerAwardTotals[playerName] + " and was awarded " + prize + " giving a new total of " + (prize + playerAwardTotals[playerName]));

								playerAwardTotals[playerName] += prize;
							}


							contestPlayerNotificationRef.set("Won: " + prize);
							contestNotificationRef.set("Won: " + prize);

							}else if(!awardedTiedUsers){
								awardedTiedUsers = true;
								var prizePoolsSplit = positionsPaid - prizePoolsAwarded;
								var totalPrizePoolAmount = prizePoolsSplit * prize;
								var prizeForEach = totalPrizePoolAmount / tiedWinningUsers.length;

						//awards each tied user in the money with correct amount
								for (var i = 0; i < tiedWinningUsers.length; i++) {

									var tiedUser = tiedWinningUsers[i];

								if(!playerAwardTotals.hasOwnProperty(tiedUser)){

								console.log(tiedUser + " initialized and tied with " + prizeForEach);
								playerAwardTotals[tiedUser] = prizeForEach;



								}else{

									console.log(tiedUser + " has " + playerAwardTotals[tiedUser] + " and is awarded a tied amount of " + prizeForEach + " giving a new total of " + (playerAwardTotals[tiedUser] + prizeForEach));

									playerAwardTotals[tiedUser] += prizeForEach;



								}



						var notificationTiedRef = usersRef.child(tiedWinningUsers[i]).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var playerTiedRef = entriesRef.child(tiedWinningUsers[i]).child("StatusNotification");
						notificationTiedRef.set("Won: " + prizeForEach + " (Tied)");
						playerTiedRef.set("Won: " + prizeForEach + " (Tied)");

								};



							}


						}
					}


					

					});


				//award 10% from each viable contest to darkhorse account
				firebaseDb.ref("DarkhorseBalance").once('value', function(darkhorseBalance){
					var newDarkhorseBalance = darkhorseBalance.val() + ((singleContest.val().accepting * singleContest.val().entryAmnt) * 0.1);
					firebaseDb.ref("DarkhorseBalance").set(newDarkhorseBalance);
				});

				console.log("darkhorse gets " + (singleContest.val().accepting * singleContest.val().entryAmnt) * 0.1);
				

				}
				//refund all users their buy in if contest did not fill
				else{
					
					var entryAmount = singleContest.val().entryAmnt;

					
					entries.forEach(function(singleEntry){

						var contestNotificationRef = usersRef.child(singleEntry.key).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var contestPlayerNotificationRef = entriesRef.child(singleEntry.key).child("StatusNotification");

						contestNotificationRef.once("value", function(refundSnapshot){
							if(refundSnapshot.val() !== "Refunded: " + entryAmount){

								var refundedUser = singleEntry.key;

						contestPlayerNotificationRef.set("Refunded: " + entryAmount);
						contestNotificationRef.set("Refunded: " + entryAmount);

							if(!playerAwardTotals.hasOwnProperty(refundedUser)){
								console.log(refundedUser + " initialized and tied with " + entryAmount);
								playerAwardTotals[refundedUser] = entryAmount;
							}else{
								console.log(refundedUser + " new total is after tied awarded" + (entryAmount + playerAwardTotals[refundedUser]));
								playerAwardTotals[refundedUser] += entryAmount;

							}



						console.log(refundedUser + " is refunded " + entryAmount + " in " + singleContest.key);
						console.log("darkhorse gets 0");

							}else{
								console.log("already refunded");
							}


						})

						


					});

				}
			}




    	//console.log(entries.val());

					
				});



			});



		});

	//}

 						setTimeout(function(){

 								for (var key in playerAwardTotals) {



 									 firebaseDb.ref("Users").child(key).once('value', function(snapshot){
									    	
									    	console.log(snapshot.key);

									    	var newBalance = playerAwardTotals[snapshot.key] + snapshot.val().accountBalance;
									    	firebaseDb.ref("Users").child(snapshot.key).child("accountBalance").set(newBalance);

									    });



									}
                   
                        		}, 10000);


  	

	Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;

// var serverTime = firebaseDb.ref('serverTime');
// serverTime.set(firebase.database.ServerValue.TIMESTAMP);

      

//three closing tages for availablePlayers, reportedPlayers, comparative if statement
}



});

});






}

//update();


module.exports.update = update;