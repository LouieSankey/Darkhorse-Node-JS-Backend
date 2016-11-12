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
var scheduleDate = moment().utc().format('YYYY_MM_DD');

console.log(scheduleDate);

var contestsRef = firebaseDb.ref('Contests').child(scheduleDate);
var usersRef = firebaseDb.ref("Users");

contestsRef.once('value', function(allContests){


	allContests.forEach(function(singleContest) {

    var entriesRef = contestsRef.child(singleContest.key).child('Entries');


    entriesRef.orderByChild("value").once('value', function(entries){


			if(entries.numChildren() > 0){

				if(singleContest.val().accepting === entries.numChildren()){

					// separate winners from loosers and award winners

					var prize = Number(singleContest.val().prize);
					var positionsPaid = singleContest.val().positionsPaid;
					var count = 0;

					var lastWinningPositionValue;

					entries.forEach(function(singleEntry){
						var winningUser = singleEntry.key;
						++count;
						if(count <= positionsPaid){
							//award prize amount to user
							

							var balanceRef = usersRef.child(winningUser).child("accountBalance");

							balanceRef.once('value', function(balance){

								var newBalance = balance.val() + prize;
								balanceRef.set(newBalance);
								console.log(newBalance + ":" + winningUser + " is a winner of " + prize + " in " + singleContest.key);

							});

							lastWinningPositionValue = singleEntry.val().score_Total;


						}else{

							if(lastWinningPositionValue === singleEntry.val().score_Total){

							  var balanceRef = usersRef.child(winningUser).child("accountBalance");

							 balanceRef.once('value', function(balance){
								 var newBalance = balance.val() + prize;
								 balanceRef.set(newBalance);
								console.log(newBalance + ":" + winningUser + " is a tied winner of " + prize + " in " + singleContest.key);
							});


						}


						}

						

					});

				// here add the rake to a darkhorse account

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

update();


module.exports.update = update;