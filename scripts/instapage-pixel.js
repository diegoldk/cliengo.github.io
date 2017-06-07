/**
 * Script de integracion para landings de Instapage
 */

/**
 * código para guardar el gclid de adwords en el campo hidden "gclid" de
 * instapage, y que lo pueda enviar luego a salesforce
 */
function getParam(p) {
	var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var gclid = getParam('gclid');

if (gclid) {
	/*
	 * Este es el selector de instapage para el nombre 'gclid' porque lo
	 * encodean en base 64
	 */
	var inputs = ijQuery('input[name="Z2NsaWQ="]');
	if (inputs == null) {
		console.error(
				'Leadaki: Hay gclid %s pero no inputs hidden de name "gclid"',
				gclid);
	}
	inputs.val(gclid);
	console.log(
			'Leadaki: guardado el gclid %s correctamente en %s campos hidden',
			gclid, inputs.size())
} else {
	console.log('Leadaki: no se encontró ningún gclid');
}

//Disparado automático de pixels si está el script de Leadaki
window.instapageFormSubmitSuccess = function( form )
{
  console.log('Leadaki: se completó un formulario correctamente');
  //si está leadaki instalado disparo los pixels cuanco completan el formulario
  if (window.Leadaki && fireNewLeadPixels)
  {
	  console.log('Leadaki: disparando pixels de conversión');
	  fireNewLeadPixels()  
  }
}
