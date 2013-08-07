/* 
  - Código que gestiona la inserción de fotos de un Grupo de FLICKR como elementos HTML definidos a través
  de la plantilla "templates/templates.html"

  - Descripción: 
    A través del siguiente código se obtienen las imágenes insertadas dentro del grupo de Flickr Huerto Fuensanta 
    (http://www.flickr.com/groups/2233980@N22/). Además de la imagen se extraen otros datos de utilidad como son:
      - Fecha en la que se tomó la foto
      - Propietario (nombre, icono)
      - Descripción
    Las fotos se ordenan por la fecha en las que fueron tomadas.

  - Links de referencia:
    Cómo obtener información de las fotos de un grupo de Flickr:
      http://www.flickr.com/services/api/explore/flickr.groups.pools.getPhotos
      http://www.flickr.com/services/api/flickr.groups.pools.getPhotos.html

    Cómo añadir Tags: http://www.flickr.com/services/api/explore/flickr.photos.addTags
    Cómo implementar oauth: http://www.flickr.com/services/api/auth.oauth.html

  - Problema con CORS:
    http://www.flickr.com/groups/api/discuss/72157629144244216/
    Without CORS, the browser security model prevents the pixel data from being accessed from other domains.

  - EMBED.LY service:
    Usamos el servicio embed.ly para extraer los colores dominantes de cada foto de Flickr, ya que CORS nos lo impedía.
    Este servicio tiene una limitación de 5000 llamadas al mes por lo que hay que pensar en una alternativa. Por ejemplo
    guardar los colores RGB de cada foto dentro de la info de flickr (TAGS) o en una Spreadsheet de Google. 

  - Autor: Colaborativa.eu
  - Fecha: Agosto 2013

*/
var DEBUG_HUERTO = 1;
// DATOS DE ENTRADA:
// Reemplazar por vuestros datos particulares
var embed_api_key='b1afe35625df4ec2bb0a858fd9983152'; // Solicitar a través de http://embed.ly/ "Embed.ly service"
var api_key='ee4bdc6841d42f90d9ca5e598e99d2f3'; // Clave API, solicitar a través de la web de Flickr
var group_id='2233980%40N22'; // Identificador del grupo de Flickr "Huerto Fuensanta"
var ocultarFlickrOwnerName = 'colaborativa.eu'; /* Si casi todas las fotos las ha insertado el mismo usuario entonces incluir 
aqui el "ownerName" para no mostrarlo en las fotos ya que sería repetitivo */
var htmlTag = '.carousel-inner'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
var fileTemplate = '/templates/templates.html'; // Archivo donde se encuentra la plantilla con el HTML para las imágenes
var flickrTemplateID = '#tpl-flickrimages'; /* Identificador de la plantilla de Mustache en donde se insertará la información
sobre las imágenes de Flickr */

