/*
https://developers.google.com/gdata/samples/spreadsheet_sample?hl=es

No olvidar ir a "archivo"->"hacer publico en la web" en la Spreadsheet para
que pueda ser accesible via la URL

*/

var DEBUG_GOOGLE = 0;
// Función Auxiliar
// --------------------
// Esta función extrae la información de la spreadsheet de Google Drive con el `id` especificado. 
// Al concluir invocará a la callback especificada como argumento de entrada.
function google_GetSpreadsheet(id, callback) {
    if( DEBUG_GOOGLE) { console.log("function google_GetSpreadsheet");}
    // Chequear que `reqwest` existe para así poder comunicarnos con Google Drive.
    if (typeof reqwest === 'undefined'){
        console.log("CSV: reqwest required for mmg_csv_url");
    }
    // La función `response` se ejecutará una vez concluída la llamada a `reqwest` invocada más abajo.
    // Se encargará de extraer cada fila de la spreadsheet, localizar cada columna (título, dirección, etc.)
    // y almacenar todos los datos en la variable array `features`.
    function response(x) {
        if( DEBUG_GOOGLE) { console.log("function response");}
        var features = []; // This array stores the spreadsheet values
        // Chequear que los datos son válidos antes de continuar.
        if (!x || !x.feed) return features;
        // Bucle for para cada fila de la spreadsheet, que corresponde con un edificio abandonado.
        for (var i = 0; i < x.feed.entry.length; i++) {                             
           var entry = x.feed.entry[i];
           var obj = {
                // Obtener cada columna de la fila actual en formato texto.
                    'Orden': entry['gsx$númerodeactividad'].$t,
                    'Titulo': entry['gsx$títuloactividad'].$t,
                    'Descripcion': entry['gsx$descripción'].$t,
                    'Organizador': entry['gsx$organizador'].$t,  
                    'FechaInicio': entry['gsx$fechayhorainicio'].$t,
                    'FechaFin': entry['gsx$fechayhorafin'].$t,  
                    'Estado': entry['gsx$estado'].$t,
                    'NAsistentes': entry['gsx$númerodeasistentes'].$t,
                    'Contacto': entry['gsx$datosdecontacto'].$t,      
            };
            features.push(obj);
        } // End for
        // Llamar a la función callback con el array `features` como dato de entrada.
        return callback(features);
    } // End Response
    // Definimos la URL con el ID de nuestra spreadsheet en Google Drive.
    //https://docs.google.com/a/colaborativa.eu/spreadsheet/ccc?key=0ApaZkqgevJCgdEJkcjZycFpWdHRZV1ByTDNFMDlsUkE&usp=sharing
    var url = 'http://spreadsheets.google.com/feeds/list/' +
        id + '/od6/public/values?alt=json-in-script&callback=callback';
    // Llamada a `reqwest`, similar a ajax, para objeter los datos en formato JSON de la spreadsheet 
    // e invocar la callback `response` una vez finalizada.
    // Más información en: https://github.com/ded/reqwest
    reqwest({
        url: url,
        type: 'jsonp',
        jsonpCallback: 'callback',
        success: response,
        error: response
    });
    // Nota: algunos exploradores tienen restringido el acceso a ciertas Webs por motivos de seguridad. 
    // Google Drive es una de ellas. Si tenemos algún problema al realizar la llamada `reqwest` una manera de 
    // testear si el explorador está bloqueando las llamadas es directamente copiar y pegar la URL en el explorador, y observar 
    // los mensajes de salida.
}