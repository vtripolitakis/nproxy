var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var options = {
      key: fs.readFileSync('./privatekey.pem', 'utf8'),
      cert: fs.readFileSync('./certificate.pem', 'utf8')
   };


app.get('/', function (req, res) {
  res.send('hello');
});

app.get('/fetch/:link', function (req,res) {
	var link = req.params.link;
	var out='';
	var request = require('request');
	var tmpReq = request(link);
	
	tmpReq.on('error', function (error) {
	  // handle any request errors
	  console.log('error detected - see logs');
	});

	tmpReq.on('response', function (tmpRes) {
	  if (tmpRes.statusCode != 200) return this.emit('error', new Error('Bad status code'));	  	
		var body = '';
		  tmpRes.on('data', function (chunk) {
		    body += chunk;
		  });
		  tmpRes.on('end', function () {
		    	res.send(body);		    	
		  });
	});

});

http.createServer(app).listen(5000);
https.createServer(options, app).listen(8080);