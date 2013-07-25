/* 
	http://www.flickr.com/services/api/explore/flickr.groups.pools.getPhotos
    "id": "8655193988"
    "secret": "07b236521f"
    "server": "8113"
    "farm": 9
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


	URL: http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=eb8a57b5872cf567fbbb1a42bdbd26ad&group_id=2233980%40N22&format=json&nojsoncallback=1&auth_token=72157634788201621-216bf626aae13e55&api_sig=c5a2baef5adcbd9df5716fd46265becd

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

*/
var url = 'http://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=eb8a57b5872cf567fbbb1a42bdbd26ad&group_id=2233980%40N22&format=json&nojsoncallback=1&auth_token=72157634788201621-216bf626aae13e55&api_sig=c5a2baef5adcbd9df5716fd46265becd';
// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function() {
  console.log( "success" );
})
.done(function(data) { 

	console.log( "second success" ); 
 	console.log(data);
 	var htmlString;
 	$.each(data.photos.photo, function(i,item){
 		var imageName = "http://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"
 		console.log(imageName);
 		var fecha = new Date(item.dateadded);
 		htmlString += '<div class="item"> <img src="'+imageName+'" alt="">';
 		htmlString += '<div class="container">';
 		htmlString += '<div class="carousel-caption">';
 		htmlString += '<h1>' + item.title + '</h1>';
 		htmlString += '<p class="lead"><span> 25 Mayo 2013 </span>'+'</p></div></div></div>';
		
 	});
   $('.carousel-inner').append(htmlString);
})
.fail(function() { console.log( "error" ); })
.always(function() { console.log( "complete" ); });
 
// perform other work here ...
 
// Set another completion function for the request above
jqxhr.complete(function() { console.log( "second complete" ); });
