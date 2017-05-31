/** código para guardar el gclid de adwords en el campo hidden "gclid" de instapage, y que lo pueda enviar luego a salesforce */

function getParam(p){
	var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var gclid = getParam('gclid');

if(gclid){
	/* Este es el selector de instapage para el nombre 'gclid' porque lo encodean en base 64  */
	var inputs = ijQuery('input[name="Z2NsaWQ="]'); 
	if(inputs == null){
		console.error('Leadaki: Hay gclid %s pero no inputs hidden de name "gclid"', gclid);
	}
	inputs.val(gclid);
	console.log('Leadaki: guardado el gclid %s correctamente en %s campos hidden', gclid, inputs.size())
} else {
	console.log('Leadaki: no se encontró ningún gclid');
}



//Disparado automático de pixels si está el script de Leadaki
window.instapageFormSubmitSuccess = function( form )
{
	//	TODO cambiar a metodo de staticScript
	  function ldkTrackContactFormSerialized2(formSerialized, successCallback) {
		var dataParams = "";
		formSerialized.forEach(function(k, s) {
			dataParams += s + "=" + k + "&";
		});

		// TODO
		// ldkTrackContactFormSerialized(dataParams, successCallback);

		$.ajax({
			type : 'POST',
			url : 'https://app.cliengo.com/Siteless/contactSave',
			data : dataParams + '&ldkCompanyId=' + Leadaki.companyId
					+ '&ldkWebsiteId=' + Leadaki.websiteId
					+ '&ldkRefererTracking='
					+ encodeURIComponent(readCookie(LDK_REFERER_TRACKING))
					+ addUtmsParam() + addCustomLeadData(),
			success : function(data) {
				if (successCallback) {
					if ($.isFunction(successCallback)) {
						successCallback();
					} else {
						eval(successCallback);
					}
				}
				// track google analytics conversion
				trackGAEvent('Form', 'Conversion');
				trackGAEvent('Form', 'Convertion'); // deprecado - mantenido por
													// compatiblildad
				fireNewLeadPixels();
			},
			dataType : "jsonp",
			// TODO ldkTrackContactFormSerialized
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			async : true
		});
	}

  console.log('Leadaki: se completó un formulario correctamente');
  //si está leadaki instalado disparo los pixels cuanco completan el formulario
  if (window.Leadaki && fireNewLeadPixels)
  {
    var params = new Map();
    [].slice.call(form).forEach(function (el, i) {
        console.log(i);
    	console.log(el);
    	console.log(el.value);
    	
    	try{
    		params.set(base64_decode(el.name),el.value);
    	}catch(e){
    		console.log(e);
    	}
    	
    });
    ldkTrackContactFormSerialized2(params, successCallback);
// console.log('Leadaki: disparando pixels de conversión');
    fireNewLeadPixels()
  }
}
