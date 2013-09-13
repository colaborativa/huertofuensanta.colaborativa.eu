huertofuensanta.org
===================

La plataforma digital del #huertoFuensanta en Córdoba, Andalucía

# Introducción
Este documento sirve de guía de desarrollo para la plataforma digital del #huertoFuensanta, un huerto urbano social y ecológico situado en el barrio de la Fuensanta de Córdoba. El #huertoFuensanta se inició en Septiembre de 2012 y recupera, a través de un huerto urbano, un solar público abandonado desde hace más de 20 años.

Para conocer más sobre el proyecto mientras se construye la plataforma puedes visitar nuestra [página de Facebook](https://www.facebook.com/HuertoFuensanta).

Este desarrollo quiere ofrecer una plataforma digital ágil y sencilla enfocada a la comunicación y gestión de proyectos sociales de recuperación urbana.

# Decisiones Técnicas

## Software de gestión de la lista de correo

Buscamos un software de código abierto, gratuito, en español, fácil de usar e intuitivo para la gestión de la lista de correo del Huerto Fuensanta. 

La opción de código libre más consolidada en la actualidad es [Mail Man](http://www.gnu.org/software/mailman/) pero requiere cierto nivel de conocimiento, tiene un interfaz bastante anticuado y orientado a la comunidad linux. Por esta razón vamos a continuar utilizando Google Groups, a pesar de ser software propietario, ya que no queremos excluir a nadie de la lista de correo, si sabes recibir y enviar emails puedes comunicarte con el equipo del Huerto sin problemas. 

Estamos a la espera de que el proyecto 100% abierto [Discourse](http://www.discourse.org/) madure para poder usarlo en el futuro como gestor de lista de correo y plataforma de comunicación, en la actualidad se encuentra en versión beta. Promete bastante al estar basado en las últimas técnologías Web (ruby on rails) dejando atrás PHP y MySQL.

## Subscripción automática a la lista de correo de Google huertofuensanta@googlegroups.com

Queremos que la subscripción a la lista de google se realice de forma automática desde la página principal del Huerto con tan sólo introducir el email y hacer click. Por ello hemos realizado una investigación de la API de Google disponible para gestionar un google group de manera que podamos implementarlo de forma programática. 

El único requisito que hemos impuesto es que la subscripción pueda realizarse directamente desde cliente en lenguaje, por ejemplo, Javascript ya que no disponemos de servidor para alojar la página Web del Huerto y además nos gustaría consumir el mínimo de recursos posibles.

La API de Google se encuentra dividida en varias partes, la documentación es bastante farragosa y apenas se disponen de ejemplos prácticos de aplicación que sirvan de guía. Los recursos disponibles son:

- [GAPI o Google APIs Client Library for Javascript](https://code.google.com/p/google-api-javascript-client): manual de uso de la librería GAPI para Javascript. Funciones disponibles en Javascript muy adecuada en nuestro caso al ser un lenguaje cliente pero que se encuentra incompleta y en desarrollo.
- [APIs Explorer](https://developers.google.com/apis-explorer/#p/): estas son las funciones accesibles a través de la librería Javascript cliente GAPI. Desgraciadamente no existe la función de añadir un nuevo miembro a un grupo de google.
- [ADMIN SDK](https://developers.google.com/admin-sdk/): conjunto de funciones accesibles a través de llamadas POST a la URL https://www.googleapis.com/. Las librerías se encuentran disponibles en lenguaje python, java y .net. Habría que implementar llamadas POST en Javascript para poder usar las funciones de acceso y modificación de grupos de google. La librería Javascript GAPI no funciona con estas funciones.
- [Google Apps Provisioning API](https://developers.google.com/google-apps/provisioning (DEPRECATED)): esta API está *deprecated* por lo que se desaconseja su uso. Las funciones son accesibles a través de llamadas POST a la URL https://apps-apis.google.com/, además pueden invocarse a través de la GAPI Javascript.  No la utilizamos ya que dejará de estar disponible en los próximos meses y será reemplazada por la Admin SDK.

La conclusión es que por ahora no existe una forma de añadir un nuevo miembro a un grupo de Google en lenguaje cliente. Quedamos a la espera de que la librería GAPI siga evolucionando e implemente estas funciones. La **solución** mientras tanto es que el propio usuario envíe un email y se subscriba a la lista, al hacer click en subscribir se abrirá la aplicación de correo configurada por defecto con el email de destino: huertofuensanta+subscribe@googlegroups.com.

Adicionalmente hemos encontrado dificultades con el protocolo de autorización OATH2.0. Después de conseguir obtener un token de autorización a través de Javascript usando los datos proporcionados por la [consola de gestión de Apps](https://code.google.com/apis/console/#project:425984504337), al trascurrir cierto tiempo el token siempre expirará (incluso el número de refrescos de token está limitado) y la operación no será totalmente transparente al usuario de nuestra página Web ya que tendrá que aceptar el acceso. Nos gustaría poder eliminar está interrelación y una vez obtenemos el token evitar su expiración. Habrá que retomar este punto una vez que la GAPI implemente la función de añadir un nuevo miembro.

# Manual de uso
## ¿Cómo funciona la lista de correo Huerto Fuensanta de Google Groups?

Para unirse a la lista de correo del Huerto Fuensanta no es necesario tener una cuenta de gmail, cualquier email es válido para unirse al grupo.

 - Para unirse al Huerto Fuensanta envía un email a huertofuensanta+subscribe@googlegroups.com
 - Para visitar el grupo https://groups.google.com/d/forum/huertofuensanta?hl=es 
 - Para publicar una entrada en este grupo, envía un correo electrónico a huertofuensanta@googlegroups.com 
 - Para anular tu suscripción a este grupo, envía un correo electrónico a huertofuensanta+unsubscribe@googlegroups.com 

## ¿Cómo añadir talleres/eventos/encuentros al listado de "Próximas Actividades?"

El listado de actividades en la página Web se rellena a partir del contenido de una [hoja de cálculo]( https://docs.google.com/a/colaborativa.eu/spreadsheet/ccc?key=0ApaZkqgevJCgdDNrM0RaX3RhaDEzVGhGcEo5allQaHc#gid=0) alojada en Google Drive. Esta hoja es abierta y de acceso público por lo que cualquiera puede añadir actividades.

Al añadir una actividad hay que tener cuidado con la columna "Estado". Hay que especificar "PENDIENTE" si no está confirmada al 100% y "CONFIRMADA" sólo cuando la actividad esté confirmada de forma definitiva. A partir del momento en que este confirmada la actividad, os animamos a que la mováis en vuestras redes a través de Facebook y Twitter.

La idea es que todo el mundo que desee hacer una actividad en el huerto tan sólo tenga que escribir un email a la lista informando (huertofuensanta@googlegroups.com) y que pueda subir la información él mismo. Si cualquiera tiene dudas sobre una actividad específica le animamos a que las plantee a la lista de correo, siempre desde el respeto hacia el que propone la actividad y apreciando el trabajo que todo el mundo ha hecho para el que huerto Fuensanta sea una realidad.
