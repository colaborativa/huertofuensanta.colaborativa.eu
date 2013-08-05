/* 
  - Código que gestiona la inserción de fotos de un grupo de flickr como elementos HTML definidos a través
  de la plantilla "templates/templates.html"

  - Descripción: 
    A través del siguiente código se obtienen las imágenes insertadas dentro del grupo de Flickr Huerto Fuensanta 
    (http://www.flickr.com/groups/2233980@N22/). Además de la imagen se extraen otros datos de utilidad como son:
      - Fecha en la que se tomó la foto
      - Propietario (nombre, icono)
      - Descripción
    Las fotos se ordenan por la fecha en las que fueron tomadas.

  - Links de referencia:
    http://www.flickr.com/services/api/explore/flickr.groups.pools.getPhotos
    http://www.flickr.com/services/api/flickr.groups.pools.getPhotos.html
  - Problema con CORS:
    http://www.flickr.com/groups/api/discuss/72157629144244216/
    Without CORS, the browser security model prevents the pixel data from being accessed from other domains. 

  - Autor: Colaborativa.eu

*/
// DATOS DE ENTRADA:
// Reemplazar por vuestros datos particulares
var embed_api_key='44f41e05b6194f569a7db290062a48aa';
var api_key='ee4bdc6841d42f90d9ca5e598e99d2f3'; // Clave API, solicitar a través de la web de Flickr
var group_id='2233980%40N22'; // Identificador del grupo de Flickr
var ocultarFlickrOwnerName = 'colaborativa.eu'; /* Si casi todas las fotos las ha insertado el mismo usuario entonces incluir 
aqui el "ownerName" para no mostrarlo en las fotos ya que sería repetitivo */
var htmlTag = '.carousel-inner'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
var fileTemplate = '/templates/templates.html'; // Archivo donde se encuentra la plantilla con el HTML para las imágenes
var flickrTemplateID = '#tpl-flickrimages';
// Definición de variables
Date.locale = {
    es: {
       month_names: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
       month_names_short: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
};
var url = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos';
url += '&api_key='+api_key;
url += '&group_id='+group_id;
url += '&extras=description%2Cdate_taken%2C+owner_name%2C+icon_server%2C+views';
url += '&per_page=500'; // by default 50
url += '&format=json&nojsoncallback=1';
var stuff = []; 
// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function() {
  console.log( "flickr success" );
})
.done(function(data) { 
	console.log( "flickr second success ");
	//
	function custom_sort(a, b) {
    return new Date(b.datetaken).getTime() - new Date(a.datetaken).getTime();
	}
	var your_array = data.photos.photo;
	your_array.sort(custom_sort);
 	$.each(your_array, function(i, item){
 		var imageName = "http://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"
 		var imageTitle = item.title;
 		var imageOwnerIcon =  'http://farm' + item.iconfarm+ '.staticflickr.com/'+ item.iconserver+ '/buddyicons/'+ item.owner +'.jpg';
 		var imageOwner = '';
 		var imageDesc = new String(item.description._content);
    var datetaken = new String(item.datetaken); 
    datetaken = datetaken.replace(/\s/g, 'T'); // Replace space by 'T'
 		if (imageDesc.indexOf("Add a description")!= -1 || imageDesc.indexOf("Agrega un comentario")!= -1 ){
 			imageDesc = ' ';
 		}
  	var imageFecha = new Date(datetaken);// format: 2013-04-13 20:05:41 item.datetaken
 		var imageMes = Date.locale['es'].month_names[imageFecha.getMonth()];
 		if( item.ownername != ocultarFlickrOwnerName){ // Test
			imageOwner = 'Por ' + item.ownername + ' a ';
		}
 		var imageFechaFinal= imageFecha.getDate() + ' de ' + imageMes + ' de ' + imageFecha.getFullYear();
    //
    var colorStr,colorR, colorG, colorB;
    $.embedly.defaults.key = embed_api_key; //http://embed.ly/extract/pricing
    $.embedly.extract(imageName)
    .progress(function(obj){
      // Grab images and create the colors.
      var img = obj.images[0];//,
     // Display the image inline.
      colorR = img.colors[0].color[0];
      colorG = img.colors[0].color[1];
      colorB = img.colors[0].color[2];
      console.log(colorR, colorG, colorB);
    });
    //
    var obj = {"Nombre": imageName, 
               "Titulo": imageTitle, 
               "Fecha": imageFechaFinal,
               "OwnerIcon": imageOwnerIcon,
               "Owner": imageOwner,
               "Descripcion": imageDesc.substr(0,imageDesc.length),
               "Prueba": colorR      
             };
    stuff.push(obj);
 	});
  var flickrImages = {flickrImages: stuff}; 
  $.get(fileTemplate, function(templates) { 
    var template = $(templates).filter(flickrTemplateID).html();
    console.log(template);
    var output = Mustache.to_html(template, flickrImages);
    $(htmlTag).html(output);
    var object = $(htmlTag + ' div')[0];
    $(object).addClass('active');
  });
})
.fail(function() { console.log( "flickr error" ); })
.always(function() { console.log( "flickr complete" ); });
// Set another completion function for the request above
jqxhr.complete(function() { console.log( "flickr second complete" ); });

 /* 
  INFORMACIÓN ADICIONAL DE UTILIDAD PARA EL DESARROLLADOR:

  * Para iconos usar:  http://farm9.staticflickr.com/8251/buddyicons/50381188@N06.jpg
  * Para fotos de un grupo usar: http://farm9.staticflickr.com/8113/8655193988_07b236521f_b.jpg
  
  * Salida JSON:
  { "photos": { "page": 1, "pages": 1, "perpage": 100, "total": 58, 
    "photo": [
      { "id": "8677001289", "owner": "50381188@N06", "secret": "f0354915da", "server": "8254", 
        "farm": 9, "title": "Huerto social y ecológico de la Fuensanta Córdoba 22-04-2012", 
        "ispublic": 1, "isfriend": 0, "isfamily": 0, "ownername": "colaborativa.eu", 
        "dateadded": "1374751235" },
      { "id": "8678110340", "owner": "50381188@N06", "secret": "55097a9076", "server": "8253", 
      "farm": 9, "title": "Huerto social y ecológico de la Fuensanta Córdoba 22-04-2012", 
      "ispublic": 1, "isfriend": 0, "isfamily": 0, "ownername": "colaborativa.eu", 
      "dateadded": "1374751234" },
      ....
  ] }, "stat": "ok" }

  * URL: http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=ee4bdc6841d42f90d9ca5e598e99d2f3
  &group_id=2233980%40N22
  &extras=@%2C+owner_name%2C+icon_server
  &format=json&nojsoncallback=1
  &api_sig=9c8bb3ae7ac1e2a593358e9eaadf42c3

  * Estructura HTML:
  <div class="carousel-inner">
  <div class="item">
          <img src="http://farm9.staticflickr.com/8113/8655193988_07b236521f_b.jpg" alt="">
          <div class="container">
            <div class="carousel-caption">
              <h1>Titulo imagen a la izquierda</h1>
              <p class="lead"><span>Fecha de la imagen</span>. Descripción imagen a la izquierda.</p>
            </div>
          </div>
        </div>
  ....
  </div>

  * Datos API de Flickr:
  huertofuensanta
  Clave: ee4bdc6841d42f90d9ca5e598e99d2f3
  Secreto: ce66d3877f4238c3
*/

