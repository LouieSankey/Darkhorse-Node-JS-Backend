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


//in heroku scheduler will be after utc day changes so +1 day more than running during the day i.e. 282 for heroku 281 local/day time
//leave set to heroku time

//var firebaseDb = firebase.database();
//var scheduleDate = moment().utc().subtract(2, 'days').format('YYYY_MM_DD');

console.log(scheduleDate);

var contestsRef = firebaseDb.ref('Contests').child(scheduleDate);
var playerStats = firebaseDb.ref("PlayerStats").child(scheduleDate);

var contestCounter = 0;
contestsRef.once('value', function(allContests){
	

	allContests.forEach(function(singleContest) {
		++contestCounter;

    var entriesRef = contestsRef.child(singleContest.key).child('Entries');

    entriesRef.once('value', function(entries){

    	var entriesCounter = 0;

    	entries.forEach(function(singleEntry){
    		entriesCounter++;


    		var singleEntryRef = entriesRef.child(singleEntry.key);

    		if(entries.numChildren() === 1){
    			contestsRef.child(singleContest.key).child("contestStatus").set("Results");
    		}

    		var playerId = singleEntry.val().playerId;

				var pts = 0.0;
    			var reb = 0.0;
    			var ast = 0.0;
    			var stl = 0.0;
    			var blk = 0.0;
    			var _3 = 0.0;
    			var to = 0.0;

    			var oppPts = 0.0;
    			var oppReb = 0.0;
    			var oppAst = 0.0;
    			var oppStl = 0.0;
    			var oppBlk = 0.0;
    			var opp_3 = 0.0;
    			var oppTo = 0.0;


    			var ptsScore = 0.0;
    			var rebScore = 0.0;
    			var astScore = 0.0;
    			var stlScore = 0.0;
    			var blkScore = 0.0;
    			var _3Score = 0.0;
    			var toScore = 0.0;
    			var totalContestScore = 0.0;


    		playerStats.child(playerId).once('value', function(stats){


    			var stat = stats.val();


				if(!stats.exists()){


					pts = 0;
	    			reb = 0;
	    			ast = 0;
	    			stl = 0;
	    			blk = 0;
	    			_3 = 0;
	    			to = 0;

    			}else{


    			pts = stat.pts;
    			reb = stat.oreb + stat.dreb;
    			ast = stat.ast;
    			stl = stat.stl;
    			blk = stat.blk;
    			_3 = stat.fg3m;
    			to = stat.to;

    		}

    			
    		var vsRef = entriesRef.child(singleEntry.key).child("VS");


    		vsRef.once('value', function(entryVS){
    			var vsCounter = 0;



    			entryVS.forEach(function(opponent){
    				vsCounter++;

    				if(opponent.val()[0].playerId != null){

					playerStats.child(opponent.val()[0].playerId).once('value', function(oppStats){

					var oppStat = oppStats.val();


					if(!oppStats.exists()){

						console.log("no opponent stats")

			    			oppPts = 0;
			    			oppReb = 0;
			    			oppAst = 0;
			    			oppStl = 0;
			    			oppBlk = 0;
			    			opp_3 = 0;
			    			oppTo = 0;
    					
    				}else{

    					console.log("found opp stats")

							oppPts = oppStat.pts;
			    			oppReb = oppStat.oreb + oppStat.dreb;
			    			oppAst = oppStat.ast;
			    			oppStl = oppStat.stl;
			    			oppBlk = oppStat.blk;
			    			opp_3 = oppStat.fg3m;
			    			oppTo = oppStat.to;
    				


	    				for (var i = 0; i < opponent.val().length; i++) {

	    					var scoreRef = vsRef.child(opponent.key).child(i);
	    					var scoreObject = opponent.val()[i];


	    					if(!oppStats.exists){
	    						scoreRef.child("totalScore").set(0);
	    						
	    					}else{


///begin switch statment
	    					switch(scoreObject.statCategory) {
							    case 'Pts':

							    	var ptsPlusAmount = scoreObject.plusAmount;
							    	var ptsTotal;

									ptsTotal = Number(pts) + Number(ptsPlusAmount);
								

									scoreRef.child("boxScore").set(Number(pts));
									scoreRef.child("totalScore").set(Number(ptsTotal));
									scoreRef.child("oppBoxScore").set(Number(oppPts));


									var oppPtsPlusAmount = scoreObject.opponentPlus;
									var oppPtsTotal = Number(oppPts) + Number(oppPtsPlusAmount);

									oppPtsTotal = Number(oppPts) + Number(oppPtsPlusAmount);
								

									scoreRef.child("oppTotalScore").set(Number(oppPtsTotal));
							
									if(ptsTotal === oppPtsTotal){
										ptsScore = ptsScore + 0.5;									
										totalContestScore = totalContestScore + 0.5;
										console.log("equal " + ptsScore);
									}else if(ptsTotal > oppPtsTotal){
										++ptsScore;
										++totalContestScore;
									}	


									

							
							        break;
							    case 'Reb':

							    	var rebPlusAmount = scoreObject.plusAmount;
							    	var rebTotal = Number(reb) + Number(rebPlusAmount);
							    	scoreRef.child("boxScore").set(Number(reb));
									scoreRef.child("totalScore").set(Number(rebTotal));
									scoreRef.child("oppBoxScore").set(Number(oppReb));


							    	var oppRebPlusAmount = scoreObject.opponentPlus;
							    	var oppRebTotal = Number(oppReb) + Number(oppRebPlusAmount);

							    	scoreRef.child("oppTotalScore").set(Number(oppRebTotal));


							    	if(rebTotal === oppRebTotal){
										rebScore = rebScore + 0.5;
										totalContestScore = totalContestScore + 0.5;

									}else if(rebTotal > oppRebTotal){
							    		++rebScore;
							    		++totalContestScore;
							    	}

			
							        break;
							     case 'Ast':

							     	var astPlusAmount = scoreObject.plusAmount;
									var astTotal = Number(ast) + Number(astPlusAmount);
									scoreRef.child("boxScore").set(Number(ast));
									scoreRef.child("totalScore").set(Number(astTotal));
									scoreRef.child("oppBoxScore").set(Number(oppAst));

									var oppAstPlusAmount = scoreObject.opponentPlus;
									var oppAstTotal = Number(oppAst) + Number(oppAstPlusAmount);

									scoreRef.child("oppTotalScore").set(Number(oppAstTotal));

							
									if(astTotal === oppAstTotal){
										astScore = astScore + 0.5;
										totalContestScore = totalContestScore + 0.5;

									}else if(astTotal > oppAstTotal){

										++astScore;
										++totalContestScore;

									}


							        
							        break;
							    case 'Stl':

							     	var stlPlusAmount = scoreObject.plusAmount;
									var stlTotal = Number(stl) + Number(stlPlusAmount);
									scoreRef.child("boxScore").set(Number(stl));
									scoreRef.child("totalScore").set(Number(stlTotal));
									scoreRef.child("oppBoxScore").set(Number(oppStl));

									var oppStlPlusAmount = scoreObject.opponentPlus;
									var oppStlTotal = Number(oppStl) + Number(oppStlPlusAmount);

									scoreRef.child("oppTotalScore").set(Number(oppStlTotal));


									if(stlTotal === oppStlTotal){
										stlScore = stlScore + 0.5;
										totalContestScore = totalContestScore + 0.5;
									}else if(stlTotal > oppStlTotal){
										++stlScore;
										++totalContestScore;
									}


							        break;
							    case 'Blk':

							     	var blkPlusAmount = scoreObject.plusAmount;
									var blkTotal = Number(blk) + Number(blkPlusAmount);
									scoreRef.child("boxScore").set(Number(blk));
									scoreRef.child("totalScore").set(Number(blkTotal));
									scoreRef.child("oppBoxScore").set(Number(oppBlk));

									var oppBlkPlusAmount = scoreObject.opponentPlus;
									var oppBlkTotal = Number(oppBlk) + Number(oppBlkPlusAmount);
							
									scoreRef.child("oppTotalScore").set(Number(oppBlkTotal));


									if(blkTotal === oppBlkTotal){
										blkScore = blkScore + 0.5;
										totalContestScore = totalContestScore + 0.5;
									}else if(blkTotal > oppBlkTotal){
										++blkScore;
										++totalContestScore;
									}


							        break;
							    case '3Pt':

							     	var _3PlusAmount = scoreObject.plusAmount;
									var _3Total = Number(_3) + Number(_3PlusAmount);
									scoreRef.child("boxScore").set(Number(_3));
									scoreRef.child("totalScore").set(Number(_3Total));
									scoreRef.child("oppBoxScore").set(Number(opp_3));

									var opp_3PlusAmount = scoreObject.opponentPlus;

									var opp_3Total = Number(opp_3) + Number(opp_3PlusAmount);

									scoreRef.child("oppTotalScore").set(Number(opp_3Total));
							
									if(_3Total === opp_3Total){
										_3Score = _3Score + 0.5;
										totalContestScore = totalContestScore + 0.5;
									}else if(_3Total > opp_3Total){
										++_3Score;
										++totalContestScore;
									}

							        break;
							    case 'Low TO':

							     	var toPlusAmount = scoreObject.plusAmount;
									var toTotal = Number(to) - Number(toPlusAmount);
									scoreRef.child("boxScore").set(Number(to));
									scoreRef.child("totalScore").set(Number(toTotal));
									scoreRef.child("oppBoxScore").set(Number(oppTo));

									var oppToPlusAmount = scoreObject.opponentPlus;
									var oppToTotal = Number(oppTo) - Number(oppToPlusAmount);

									scoreRef.child("oppTotalScore").set(Number(oppToTotal));
							

									if(toTotal === oppToTotal){
										toScore = toScore + 0.5;
										totalContestScore = totalContestScore + 0.5;
									}else if(toTotal < oppToTotal){
										++toScore;
										++totalContestScore;
									}

							        
							        break;
							  
							    default:

							    break;
							         
								} //end switch statment

							}
						}

	

		    				} //end for loop
	    		
						singleEntryRef.child("score_Pts").set(ptsScore);
    					singleEntryRef.child("score_Reb").set(rebScore);
    					singleEntryRef.child("score_Ast").set(astScore);
    					singleEntryRef.child("score_Blk").set(blkScore);
    					singleEntryRef.child("score_Stl").set(stlScore);
    					singleEntryRef.child("score_3pt").set(_3Score);
    					singleEntryRef.child("score_To").set(toScore);
    					singleEntryRef.child("reverse_Score").set(-1 * totalContestScore);
    					singleEntryRef.child("score_Total").set(totalContestScore);
    					contestsRef.child(singleContest.key).child("contestStatus").set("Results");

    			

	    				});


    					
					}

				
						

 	    			}); // end for each opponent

				




	    		}); //


						


    		});


	


					
						
    	});  // end for each single entry
			

		});


  }); //ends single contest


});


						setTimeout(function(){
							var awardTokensAll = require("./awardTokensAll.js");
							awardTokensAll.update(firebaseDb, scheduleDate);
						}, 60000);

              			


}

//update();


module.exports.update = update;