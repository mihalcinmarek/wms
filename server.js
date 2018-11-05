
var express = require("express");
var path = require ('path');
var server = new express();
var PORT = 3456


server.get('/wms', function (request, response) {
    var params = request.query
    console.log(params);

    if (params.service === 'wms' && params.request === 'getCapabilities') {
        response.sendFile (path.join(__dirname , 'getCapabilities.xml'))
    } else if (params.service === 'wms' && params.request === 'getMap'){
        console.log('idem robit get map')
    } else {
        response.send ('nejdem na get capa')
    }
  });

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});