
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


var FCM = require('fcm-node');
var serverKey = 'AIzaSyDgYtB8klH4KbDgeml3YmzpAnhb2_m6Y8s';  
var fcm = new FCM(serverKey);
var contestTopic = "test";

var message = { 
    to: '/topics/' + "SkipToMyLou", 
    data: {
        title: 'A player has entered your contest.',
        message: 'Buy stats against him now.'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
        console.log(err);
    } else {
        console.log("Successfully sent with response: ", response);
    }
});

}

update();