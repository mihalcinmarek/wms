var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik");

mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

function ImageCreator(arg, sendFile){
    var width = Number(arg.WIDTH); 
    var height = Number(arg.HEIGHT); 
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); 
    var layers=(arg.LAYERS).split(',');

    var map = new mapnik.Map(width, height);

    var addBudovy=arg.LAYERS.includes('budovy');
    var addCesty=arg.LAYERS.includes('cesty');
    var addCintorin=arg.LAYERS.includes('cintorin');
    var addParkovisko=arg.LAYERS.includes('parkovisko');
    var addLavicky=arg.LAYERS.includes('lavicky');
    

    var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

    var style_budovy='<Style name="style_budovy">' + 
                        '<Rule>' +
                            '<PolygonSymbolizer fill="#008080"  />' + 
                            '<LineSymbolizer stroke="black" stroke-width="0.4" />' + 
                        '</Rule>' +
                    '</Style>' 

    var style_cesty='<Style name="style_cesty">' + 
                        '<Rule>' +
                            '<LineSymbolizer stroke="#a9a9a9" stroke-width="2.5" />' +
                        '</Rule>' +
                    '</Style>'

    var style_cintorin='<Style name="style_cintorin">' + 
                            '<Rule>' +
                                '<LineSymbolizer stroke="black" stroke-width="0.5" />' + 
                                '<PolygonSymbolizer fill="#696969"  />' + 
                            '</Rule>' +
                        '</Style>' 

    var style_parkovisko='<Style name="style_parkovisko">' + 
                            '<Rule>' +
                                '<PolygonSymbolizer fill="#C0C0C0"  stroke-opacity="0.1" />' + 
                                '<LineSymbolizer stroke="#191970" stroke-width="0.3" />' + 
                            '</Rule>' +  
                            '<Rule>' +
                                '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
                                '<MinScaleDenominator>250</MinScaleDenominator>'+
                                '<PointSymbolizer file= "./icon/parking.png" transform="scale(0.05,0.05)" />'+
                            '</Rule>' +
                            '<Rule>' +
                                '<MaxScaleDenominator>249</MaxScaleDenominator>' +
                                '<MinScaleDenominator>0.1</MinScaleDenominator>'+
                                '<PointSymbolizer file= "./icon/parking.png" transform="scale(0.2,0.2)" />'+
                            '</Rule>' +
                        '</Style>' 

    var style_lavicky='<Style name="style_lavicky">' + 
                            '<Rule>' +
                                '<MaxScaleDenominator>6000</MaxScaleDenominator>' +
                                '<MinScaleDenominator>250</MinScaleDenominator>'+
                                '<PointSymbolizer file= "./icon/couch.png" transform="scale(0.10,0.10)" />'+
                            '</Rule>' +
                            '<Rule>' +
                                    '<MaxScaleDenominator>249</MaxScaleDenominator>' +
                                    '<MinScaleDenominator>1</MinScaleDenominator>'+
                                    '<PointSymbolizer file= "./icon/couch.png" transform="scale(0.3,0.3)" />'+
                            '</Rule>' +
                        '</Style>'

     var schema = '<Map background-color="transparent" srs="'+proj+'">' + 
                    (addBudovy ? style_budovy : '') +
                    (addBudovy ? style_budovy : '') +
                    (addCesty ? style_cesty : '') +
                    (addCesty ? style_cesty : '') +
                    (addCintorin ? style_cintorin : '') +
                    (addCintorin ? style_cintorin : '') +
                    (addParkovisko ? style_parkovisko : '') +
                    (addParkovisko ? style_parkovisko : '') +
                    (addLavicky ? style_lavicky : '') +
                    (addLavicky ? style_lavicky : '') +
                

                    '<Layer name="cesty" srs="'+proj+'">' + 
                        '<StyleName>style_cesty</StyleName>' + 
                            '<Datasource>' + 
                                '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + 
                                '<Parameter name="type">shape</Parameter>' + 
                            '</Datasource>' +
                    '</Layer>' +
                    
                    '<Layer name="budovy" srs="'+proj+'">' + 
                        '<StyleName>style_budovy</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="cintorin" srs="'+proj+'">' + 
                        '<StyleName>style_cintorin</StyleName>' + 
                            '<Datasource>' + 
                                '<Parameter name="file">' + path.join( __dirname, 'data/cintorin.shp' ) +'</Parameter>' + 
                                '<Parameter name="type">shape</Parameter>' + 
                            '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="parkovisko" srs="'+proj+'">' + 
                        '<StyleName>style_parkovisko</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                '</Layer>' + 

                    '<Layer name="lavicky" srs="'+proj+'">' + 
                        '<StyleName>style_lavicky</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'data/lavicky.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                    '</Layer>' +                    

                '</Map>';

  map.fromString(schema, function(err, map) { 
  if (err) {
      console.log('Map Schema Error: ' + err.message) 
  }
  map.zoomToBox(BBOX); 

  var im = new mapnik.Image(width, height); 

  map.render(im, function(err, im) { 
      
    if (err) {
        console.log('Map redner Error: ' + err.message) 
    }

    im.encode("png", function(err, buffer) { 
      if (err) {
         console.log('Encode Error: ' + err.message) 
      }

      fs.writeFile( 
        path.join(__dirname, "out/map.png"), 
        buffer, 
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) 
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") 
          );
          sendFile(path.join(__dirname ,"out/map.png"));
        }
      );
    });
  });
})
};


module.exports = ImageCreator;