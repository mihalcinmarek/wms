//definovanie balíkov a súborov, ktoré potrebujeme
var express = require("express"); // server
var server = express();
var path=require('path'); // cesty k suborom
var fs = require("fs");
var mapnik = require("mapnik"); // tvorba máp
var generateImage = require('./generateimage.js'); // generateimage.js sme si sami vyrabali
var PORT=3456; // hodnota pre nas localhost

//funkcia ktorú voláme na servri aby nám na oplátku niečo poslal
server.get("/wms", function(request, response) {
  var params=request.query;
    console.log(params);
   if (params.SERVICE=== 'WMS' && params.REQUEST === 'GetCapabilities' ){            
       response.sendFile(path.join(__dirname, 'xmlko.xml')) // podmienky ktoré musia byť splnené na to aby nám poslal súbor xml (+ definovaná cesta k súboru)
	 }else if (params.SERVICE==="WMS"&& params.REQUEST==="GetMap"){
     generateImage(params, response.sendFile.bind(response))	 // podmienky ktoré musia byť splnené na to aby nám bol poslaná mapa (+ definovaný generateimage, ktorý to zabezpečí) 
    } else {
      response.send('posral si to') // ak nejaká s podmienok nie je splnená, namiesto súborov vypíše toto
    }  
  });

// pri spusteni servera sa vypise tato hlaska spolu s cislom portu 
server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });

// výstup z generateimage.js 
console.log(generateImage);
  
 