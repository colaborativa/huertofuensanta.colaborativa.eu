
/**
 *
 * We call againg google for getting images and colors just in case it is first page visited
 * of our visited and localStorage is not available yet.
 *
 */
  // Get dominant colors from SpreadSheets
  var google_sh_id_colors = '0ApaZkqgevJCgdG1DMVIxdUtGQ1lpUGFvLWZnNTgxX1E'; 
  // Este es el TAG donde se insertarán los eventos del calendario
  var google_stuff_colors = [];
  var headerTitlesColors = {'0': ['Imagen', 'nombredelaimagen'],
                            '1': ['ColorR','colorr'],
                            '2': ['ColorG','colorg'],
                            '3': ['ColorB','colorb']};
	google_GetSpreadsheet(google_sh_id_colors, headerTitlesColors, 4, backImageAdd);
	function backImageAdd(ImageColors){
		var htmlTag = '.cabecera .row'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
		var fileTemplate = '../templates/templates.html'; // Archivo donde se encuentra la plantilla con el HTML para las imágenes
		var informacionTemplateID = '#tpl-Informacion'; // Identificador de la plantilla de Mustache en donde se insertará la información
		var randomnumber=Math.floor(Math.random()*(ImageColors.length));
		//
		var html_text = '<div class="imagenFondo" style="background-image:url(';
			html_text+=  ImageColors[randomnumber]["Imagen"] + '")></div>';
			//html_text+= '<img src="'+ ImageColors[randomnumber]["Imagen"]+'">'; // to force loading
		var selectedImage = {
			   "ColorR": ImageColors[randomnumber]["ColorR"],
               "ColorG": ImageColors[randomnumber]["ColorG"],
               "ColorB": ImageColors[randomnumber]["ColorB"],
               "Nombre": ImageColors[randomnumber]["Imagen"]
        };
		//$('.row').append(html_text);
		//console.log(randomnumber + " " + selectedImage);
		/* TEMPLATING WITH MUSTACHE or HANDLERS */
        $.get(fileTemplate, function(templates) { 
	        var source = $(templates).filter(informacionTemplateID).html();
	        var template = Handlebars.compile(source);
	        var result = template(selectedImage);
	        //console.log(result);
	        $(htmlTag).html(result); 
	        // Pre-Load first Image (previous and next)
        	var firstImage = $(htmlTag).find('img');
        	firstImage.attr('src',firstImage.attr('lazy-load-src'));
        	firstImage.attr('class','');
        	firstImage[0].style.visibility = 'hidden';
        }); // End Get Template

	} // end backImageAdd function
