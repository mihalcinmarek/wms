var express = require("express");
var server = express();
var path=require('path');
var fs = require("fs");
var mapnik = require("mapnik");
var generateImage = require('./generateimage.js');
var PORT=3456;

server.get("/wms", function(request, response) {
  var params=request.query;
    console.log(params);
   if (params.SERVICE=== 'WMS' && params.REQUEST === 'GetCapabilities' ){            
       response.sendFile(path.join(__dirname, 'xmlko.xml'))
	 }else if (params.SERVICE==="WMS"&& params.REQUEST==="GetMap"){
     generateImage(params, response.sendFile.bind(response))	  
    } else {
      response.send('posral si to')
    }  
  });

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });

console.log(generateImage);
  
 