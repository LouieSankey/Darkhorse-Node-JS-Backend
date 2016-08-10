/*jslint node: true */
'use strict';

function update(firebase, scheduleDate){

var firebaseDb = firebase.database();

var contestsRef = firebaseDb.ref('Contests').child(scheduleDate);
var playerStats = firebaseDb.ref("PlayerStats").child(scheduleDate);

contestsRef.once('value', function(allContests){

	allContests.forEach(function(singleContest) {

    var entriesRef = contestsRef.child(singleContest.key).child('Entries');

    entriesRef.once('value', function(entries){

    	entries.forEach(function(singleEntry){

    		var singleEntryRef = entriesRef.child(singleEntry.key);

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

    		playerStats.child(playerId).once('value', function(stats){


    			var stat = stats.val();
    			pts = stat.pts;
    			reb = stat.oreb + stat.dreb;
    			ast = stat.ast;
    			stl = stat.stl;
    			blk = stat.blk;
    			_3 = stat.fg3m;
    			to = stat.to;

    		var vsRef = entriesRef.child(singleEntry.key).child("VS");

    		vsRef.once('value', function(entryVS){

    			var ptsScore = 0.0;
    			var rebScore = 0.0;
    			var astScore = 0.0;
    			var stlScore = 0.0;
    			var blkScore = 0.0;
    			var _3Score = 0.0;
    			var toScore = 0.0;
    			var totalContestScore = 0.0;


    			entryVS.forEach(function(opponent){

					playerStats.child(opponent.val()[0].playerId).once('value', function(oppStats){

							var oppStat = oppStats.val();

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


///begin switch statment
	    					switch(scoreObject.statCategory) {
							    case 'Pts':

							    	var ptsPlusAmount = scoreObject.plusAmount;
									var ptsTotal = Number(pts) + Number(ptsPlusAmount);

									scoreRef.child("boxScore").set(Number(pts));
									scoreRef.child("totalScore").set(Number(ptsTotal));
									scoreRef.child("oppBoxScore").set(Number(oppPts));


									var oppPtsPlusAmount = scoreObject.opponentPlus;
									var oppPtsTotal = Number(oppPts) + Number(oppPtsPlusAmount);

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
										console.log("equal " + rebScore);

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
										console.log("equal " + astScore);

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
										console.log("equal " + stlScore);
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
										console.log("equal " + blkScore);										
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
							    case '-TO':

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

	

		    				} //end for loop
	    		
						singleEntryRef.child("score_Pts").set(ptsScore);
    					singleEntryRef.child("score_Reb").set(rebScore);
    					singleEntryRef.child("score_Ast").set(astScore);
    					singleEntryRef.child("score_Blk").set(blkScore);
    					singleEntryRef.child("score_Stl").set(stlScore);
    					singleEntryRef.child("score_3pt").set(_3Score);
    					singleEntryRef.child("score_To").set(toScore);
    					singleEntryRef.child("score_Total").set(totalContestScore);
    					contestsRef.child(singleContest.key).child("contestStatus").set("results");

	    				});

						
	


	    			}); // end for each opponent



	    		}); //
						


    		});
					
				//console.log("bottom " + singleEntry.key);
						
					
						
    	});  // end for each single entry
						

		});

   


  });


});





}


module.exports.update = update;