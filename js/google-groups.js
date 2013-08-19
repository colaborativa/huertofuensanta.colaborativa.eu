/*

	Using Java Script client Google
	- Authorization Code in Javascript and html
	https://code.google.com/p/google-api-javascript-client/source/browse/samples/authSample.html

	- Consola de manego de APPS en Google (creación clientID for OAuth2.0)
	https://code.google.com/apis/console/#project:425984504337
	https://developers.google.com/api-client-library/javascript/dev/dev_jscript

	- Important link for using with gapi
	https://developers.google.com/admin-sdk/groups-settings/v1/reference/groups/update
	https://developers.google.com/admin-sdk/directory/v1/reference/members/insert (**)

	- Goolgle Apis Explorer: https://developers.google.com/api-client-library/javascript/dev/dev_jscript

	- Pending: Get Secret Info from JSON
*/
  // Enter a client ID for a web application from the Google Developer Console.
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
