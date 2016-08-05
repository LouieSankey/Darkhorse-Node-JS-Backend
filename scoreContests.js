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

				var pts;
    			var reb;
    			var ast;
    			var stl;
    			var blk;
    			var _3;
    			var to;

    			var ptsScore = 0;
    			var rebScore = 0;
    			var astScore = 0;
    			var stlScore = 0;
    			var blkScore = 0;
    			var _3Score = 0;
    			var toScore = 0;

    			var oppPts;
    			var oppReb;
    			var oppAst;
    			var oppStl;
    			var oppBlk;
    			var opp_3;
    			var oppTo;

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

    			entryVS.forEach(function(opponent){

					playerStats.child(opponent.val()[0].playerId).once('value', function(oppStats){

							var oppStat = oppStats.val();
							console.log(oppStat);

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

	    					switch(scoreObject.statCategory) {
							    case 'Pts':

							    	var ptsPlusAmount = scoreObject.plusAmount;
									var ptsTotal = pts + ptsPlusAmount;
									scoreRef.child("boxScore").set(pts);
									scoreRef.child("totalScore").set(ptsTotal);

									var oppPtsPlusAmount = scoreObject.opponentPlus;
									var oppPtsTotal = oppPts + oppPtsPlusAmount;
							

									if(ptsTotal > oppPtsTotal){

										++ptsScore;

									}

							
							        break;
							    case 'Reb':

							    	var rebPlusAmount = scoreObject.plusAmount;
							    	var rebTotal = reb + rebPlusAmount;
							    	scoreRef.child("boxScore").set(reb);


							    	var oppRebPlusAmount = scoreObject.opponentPlus;
							    	var oppRebTotal = oppReb + oppRebPlusAmount;

							    	if(rebTotal > oppRebTotal){
							    		++rebScore;
							    	}

							    	//var rebPlusAmount = opponent.val()[i].plusAmount;
									//var rebTotal = reb + rebPlusAmount;
									//scoreRef.child("totalScore").set(rebTotal);
							        
							        break;
							     case 'Ast':
							        
							        break;
							    case 'Stl':
							        
							        break;
							    case 'Blk':
							        
							        break;
							    case '3PT':
							        
							        break;
							    case '-TO':
							        
							        break;
							  
							    default:
							         
								}


		    				}


    					singleEntryRef.child("Score_Pts").set(ptsScore);
    					singleEntryRef.child("Score_Reb").set(rebScore);

	    				});

	    			});



	    		});


    		});



    	});



    });


  });


});



}


module.exports.update = update;