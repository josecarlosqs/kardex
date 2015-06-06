var Validador = function(objInput){
	var tipo = objInput.getAttribute('data-tipo');
	switch(tipo){
		case 'fecha':
		break;

	}
},validar = {
		fecha: function(fecha){
			var regex =  /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[012])[-\/](19|20)?[019][1-9]$/m;
			var elem = fecha.split(/[-\/]/);
			var res = false;
			var d = new Date();
			d.setDate(elem[0]);
			d.setMonth(elem[1]);
			d.setFullYear(elem[2]);
			if(parseInt(elem[0]) == d.getDate() && parseInt(elem[1]) == d.getMonth() && parseInt(elem[2]) == d.getFullYear()){
				res = true;
			}
			return (regex.test(fecha) && res);
		},
		entero: function(num){
			var regex = /^[0-9]+$/m;
			return regex.test(num);
		},
		flotante: function(num){
			var regex = /^[0-9]+([\.][0-9]+)?$/m;
			return regex.test(num);
		}
	};