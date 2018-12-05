// definujeme prídavné moduly s ktoré  potrebujeme
var path = require("path"); // cesty k súborom
var fs = require("fs");
var mapnik = require("mapnik"); // knižnica na vykreslenie máp

mapnik.register_default_fonts(); // predvolené fonty v mapniku
mapnik.register_default_input_plugins(); // predvolené pluginy v mapniku

// funkcia na tvorbu obrazu 
function ImageCreator(arg, sendFile){
    //definujeme šírku a výšku mapového okna
    var width = Number(arg.WIDTH); 
    var height = Number(arg.HEIGHT); 
    //definujeme bounding box (pravý horný a ľavý dolný roh)
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); 
    var layers=(arg.LAYERS).split(',');

    //definovanie mapy, s definovanými parametrami (šírka výška)
    var map = new mapnik.Map(width, height);

    //definovanie príslušných vrstiev, ktoré bude mapa obsahovať
    var addBudovy=arg.LAYERS.includes('budovy');
    var addCesty=arg.LAYERS.includes('cesty');
    var addChodniky=arg.LAYERS.includes('chodniky');
    var addCintorin=arg.LAYERS.includes('cintorin');
    var addParkovisko=arg.LAYERS.includes('parkovisko');
    var addLavicky=arg.LAYERS.includes('lavicky');
    
    // definovanie súradnicového systémy, v ktorom to celé bude
    var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";
    // štýl vrstvy budovy, definuje pravidlá podľa ktorých bude daná vrstva vykresľovaná ... typ : polygón, farba vyjadrena hex kodom, hrúbka línie + building symbolizer ktorý imituje 3D zobrazenie budovy 
    var style_budovy='<Style name="style_budovy">' + 
                        '<Rule>' +
                            '<PolygonSymbolizer fill="#008080"  />' + 
                            '<LineSymbolizer stroke="black" stroke-width="0.4" />' + 
                            '<BuildingSymbolizer fill="#008080" height="1" fill-opacity="1" />' +
                        '</Rule>' +
                    '</Style>' 
    //to isté co pri budovách, ale definujeme štýl ciest
    var style_cesty='<Style name="style_cesty">' + 
                        '<Rule>' +
                            '<LineSymbolizer stroke="#a9a9a9" stroke-width="3.0" />' +
                        '</Rule>' +
                    '</Style>'
    // to isté co pri budovách, ale definujeme štýl cihodnikov
    var style_chodniky='<Style name="style_chodniky">' + 
                        '<Rule>' +
                            '<LineSymbolizer stroke="#bfbfbf" stroke-width="1.5" />' +
                        '</Rule>' +
                    '</Style>'
    // to isté co pri budovách, ale definujeme štýl cintorinov
    var style_cintorin='<Style name="style_cintorin">' + 
                            '<Rule>' +
                                '<LineSymbolizer stroke="black" stroke-width="0.5" />' + 
                                '<PolygonSymbolizer fill="#696969"  />' + 
                            '</Rule>' +
                        '</Style>' 
    // styl parkovisk, definuje rôzne štýly zobrazenia podľa aktuálnej mierky 
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
    // to iste
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
    //definuje farbu pozadia
     var schema = '<Map background-color="transparent" srs="'+proj+'">' + 
                    //  vyjadrenie podmienky, ak je splnené že pripájam vrstvu, vyžaduje k nej daný štýl
                    (addBudovy ? style_budovy : '') +
                    (addCesty ? style_cesty : '') +
                    (addChodniky ? style_chodniky : '') +
                    (addCintorin ? style_cintorin : '') +
                    (addParkovisko ? style_parkovisko : '') +
                    (addLavicky ? style_lavicky : '') +
                                  
                    // definuje parametre vrstvy, projekciu, cestu k dátam a ich typ
                    '<Layer name="cesty" srs="'+proj+'">' + 
                        '<StyleName>style_cesty</StyleName>' + 
                            '<Datasource>' + 
                                '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + 
                                '<Parameter name="type">shape</Parameter>' + 
                            '</Datasource>' +
                    '</Layer>' +
                    // definuje parametre vrstvy, projekciu, cestu k dátam a ich typ
                    '<Layer name="budovy" srs="'+proj+'">' + 
                        '<StyleName>style_budovy</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                    '</Layer>' +
                    // definuje parametre vrstvy, projekciu, cestu k dátam a ich typ
                    '<Layer name="chodniky" srs="'+proj+'">' + 
                        '<StyleName>style_chodniky</StyleName>' + 
                            '<Datasource>' + 
                                '<Parameter name="file">' + path.join( __dirname, 'data/chodniky.shp' ) +'</Parameter>' + 
                                '<Parameter name="type">shape</Parameter>' + 
                            '</Datasource>' +
                    '</Layer>' +
                    // to isté aj ďalej
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
  // definovanie funkcie from string a jej možnosti
  map.fromString(schema, function(err, map) { 
  if (err) {
      console.log('Map Schema Error: ' + err.message) // ak nie sú sprlenené jej podmienky tak vypíše toto
  }
  map.zoomToBox(BBOX); // mapa ohraničená podľa nami definovaného bounding boxu

  var im = new mapnik.Image(width, height); // definovanie obrazu ktorý nam bude mapnik dávať

  map.render(im, function(err, im) { // render našej mapy z mapnika
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // ak je niečo zle, vypíše chybu
    }

    im.encode("png", function(err, buffer) { // definovanie formátu v ktorom bude mapa vytvorená
      if (err) {
         console.log('Encode Error: ' + err.message) // prípadná chyba sa vypíše
      }
      
      // celé sa to zapíše do súboru, ktorému definujeme cestu kde má byť uložený
      fs.writeFile( 
        path.join(__dirname, "out/map.png"), 
        buffer, 
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // ak nastane chyba ...
          }
          console.log('Image generated into: ' + // hláška ktorú nám v konzole výpiše keď všetko prebehne tak ako má
            path.join(__dirname, "out/map.png") 
          );
          sendFile(path.join(__dirname ,"out/map.png")); // výsledok, tento súbor bude ďalej poslaný
        }
      );
    });
  });
})
};


module.exports = ImageCreator; // export ktorý bude ďalej importovaný v serveri