/* 
	http://www.flickr.com/services/api/explore/flickr.groups.pools.getPhotos
	http://www.flickr.com/services/api/flickr.groups.pools.getPhotos.html

	group_id: 2233980@N22
    "id": "8655193988"
    "secret": "07b236521f"
    "server": "8113"
    "farm": 9
    "iconserver": "8251", "iconfarm": 9
    http://farm9.staticflickr.com/8251/buddyicons/50381188@N06.jpg
    http://farm9.staticflickr.com/8251/50381188@N06.jpg
    http://farm9.staticflickr.com/8113/8655193988_07b236521f_b.jpg
	"http://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"
	JSON OUTPUT:
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


	URL: http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&
	api_key=eb8a57b5872cf567fbbb1a42bdbd26ad&group_id=2233980%40N22&format=json&
	nojsoncallback=1&auth_token=72157634788201621-216bf626aae13e55&api_sig=c5a2baef5adcbd9df5716fd46265becd

http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=ee4bdc6841d42f90d9ca5e598e99d2f3
&group_id=2233980%40N22
&extras=@%2C+owner_name%2C+icon_server
&format=json&nojsoncallback=1
&api_sig=9c8bb3ae7ac1e2a593358e9eaadf42c3

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

huertofuensanta
Clave: ee4bdc6841d42f90d9ca5e598e99d2f3
Secreto: ce66d3877f4238c3

*/
Date.locale = {
    es: {
       month_names: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
       month_names_short: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
};
var url = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos';
url += '&api_key=ee4bdc6841d42f90d9ca5e598e99d2f3';
url += '&group_id=2233980%40N22';
url += '&extras=description%2Cdate_taken%2C+owner_name%2C+icon_server';
url += '&per_page=500'; // by default 50
url += '&format=json&nojsoncallback=1';
//url += '&api_sig=9c8bb3ae7ac1e2a593358e9eaadf42c3';
// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function() {
  console.log( "success" );
})
.done(function(data) { 
	console.log( "second success ");
	console.log(data); 
	//
	function custom_sort(a, b) {
    return new Date(a.datetaken).getTime() - new Date(b.datetaken).getTime();
	}
	var your_array = data.photos.photo;
	your_array.sort(custom_sort);
	//
 	var htmlString = ' ';
 	$.each(your_array, function(i, item){
 		var imageName = "http://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"
 		var imageTitle = item.title;
 		var imageOwnerIcon =  'http://farm' + item.iconfarm+ '.staticflickr.com/'+ item.iconserver+ '/buddyicons/'+ item.owner +'.jpg';
 		var imageOwner = '';
 		var imageDesc = item.description._content;
 		if (imageDesc == "Add a description..."){
 			imageDesc = ' ';
 		}
  		var imageFecha = new Date(item.datetaken);
 		var imageMes = Date.locale['es'].month_names[imageFecha.getMonth()];
 		//if( item.ownername != 'colaborativa.eu'){ // Test
			imageOwner = 'Por ' + item.ownername + ' a ';
		//}
		console.log(imageOwnerIcon);
 		if(i == 0){ // first image add active class
 			htmlString += '<div class="item active"> <img src="'+imageName+'" alt="">';
 		}else{
	 		htmlString += '<div class="item"> <img src="'+imageName+'" alt="">';
 		}
 		htmlString += '<div class="container">';
 		htmlString += '<div class="carousel-caption">';
 		htmlString += '<h1>' + imageTitle + '</h1>';
 		htmlString += '<p class="lead"><span> <img src="'+imageOwnerIcon+'" alt="">';
 		htmlString += imageOwner+imageFecha.getDate()+' de ' + imageMes +' de '+ imageFecha.getFullYear();
 		htmlString += '</span> '+imageDesc+'</p></div></div></div>';
		
 	});
   $('.carousel-inner').append(htmlString);
})
.fail(function() { console.log( "error" ); })
.always(function() { console.log( "complete" ); });
// Set another completion function for the request above
jqxhr.complete(function() { console.log( "second complete" ); });



/*
colaborativa.eu_ct5s90mbmnqo4ddjur2733nhdc%40group.calendar.google.com&ctz
https://www.googleapis.com/calendar/v3

https://www.googleapis.com/calendar/v3

*/