// Definición de variables
Date.locale = {
    es: {
       month_names: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
       month_names_short: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
};
// Construir URL para obtener imágenes de Flickr
var url = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos';
url += '&api_key='+api_key;
url += '&group_id='+group_id;
url += '&extras=description%2Cdate_taken%2C+owner_name%2C+icon_server%2C+views%2C+tags';
url += '&per_page=500'; // by default 50
url += '&format=json&nojsoncallback=1';
var stuff = []; 
// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
$.embedly.defaults.key = embed_api_key; //http://embed.ly/ Servicio Web para extraer Colores Dominantes en Fotos de Flickr
// Llamada a la API de Flick
var jqxhr = $.getJSON( url, function() {
  if(DEBUG_HUERTO){ console.log( "flickr success" );}
})
.done(function(data) { 
	if(DEBUG_HUERTO){ console.log( "flickr second success ");}
	//
	function custom_sort(a, b) {
    return new Date(b.datetaken).getTime() - new Date(a.datetaken).getTime();
	}
	var your_array = data.photos.photo;
	your_array.sort(custom_sort);
  // 1st Step: Get Pictures INFO from FLICKR
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
    // Checking for RGB colors embedded into Image Tag as "R22 G33 B33"
    var imageColorR =0;
    var imageColorG =0;
    var imageColorB =0; // Default RGB Values
    var imageColors = new String(item.tags);
    if( imageColors.indexOf('r') != -1 && imageColors.indexOf('g') != -1 && imageColors.indexOf('b') != -1 ){
      var imageColorsArray = imageColors.split(' ');
      $.each(imageColorsArray, function(i,item){
        var str = new String(item);
          if(str.indexOf('r') != -1){
            imageColorR = str.substr(str.indexOf('r')+1,str.length);
          }
          if(str.indexOf('b') != -1){
            imageColorB = str.substr(str.indexOf('b')+1,str.length);
          }
          if(str.indexOf('g') != -1){
            imageColorG = str.substr(str.indexOf('g')+1,str.length);
          }
      });
    }
    var obj = {"ColorR": imageColorR,
               "ColorG": imageColorG,
               "ColorB": imageColorB,
               "Nombre": imageName, 
               "Titulo": imageTitle, 
               "Fecha": imageFechaFinal,
               "OwnerIcon": imageOwnerIcon,
               "Owner": imageOwner,
               "Descripcion": imageDesc                  
             };
      stuff.push(obj);
  }); // End Each Item of Flickr 
   // 2nd Step: Get Pictures Dominant Color from EMBED.LY
   if(1 == 0){ // So embedly wont be called continuously
   var colorStr = new String('');
   var colorR = new Number();
   var colorG, colorB;
   $.each(stuff, function(i,picture){
      // If we don´t have a valid color then extract
      if( picture.ColorR == 0 && picture.ColorR == 0 && picture.ColorR == 0){
      $.embedly.extract(picture.Nombre)
      .progress(function(obj){
        // Grab images and create the colors.
        var img = obj.images[0];//,
        //Display the image inline.
        var color = new Color(img.colors[0].color[0], img.colors[0].color[1], img.colors[0].color[2]);
        picture.ColorR = color.r;
        picture.ColorG = color.g;
        picture.ColorB = color.b;
        if((stuff.length - 1) == i){
                  // 3rd Step: Render Template with Values   
                  var flickrImages = {flickrImages: stuff}; 
                  /* TEMPLATING WITH MUSTACHE or HANDLERS */
                  $.get(fileTemplate, function(templates) { 
                          var source = $(templates).filter(flickrTemplateID).html();
                          var template = Handlebars.compile(source);
                          var result = template(flickrImages);
                          //console.log(result);
                          $(htmlTag).html(result);
                          var object = $(htmlTag + ' div')[0];    
                          $(object).addClass('active');
                  }); // End Get Template
                  // End 3rd Step
        } // End If Last Element
        // 4th Step: Write into Flickr Image Property Tag  as "R22 G33 B33"

        // End 4th Step
        }); // end .progress
     } // End If checking for Color Already extracted
     }); // End each
  }else{
    // 3rd Step: Render Template with Values   
        var flickrImages = {flickrImages: stuff}; 
        /* TEMPLATING WITH MUSTACHE or HANDLERS */
        $.get(fileTemplate, function(templates) { 
        var source = $(templates).filter(flickrTemplateID).html();
        var template = Handlebars.compile(source);
        var result = template(flickrImages);
        //console.log(result);
        $(htmlTag).html(result);
        var object = $(htmlTag + ' div')[0];    
        $(object).addClass('active');
        }); // End Get Template
  }
})
.fail(function() { if(DEBUG_HUERTO){ console.log( "flickr error" );} })
.always(function() { console.log( "flickr complete" ); });
// Set another completion function for the request above
jqxhr.complete(function() { if(DEBUG_HUERTO){ console.log( "flickr second complete" );} });
 // Fin Llamada a la API de Flickr
