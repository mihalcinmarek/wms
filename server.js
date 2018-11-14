
var express = require('express');
var path = require ('path');
var server = express();
var fs = require ('fs');
var mapnik = require ('mapnik')
var generateImage = require ('./generate_img.js');
var PORT = 3456;


console.log(generateImage);

server.get('/wms', function (request, response) {
    var params = request.query;
    console.log(params);

    if (params.service === 'WMS' && params.request === 'GetCapabilities') {
        response.sendFile (path.join(__dirname , 'GetCapabilities.xml'))
    } else if (params.service === 'WMS' && params.request === 'getMap'){
        generateImage(params, response.sendFile.bind(response))
    } else {
        response.send ('posral si to')
    }  
  });

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});