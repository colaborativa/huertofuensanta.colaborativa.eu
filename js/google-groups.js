/*
	
## Subscripción automática a la lista de correo de Google huertofuensanta@googlegroups.com

Queremos que la subscripción a la lista de google se realice de forma automática desde la página principal del Huerto con tan sólo introducir el email y hacer click. Por ello hemos realizado una investigación de la API de Google disponible para gestionar un google group de manera que podamos implementarlo de forma programática. 

El único requisito que hemos impuesto es que la subscripción pueda realizarse directamente desde cliente en lenguaje, por ejemplo, Javascript ya que no disponemos de servidor para alojar la página Web del Huerto y además nos gustaría consumir el mínimo de recursos posibles.

La API de Google se encuentra dividida en varias partes, la documentación es bastante farragosa y apenas se disponen de ejemplos prácticos de aplicación que sirvan de guía. Los recursos disponibles son:

- [GAPI o Google APIs Client Library for Javascript](https://code.google.com/p/google-api-javascript-client): manual de uso de la librería GAPI para Javascript. Funciones disponibles en Javascript muy adecuada en nuestro caso al ser un lenguaje cliente pero que se encuentra incompleta y en desarrollo.
- [APIs Explorer](https://developers.google.com/apis-explorer/#p/): estas son las funciones accesibles a través de la librería Javascript cliente GAPI. Desgraciadamente no existe la función de añadir un nuevo miembro a un grupo de google.
- [ADMIN SDK](https://developers.google.com/admin-sdk/): conjunto de funciones accesibles a través de llamadas POST a la URL https://www.googleapis.com/. Las librerías se encuentran disponibles en lenguaje python, java y .net. Habría que implementar llamadas POST en Javascript para poder usar las funciones de acceso y modificación de grupos de google. La librería Javascript GAPI no funciona con estas funciones.
- [Google Apps Provisioning API](https://developers.google.com/google-apps/provisioning (DEPRECATED)): esta API está *deprecated* por lo que se desaconseja su uso. Las funciones son accesibles a través de llamadas POST a la URL https://apps-apis.google.com/, además pueden invocarse a través de la GAPI Javascript.	No la utilizamos ya que dejará de estar disponible en los próximos meses y será reemplazada por la Admin SDK.

La conclusión es que por ahora no existe una forma de añadir un nuevo miembro a un grupo de Google en lenguaje cliente. Quedamos a la espera de que la librería GAPI siga evolucionando e implemente estas funciones.

Adicionalmente hemos encontrado dificultades con el protocolo de autorización OATH2.0. Después de conseguir obtener un token de autorización a través de Javascript usando los datos proporcionados por la [consola de gestión de Apps](https://code.google.com/apis/console/#project:425984504337), al trascurrir cierto tiempo el token siempre expirará (incluso el número de refrescos de token está limitado) y la operación no será totalmente transparente al usuario de nuestra página Web ya que tendrá que aceptar el acceso. Nos gustaría poder eliminar está interrelación y una vez obtenemos el token evitar su expiración. Habrá que retomar este punto una vez que la GAPI implemente la función de añadir un nuevo miembro.


*/
  // Based on Sample Code provided by:
  // https://code.google.com/p/google-api-javascript-client/source/browse/samples/authSample.html
  //	<!-- Nuestros Javascript -->
  //  <script src="{{ page.base_url }}js/google-groups.js"></script>
  //  <script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
  //  <button name="button" id="authorize-button"> Autorizar Google Calls </button>
  // 
  // Enter a client ID for a web application from the Google Developer Console.
  //
  // The provided clientId will only work if the sample is run directly from
  // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
  // In your Developer Console project, add a JavaScript origin that corresponds to the domain
  // where you will be running the script.
  var clientId = '425984504337.apps.googleusercontent.com'; // 12 characters				// DEPLOY
  //var clientId = '425984504337-1ntknsh1b6p1hceqvru2bk0mmgfl095t.apps.googleusercontent.com'; // TEST 
  // Enter the API key from the Google Develoepr Console - to handle any unauthenticated
  // requests in the code.
  // The provided key works for this sample only when run from
  // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
  // To use in your own application, replace this API key with your own.
  var groups_apiKey = 'AIzaSyBZpkN4-NjFMyzMoL6ow-24Vz4haQHckiI';

  // https://developers.google.com/admin-sdk/groups-settings/auth
  var scopes = 'https://www.googleapis.com/auth/admin.directory.group';
  //

  // Use a button to handle authentication the first time.
  function handleClientLoad() {
  	console.log("handleClientLoad ");
    gapi.client.setApiKey(groups_apiKey);
    window.setTimeout(checkAuth,1);
  }

  function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
  }


  function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      makeApiCall();
      console.log("OK!!!");
      var authTimeout = (authResult.expires_in - 5 * 60) *1000; // every 5 minutes miliseconds
      setTimeout(checkAuth, authTimeout); // Refresh a token so it won´t 
    } else {
      authorizeButton.style.visibility = '';
      authorizeButton.onclick = handleAuthClick;
      console.log("FAIL!!!");
    }
  }

  function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }

  // Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
	gapi.client.load('plus', 'v1', function() {
		  var request = gapi.client.request({
		  	'path':'admin/directory/v1/groups',
		  	'params': {'groupKey':'huertofuensanta@googlegroups.com'},
		  	'method': 'POST',
		  	'headers':{'Content-type':'application/json'},
		  	'body': JSON.stringify({'email':'magda@cortaypega.org',"role": "MEMBER"}),
		  	'callback': function(jsonResponse, rawResponse){
		  		// jsonResponse = false is response is not valid json
		  		// rawResponse = full http response as a string
		  		// status in raw response
		  		console.log(jsonResponse);
		  		}
		  	}); // end gapi request
			//request.execute(
   }); // end gapi.client.load*/
} // end function makeApiCall
    /*gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.people.get({
        'userId': 'me'
      });
      request.execute(function(resp) {
        var heading = document.createElement('h4');
        var image = document.createElement('img');
        image.src = resp.image.url;
        heading.appendChild(image);
        heading.appendChild(document.createTextNode(resp.displayName));

        document.getElementById('content').appendChild(heading);
      });
    });
	
	console.log("OK!!!");
  }*/