/*

https://www.googleapis.com/calendar/v3
  - Descripción:

  - Link de referencia:
  https://developers.google.com/google-apps/calendar/?hl=es
  https://developers.google.com/api-client-library/javascript/start/start-js
  https://admin.google.com/AdminHome
  https://developers.google.com/gdata/samples/cal_sample
  Por qué no se puede editar por todo el mundo: http://edutraining.googleapps.com/Training-Home/module-3-calendar/chapter-5/1-2
 - URL pública del calendario
  http://www.google.com/calendar/embed?src=urbanismodebarrio.com_uld0g0slrn1ms2h46njrmctp8s%40group.calendar.google.com&ctz=Europe/Madrid 

- Returns Events:  
  https://developers.google.com/google-apps/calendar/v3/reference/calendars/get,
  https://developers.google.com/google-apps/calendar/v3/reference/?hl=es#Events)
  ** https://www.googleapis.com/calendar/v3/calendars/urbanismodebarrio.com_uld0g0slrn1ms2h46njrmctp8s%40group.calendar.google.com/events/?key=AIzaSyBZpkN4-NjFMyzMoL6ow-24Vz4haQHckiI

*/
var google_api_key = 'AIzaSyBZpkN4-NjFMyzMoL6ow-24Vz4haQHckiI';
var google_cal_id = 'urbanismodebarrio.com_uld0g0slrn1ms2h46njrmctp8s%40group.calendar.google.com';
var google_cal_orderby = 'startTime';
var ahora = new Date();
var google_url_events = 'https://www.googleapis.com/calendar/v3/calendars/'+google_cal_id+'/events?';
google_url_events += 'orderBy=startTime&singleEvents=true';
google_url_events += '&timeMin='+ahora.toISOString();
google_url_events += '&key='+google_api_key;

