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
  - Autor: Colaborativa.eu

*/
// DATOS DE ENTRADA:
// Reemplazar por vuestros datos particulares
var api_key='ee4bdc6841d42f90d9ca5e598e99d2f3'; // Clave API, solicitar a través de la web de Flickr
var group_id='2233980%40N22'; // Identificador del grupo de Flickr
var ocultarFlickrOwnerName = 'colaborativa.eu'; /* Si casi todas las fotos las ha insertado el mismo usuario entonces incluir 
aqui el "ownerName" para no mostrarlo en las fotos ya que sería repetitivo */
var htmlTag = '.carousel-inner'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
var fileTemplate = '/templates/templates.html'; // Archivo donde se encuentra la plantilla con el HTML para las imágenes

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
url += '&extras=description%2Cdate_taken%2C+owner_name%2C+icon_server';
url += '&per_page=500'; // by default 50
url += '&format=json&nojsoncallback=1';
var stuff = []; 
// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function() {
  console.log( "success" );
})
.done(function(data) { 
	console.log( "second success ");
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
    var obj = {"Nombre": imageName, 
               "Titulo": imageTitle, 
               "Fecha": imageFechaFinal,
               "OwnerIcon": imageOwnerIcon,
               "Owner": imageOwner,
               "Descripcion": imageDesc.substr(0,imageDesc.length) ,
             };
    stuff.push(obj);
 	});
  var flickrImages = {flickrImages: stuff}; 
  $.get(fileTemplate, function(templates) { 
    var template = $(templates).filter('#tpl-flickrimages').html();
    var output = Mustache.to_html(template, flickrImages);
    $(htmlTag).html(output);
    var object = $(htmlTag + ' div')[0];
    $(object).addClass('active');
  });
})
.fail(function() { console.log( "error" ); })
.always(function() { console.log( "complete" ); });
// Set another completion function for the request above
jqxhr.complete(function() { console.log( "second complete" ); });
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
colaborativa.eu_ct5s90mbmnqo4ddjur2733nhdc%40group.calendar.google.com&ctz
https://www.googleapis.com/calendar/v3
https://www.googleapis.com/calendar/v3
*/
