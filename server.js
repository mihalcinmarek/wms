
var express = require("express");
var path = require ('path');
var server = new express();
var PORT = 3456


//server.get('/getCapabilities', function (request, response){
//    response.sendFile(path.join(__dirname + '\\getCapabilities.xml'))
//})

//server.get('/getQuery', function (request, response){
//    console.log(response.sendFile);
//    response.sendFile(path.join(__dirname + '\\getCapabilities.xml'))
//})

server.get('/cviko2.xml', function (request, response) {
    console.log(request,query)
    response.send(request,query)
  });

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});