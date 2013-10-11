
/**
 *
 * We call againg google for getting images and colors just in case it is first page visited
 * of our visited and localStorage is not available yet.
 *
 */
$( document ).ready(function() {
	getImageColorsCabeceraSegunda();
	getListActivitiesIntoTemplate(activitiesGoogle_sh_id, activitiesHeaderTitles, activitiesGoogle_htmlTag, true);
});