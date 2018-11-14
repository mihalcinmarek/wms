var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik");

mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var width = 800;
var height = 600;
var BBOX = [-508428.4646376185119,-1222456.082299999893,-504979.520799998194,-1220887.147535035154];

var map = new mapnik.Map(width, height);

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var schema = '<Map background-color="transparent" srs="'+proj+'">' +
                '<Style name="style_budovy">' +
                    '<Rule>' +
                        '<LineSymbolizer stroke="black" stroke-width="0.1" />' +
                        '<PolygonSymbolizer fill="#f2cfaf"  />' +
                    '</Rule>' +
                '</Style>' +
                '<Style name="style_cesty">' +
                    '<Rule>' +
                        '<LineSymbolizer stroke="#d7c8b9" stroke-width="0.8" />' +
                    '</Rule>' +
                '</Style>' +
                '<Layer name="cesty" srs="'+proj+'">' +
                    '<StyleName>style_cesty</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + 
                        '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +
                '<Layer name="budovy" srs="'+proj+'">' +
                    '<StyleName>style_cesty</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                        '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +
            '</Map>';

map.fromString(schema, function(err, map) {
  if (err) {
      console.log('Error: ' + err.message)
  }

map.zoomToBox(BBOX);

var im = new mapnik.Image(width, height);

map.render(im, function(err, im) {      
    if (err) {
        console.log('Error: ' + err.message)
    }
    im.encode("png", function(err, buffer) {
      if (err) {
         console.log('Error: ' + err.message)
      }
      fs.writeFile(
        path.join(__dirname, "out/map.png"),
        buffer,
        function(err) {
          if (err) {
              console.log('Error: ' + err.message)
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png")
          );
        }
      );
    });
  });
});
