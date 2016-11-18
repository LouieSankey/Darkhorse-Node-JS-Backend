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



var scheduleDate = moment().utc().format('YYYY_MM_DD');

var firebaseDb = firebase.database();
var serverTime = firebaseDb.ref('serverTime');
var updateResults = firebaseDb.ref('UpdateResults');



serverTime.set(firebase.database.ServerValue.TIMESTAMP);
updateResults.set(scheduleDate);


}
update();