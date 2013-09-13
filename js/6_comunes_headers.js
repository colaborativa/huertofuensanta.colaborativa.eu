/**
 *
 *
 *	THIS FILE CONTAINS SHARED VARIABLES DEFINITIONS BETWEEN ALL JAVASCRIPT FILES
 *
 *
 **/
var carouselHtmlTag = '#carousel-innerTpl'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
Date.locale = {
    es: {
       month_names: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
       month_names_short: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
};
/* 
 *	Mustache Templates
 *
 */
var mustacheTemplateFile = '/templates/templates.html'; // Archivo donde se encuentra la plantilla con el HTML para las imágenes
/* 
 *	Google Spreadsheet with Dominant Colors of Images
 *
 */
var colorGoogle_sh_id = '0ApaZkqgevJCgdG1DMVIxdUtGQ1lpUGFvLWZnNTgxX1E'; 
var colorsHeaderTitles = {'0': ['Imagen', 'nombredelaimagen'],
                            '1': ['ColorR','colorr'],
                            '2': ['ColorG','colorg'],
                            '3': ['ColorB','colorb']};
var colorsNumberofRows = 4; // number of rows to extract from Excell
var cabeceraSegundoTemplateID = '#tpl-CabeceraSegundoNivel'; // Identificador de la plantilla de Mustache en donde se insertará la información
var cabeceraSegundo_htmlTag = '.imagenfondo'; // Este es el TAG donde se insertarán las imágenes una vez extraídas
/* 
 *	Google Spreadsheet with Activities
 *
 */
var activitiesGoogle_sh_id =  '0ApaZkqgevJCgdDNrM0RaX3RhaDEzVGhGcEo5allQaHc'; //'0ApaZkqgevJCgdEJkcjZycFpWdHRZV1ByTDNFMDlsUkE'; //
// Este es el TAG donde se insertarán los eventos del calendario
var activitiesGoogle_htmlTag = '#actividadesTpl';
// Identificador de la template de mustache
var activitiesGoogleTemplateID = '#tpl-GoogleActivities';
var activitiesHeaderTitles = {
    '0': ['Orden', 'númerodeactividad'],
    '1': ['Titulo','títuloactividad'],
    '2': ['Descripcion','descripción'],
    '3': ['Organizador','organizador'],  
    '4': ['FechaInicio','fechayhorainicio'],
    '5': ['FechaFin','fechayhorafin'],  
    '6': ['Estado','estado'],
    '7': ['NAsistentes','númerodeasistentes'],
    '8': ['Contacto','datosdecontacto'] ,
    '9': ['Emilio','emailcontacto']
};
var activitiesNumberofRows = 10;// number of rows to extract from Excell
var activitiesGoogle_url = "https://docs.google.com/a/colaborativa.eu/spreadsheet/ccc?key=0ApaZkqgevJCgdDNrM0RaX3RhaDEzVGhGcEo5allQaHc#gid=0";
/* 
 *	Flickr 
 *
 */
var flickr_embed_api_key='b1afe35625df4ec2bb0a858fd9983152'; // Solicitar a través de http://embed.ly/ "Embed.ly service"
var flickr_api_key='ee4bdc6841d42f90d9ca5e598e99d2f3'; // Clave API, solicitar a través de la web de Flickr
var flickr_group_id='2233980%40N22'; // Identificador del grupo de Flickr "Huerto Fuensanta"
var flickrTemplateID= '#tpl-flickrimages'; // Identificador de la plantilla de Mustache en donde se insertará la información sobre las imágenes de Flickr 