//
var google_stuff = [];
var google_htmlTag = '#estapasando .container .row #actividadesfuturas'; // Este es el TAG donde se insertarán los eventos del calendario
var googleTemplateID = '#tpl-GoogleEvents';
// HABILITAR EL CALENDARIO CON PERMISO DE LECTURA Y ESCRITURA, ESPERAR A MAÑANA Y PROBAR URL DE ARRIBA
var call_google_url = $.getJSON( google_url_events, function() {
  console.log( "google success "+ google_url_events);
})
.done(function(data) { 
  console.log( "google second success ");
    $.each(data.items, function(i, item){
      var imageMes, Fecha_Fin_Str, Fecha_InicioStr;
      var Fecha_Inicio = new Date(item.start.dateTime);
      if(Fecha_Inicio != 'Invalid Date'){
        imageMes = Date.locale['es'].month_names_short[Fecha_Inicio.getMonth()];
        var hours = Fecha_Inicio.getHours()
        var minutes = Fecha_Inicio.getMinutes()
        if (minutes < 10){
          minutes = "0" + minutes
        }
        Fecha_InicioStr = hours + ':' + minutes+'h ' + Fecha_Inicio.getDate() + '-' + imageMes + '-' + Fecha_Inicio.getFullYear()+' ';
      }else{
        Fecha_InicioStr ="[Pendiente] ";
      }     
      var Fecha_Fin = new Date(item.end.dateTime);
      if(Fecha_Inicio != 'Invalid Date'){
        imageMes = Date.locale['es'].month_names_short[Fecha_Fin.getMonth()];
        var hours = Fecha_Inicio.getHours()
        var minutes = Fecha_Inicio.getMinutes()
        if (minutes < 10){
          minutes = "0" + minutes
        }
        Fecha_Fin_Str = hours + ':' + minutes+ 'h ' + Fecha_Fin.getDate() + '-' + imageMes + '-' + Fecha_Fin.getFullYear()+ ' ';
      }else{
        Fecha_Fin_Str ="[Pendiente] ";
      } 
      var obj = {"Nombre": item.summary, 
               "Descripcion": item.description, 
               "Localizacion":item.location,
               "Organizador": item.organizer.displayName,
               "Fecha_Inicio": Fecha_InicioStr,
               "Fecha_Fin": Fecha_Fin_Str
               };
      google_stuff.push(obj);
    }); // end each event of calendar
    var GoogleEvents = {GoogleEvents: google_stuff, 
                        "Url_Publica": "http://www.google.com/calendar/embed?src=urbanismodebarrio.com_uld0g0slrn1ms2h46njrmctp8s%40group.calendar.google.com&ctz=Europe/Madrid"
                       };
    $.get(fileTemplate, function(templates) { 
        var template = $(templates).filter(googleTemplateID).html();
        var output = Mustache.to_html(template, GoogleEvents);
        $(google_htmlTag).html(output);
    });
})
.fail(function() { console.log( "google error" ); })
.always(function() { console.log( "google complete" ); });
// Set another completion function for the request above
call_google_url.complete(function() { console.log( "google second complete" ); });
