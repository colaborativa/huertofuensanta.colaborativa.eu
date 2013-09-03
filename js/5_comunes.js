/**
 *
 *
 *  FUNCIONES COMUNES A TODOS LOS JAVASCRIPT PARA EL ACCESO A GOOGLE SPREADSHEET (COLORES Y ACTIVIDADES)
 *
 *
 **/

// ActivitiesAdd es la Callback una vez concluida la extracción de información de la SpreadSheet
// Llamada a la función que extrae información de SpreadSheet
function getListActivitiesIntoTemplate(sh_id, HeaderTitles, htmlTag, bAll){
    google_GetSpreadsheet(sh_id, HeaderTitles, activitiesNumberofRows, ActivitiesAdd, 1);
    function ActivitiesAdd(features){
      var activitiesGoogle_stuff = [];
      var indice = 1;
       $.each(features, function(i, item){
              var activityMes, Fecha_Fin_Str, Fecha_InicioStr;
              var parts = item.FechaInicio.split(/\//);
              var Fecha_Inicio = new Date(parts[1] + '/'+parts[0] +'/'+ parts[2]);
              var Fecha_Rango;
              var EstiloStr = ""; // "pasada" when older than current date
              var Fecha_RangoStr;
              if(Fecha_Inicio != 'Invalid Date'){
                    activityMes = Date.locale['es'].month_names_short[Fecha_Inicio.getUTCMonth()]; // Day of the month = Month UK format
                    var hours = Fecha_Inicio.getHours()
                    var minutes = Fecha_Inicio.getMinutes()
                    if (minutes < 10){
                      minutes = "0" + minutes
                    }
                    Fecha_InicioStr = hours + ':' + minutes+'h ' + (Fecha_Inicio.getUTCDate()) + '-' + activityMes + '-' + Fecha_Inicio.getFullYear()+' ';
              }else{
                    Fecha_InicioStr ="[Fecha pendiente] ";
              }     
              parts = item.FechaFin.split(/\//);
              var Fecha_Fin = new Date(parts[1] + '/'+parts[0] +'/'+ parts[2]);
              if(Fecha_Fin != 'Invalid Date'){
                    activityMes = Date.locale['es'].month_names_short[Fecha_Fin.getUTCMonth()];
                    var hours = Fecha_Fin.getHours()
                    var minutes = Fecha_Fin.getMinutes()
                    if (minutes < 10){
                      minutes = "0" + minutes
                    }
                    Fecha_Fin_Str = hours + ':' + minutes+ 'h ' + (Fecha_Fin.getUTCDate()) + '-' + activityMes + '-' + Fecha_Fin.getFullYear()+ ' ';
              }else{
                    Fecha_Fin_Str ="[Fecha pendiente] ";
              } 
              var currentDate = new Date(); 
              if(Fecha_Fin != 'Invalid Date' && Fecha_Inicio != 'Invalid Date'){
                Fecha_Rango = moment.twix(Fecha_Inicio, Fecha_Fin);
                Fecha_RangoStr = Fecha_Rango.format({monthFormat: "MMMM", weekdayFormat: "DDD", twentyFourHour: true, dayFormat: "D", groupMeridiems: true});
                if ( currentDate > Fecha_Fin){
                  EstiloStr = "pasada";
                }
              } else {
                Fecha_RangoStr = "[Fecha pendiente] ";
              }
              if( bAll == true){
              var obj = {
                       "Indice":indice,
                       "Nombre": item.Titulo, 
                       "Descripcion": item.Descripcion, 
                       "Organizador": item.Organizador,
                       "NAsistentes": item.NAsistentes,
                       "Estado": item.Estado,
                       "Fecha_Inicio": Fecha_InicioStr,
                       "Fecha_Fin": Fecha_Fin_Str,
                       "Fecha_Rango" : Fecha_RangoStr,
                       "Fecha_Inicio_Date": Fecha_Inicio,
                       "Estilo": EstiloStr,
                       "Emilio": item.Emilio
                      };   
             activitiesGoogle_stuff.push(obj);
             }else{
              if (EstiloStr != "pasada"){
                var obj = {
                       "Indice":indice,
                       "Nombre": item.Titulo, 
                       "Descripcion": item.Descripcion, 
                       "Organizador": item.Organizador,
                       "NAsistentes": item.NAsistentes,
                       "Estado": item.Estado,
                       "Fecha_Inicio": Fecha_InicioStr,
                       "Fecha_Fin": Fecha_Fin_Str,
                       "Fecha_Rango" : Fecha_RangoStr,
                       "Fecha_Inicio_Date": Fecha_Inicio,
                       "Estilo": EstiloStr,
                       "Emilio": item.Emilio
                      };   
             activitiesGoogle_stuff.push(obj);
           } // end if
           } // enf else
           indice += 1;
          }); // end each event of calendar
            function custom_sort(a, b) {
                a = new Date(a.Fecha_Inicio_Date);
                b = new Date(b.Fecha_Inicio_Date);
                return a<b ? -1 : a>b ? 1 : 0;
             }  
             var titulo = "Próximas actividades";
             if(bAll == true) titulo = "Listado de actividades";
             activitiesGoogle_stuff.sort(custom_sort);
             var GoogleActivities = {GoogleActivities: activitiesGoogle_stuff, 
                                     "Url_Publica":    activitiesGoogle_url,
                                     "TituloLista":titulo
             };
             // TEMPLATING WITH MUSTACHE
             $.get(mustacheTemplateFile, function(templates) { 
                    var source = $(templates).filter(activitiesGoogleTemplateID).html();
                    var template = Handlebars.compile(source);
                    var result = template(GoogleActivities);
                    $(htmlTag).html(result);
                    $('.actividad').popover();
             });
    }
}
var DEBUG_COMUNES = 0;
// Get dominant colors from SpreadSheets
function getImageColorsCabeceraSegunda(){
    var google_stuff_colors = [];
    google_GetSpreadsheet(colorGoogle_sh_id, colorsHeaderTitles, colorsNumberofRows, backImageAdd, 0);
    function backImageAdd(ImageColors){
        var randomnumber=Math.floor(Math.random()*(ImageColors.length));
        // Calculate Black or White for Text
        var colorTexto;
          var r = ImageColors[randomnumber]["ColorR"];
          var g = ImageColors[randomnumber]["ColorG"];
          var b = ImageColors[randomnumber]["ColorB"];
          var yiq = ((r*299)+(g*587)+(b*114))/1000;
          if (yiq >= 128){
                colorTexto = 'black';
          }else{
                colorTexto = 'white';            
          }
        var selectedImage = {
               "ColorR": r,
               "ColorG": g,
               "ColorB": b,
               "Nombre": ImageColors[randomnumber]["Imagen"],
               "ColorTexto": colorTexto
        };
         
        /* TEMPLATING WITH MUSTACHE or HANDLERS */
        $.get(mustacheTemplateFile, function(templates) { 
            var source = $(templates).filter(cabeceraSegundoTemplateID).html();
            var template = Handlebars.compile(source);
            var result = template(selectedImage);
            $(cabeceraSegundo_htmlTag).html(result); 
            // Pre-Load first Image (previous and next)
            var firstImage = $(cabeceraSegundo_htmlTag).find('img');
            firstImage.attr('src',firstImage.attr('lazy-load-src'));
            firstImage.attr('class','');
        }); // End Get Template
    } // end backImageAdd function
}
// Función Auxiliar
// --------------------
// Esta función extrae la información de la spreadsheet de Google Drive con el `id` especificado. 
// Al concluir invocará a la callback especificada como argumento de entrada.
/**
 * Update an existing file's metadata and content.
 *
 * @param {String} fileId ID of the file to update.
 * @param {Object} fileMetadata existing Drive file's metadata.
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Callback function to call when the request is complete.
 */
 function google_GetSpreadsheet(id, headerTitlesName, headerTitlesNumber, callback, startRow) {
    if( DEBUG_COMUNES) { console.log("function google_GetSpreadsheet");}
    // Chequear que `reqwest` existe para así poder comunicarnos con Google Drive.
    if (typeof reqwest === 'undefined'){
        console.log("CSV: reqwest required for mmg_csv_url");
    }
    // La función `response` se ejecutará una vez concluída la llamada a `reqwest` invocada más abajo.
    // Se encargará de extraer cada fila de la spreadsheet, localizar cada columna (título, dirección, etc.)
    // y almacenar todos los datos en la variable array `features`.
    function response(x) { // Callback
        if( DEBUG_COMUNES) { console.log("function response "+x);}
        var features = []; // This array stores the spreadsheet values
        // Chequear que los datos son válidos antes de continuar.
        if (!x || !x.feed) return features;
         //console.log(JSON.stringify(x.feed));
        // Bucle for para cada fila de la spreadsheet, que corresponde con un edificio abandonado.
        for (var i = startRow; i < x.feed.entry.length; i++) { // skyp first line                            
           var entry = x.feed.entry[i];
           var obj = {}; // Object
          
           for(var y = 0; y < headerTitlesNumber; y++){
                //console.log(y + " " + headerTitlesName[y][0]);
                var titleName = headerTitlesName[y][0];
                var titleValue= 'gsx$'+headerTitlesName[y][1];
                obj[titleName] = entry[titleValue].$t;
           }// End For
           features.push(obj);
        } // End for
        // Llamar a la función callback con el array `features` como dato de entrada.
        return callback(features);
    } // End Response
    // Definimos la URL con el ID de nuestra spreadsheet en Google Drive.
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
/*
    - Link de Referencia:
    https://developers.google.com/drive/v2/reference/files/update
    https://developers.google.com/gdata/samples/spreadsheet_sample?hl=es
    API de JavaScript de Google: https://developers.google.com/+/web/api/javascript?hl=es
    https://developers.google.com/api-client-library/javascript/samples/samples

    http://stackoverflow.com/questions/10317638/inserting-file-to-google-drive-through-api/13985931#13985931

    ***** PENDING ******* 
    FOLLOW WITH PREVIOUS LINK AND READ AGAIN STACKOVERFLOW POST,
    IT MUST BE CHANGED THE CODE BELOW AND SIMPLIFY ACCORDING TO INSTRUCTIONS.
    
    Form of the File: https://developers.google.com/drive/v2/reference/files#resource

    -Notas
    No olvidar ir a "archivo"->"hacer publico en la web" en la Spreadsheet para
    que pueda ser accesible via la URL
*/
function google_SetSpreadsheet(fileId, fileMetadata, fileData, callback) {
/*  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    // Updating the metadata is optional and you can instead use the value from drive.files.get.
    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
  }*/
}
/*
*/

