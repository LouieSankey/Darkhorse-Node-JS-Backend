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

var firebaseDb = firebase.database();
var scheduleDate = moment().utc().subtract(1, "days").format('YYYY_MM_DD');



var contestsRef = firebaseDb.ref('Contests').child(scheduleDate);
var usersRef = firebaseDb.ref("Users");

contestsRef.once('value', function(allContests){


	allContests.forEach(function(singleContest) {

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



					entries.forEach(function(singleEntry){
						positionCount++;

						
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

					});




					var count = 0;
					var prizePoolsAwarded = 0;

					var awardedTiedUsers = false;

					entries.forEach(function(singleEntry){

						++count;
						
						if(count <= positionsPaid){

						var contestNotificationRef = usersRef.child(singleEntry.key).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var contestPlayerNotificationRef = entriesRef.child(singleEntry.key).child("StatusNotification");

						// contestNotificationRef.set("Lost");
						// contestPlayerNotificationRef.set("Lost");
							

							if(!tiedWinningUsers.contains(singleEntry.key)){

								prizePoolsAwarded++;

							var balanceRef = usersRef.child(singleEntry.key).child("accountBalance");
							balanceRef.once('value', function(balance){

								var newBalance = balance.val() + prize;
								balanceRef.set(newBalance);
								
								console.log(newBalance + ":" + singleEntry.key + " is a winner of " + prize + " in " + singleContest.key);

							});


							contestPlayerNotificationRef.set("Won: " + prize);
							contestNotificationRef.set("Won: " + prize);

							}else if(!awardedTiedUsers){
								awardedTiedUsers = true;

								var prizePoolsSplit = positionsPaid - prizePoolsAwarded;
								var totalPrizePoolAmount = prizePoolsSplit * prize;
								var prizeForEach = totalPrizePoolAmount / tiedWinningUsers.length;

								

								for (var i = 0; i < tiedWinningUsers.length; i++) {
					
								var balanceRef = usersRef.child(tiedWinningUsers[i]).child("accountBalance");
								balanceRef.once('value', function(balance){

								var newBalance = balance.val() + prize;
								balanceRef.set(newBalance);


								
							});

						var notificationTiedRef = usersRef.child(tiedWinningUsers[i]).child("Notifications").child(scheduleDate).child(singleContest.key).child("StatusNotification");
						var playerTiedRef = entriesRef.child(tiedWinningUsers[i]).child("StatusNotification");
						notificationTiedRef.set("Won: " + prizeForEach + " (Tied)");
						playerTiedRef.set("Won: " + prizeForEach + " (Tied)");

									console.log(tiedWinningUsers[i] + " is tied for " + prizeForEach + " in " + singleContest.key);
								};



							}


						}


					

					});



				firebaseDb.ref("DarkhorseBalance").once('value', function(darkhorseBalance){
					var newDarkhorseBalance = darkhorseBalance.val() + ((singleContest.val().accepting * singleContest.val().entryAmnt) * 0.1);
					firebaseDb.ref("DarkhorseBalance").set(newDarkhorseBalance);
				});

				console.log("darkhorse gets " + (singleContest.val().accepting * singleContest.val().entryAmnt) * 0.1);


				}else{
					
					var entryAmount = singleContest.val().entryAmnt;

					//refund all users their buy in
					entries.forEach(function(singleEntry){
						var refundedUser = singleEntry.key;

						contestPlayerNotificationRef.set("Refunded: " + entryAmount);
						contestNotificationRef.set("Refunded: " + entryAmount);

								var balanceRef = usersRef.child(singleEntry.key).child("accountBalance");
								balanceRef.once('value', function(balance){

								var newBalance = balance.val() + entryAmount;
								balanceRef.set(newBalance);
								
							});

						console.log(refundedUser + " is refunded " + entryAmount + " in " + singleContest.key);
						console.log("darkhorse gets 0");


					});

				}
			}

    	//console.log(entries.val());

					
				});


			});

		});
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