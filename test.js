var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('/'));

var userCount = 0;
var allUsers = [];

app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "index.html", function (err, data){

   		console.log(req.connection.remoteAddress);
   		res.end(data);
   		console.log(userCount + " users on this site");

   });
});

app.get('/app.js', function (req, res) {
   res.sendFile( __dirname + "/" + "app.js" );
});

var server = app.listen(8080, function () {});