/*
  - Código que inserta la información extraída de una SpreadSheet de Google en la plantilla "templates.html"
  con id "#tpl-GoogleActivities".

  - Descripción: 
  
  - Links de Referencia:
    https://docs.google.com/a/colaborativa.eu/spreadsheet/ccc?key=0ApaZkqgevJCgdEJkcjZycFpWdHRZV1ByTDNFMDlsUkE&usp=sharing
    http://disponibleencordoba.colaborativa.eu/
    https://github.com/colaborativa/disponibleencordoba

*/
// DATOS DE ENTRADA: reemplazar por vuestros datos particulares.
// Identificador de la SpreadSheet de Google (obtener de URL)
var google_sh_id = '0ApaZkqgevJCgdEJkcjZycFpWdHRZV1ByTDNFMDlsUkE'; 
// Este es el TAG donde se insertarán los eventos del calendario
var google_htmlTag = '#estapasando .container .row #actividadesfuturas'; 
// Identificador de la template de mustache
var googleTemplateID = '#tpl-GoogleActivities';
var google_stuff = [];
// Llamada a la función que extrae información de SpreadSheet
google_GetSpreadsheet(google_sh_id, ActivitiesAdd);
// Campos:  Orden,  Titulo,  Descripcion,  Organizador,  FechaInicio,  FechaFin,  Estado,  NAsistentes,  Contacto,  

// ActivitiesAdd es la Callback una vez concluida la extracción de información de la SpreadSheet
function ActivitiesAdd(features){
   $.each(features, function(i, item){
          var activityMes, Fecha_Fin_Str, Fecha_InicioStr;
          var Fecha_Inicio = new Date(item.FechaInicio);
          if(Fecha_Inicio != 'Invalid Date'){
                activityMes = Date.locale['es'].month_names_short[Fecha_Inicio.getMonth()];
                var hours = Fecha_Inicio.getHours()
                var minutes = Fecha_Inicio.getMinutes()
                if (minutes < 10){
                  minutes = "0" + minutes
                }
                Fecha_InicioStr = hours + ':' + minutes+'h ' + Fecha_Inicio.getDate() + '-' + activityMes + '-' + Fecha_Inicio.getFullYear()+' ';
          }else{
                Fecha_InicioStr ="[Pendiente] ";
          }     
          var Fecha_Fin = new Date(item.FechaFin);
          if(Fecha_Inicio != 'Invalid Date'){
                activityMes = Date.locale['es'].month_names_short[Fecha_Fin.getMonth()];
                var hours = Fecha_Inicio.getHours()
                var minutes = Fecha_Inicio.getMinutes()
                if (minutes < 10){
                  minutes = "0" + minutes
                }
                Fecha_Fin_Str = hours + ':' + minutes+ 'h ' + Fecha_Fin.getDate() + '-' + activityMes + '-' + Fecha_Fin.getFullYear()+ ' ';
          }else{
                Fecha_Fin_Str ="[Pendiente] ";
          } 
          var obj = {"Nombre": item.Titulo, 
                   "Descripcion": item.Descripcion, 
                   "Organizador": item.Organizador,
                   "NAsistentes": item.NAsistentes,
                   "Estado": item.Estado,
                   "Fecha_Inicio": Fecha_InicioStr,
                   "Fecha_Fin": Fecha_Fin_Str
                   };
          google_stuff.push(obj);
         }); // end each event of calendar
         var GoogleActivities = {GoogleActivities: google_stuff, 
                            "Url_Publica": "https://docs.google.com/a/colaborativa.eu/spreadsheet/ccc?key=0ApaZkqgevJCgdEJkcjZycFpWdHRZV1ByTDNFMDlsUkE#gid=0"
                           };
         // TEMPLATING WITH MUSTACHE
         $.get(fileTemplate, function(templates) { 
                var source = $(templates).filter(googleTemplateID).html();
                var template = Handlebars.compile(source);
                var result = template(GoogleActivities);
                $(google_htmlTag).html(result);
         });
}
/*

    GOOGLE CALENDAR PUBLIC
    EXTRACTING ACTIVITIES AS JSON AND INSERT THEM INTO WEB 
    MAIN PROBLEM: TO EDIT THE CALENDAR A GOOGLE ACCOUNT IS NEEDED 

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
   // TEMPLATING WITH MUSTACHE
   // $.get(fileTemplate, function(templates) { 
   //     var template = $(templates).filter(googleTemplateID).html();
   //     var output = Mustache.to_html(template, GoogleEvents);
   //     $(google_htmlTag).html(output);
   // });
})
.fail(function() { console.log( "google error" ); })
.always(function() { console.log( "google complete" ); });
// Set another completion function for the request above
call_google_url.complete(function() { console.log( "google second complete" ); });
*/