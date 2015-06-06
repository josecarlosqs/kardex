formato = {
	fechaObj: function(fecha){
		var d = new Date();
		var e = fecha.split(/[-\/]/);
		d.setDate(e[0]);
		d.setMonth(e[1]);
		d.setFullYear(e[2]);
		return d;
	},
	fechaStr: function(objFecha){
		return objFecha.getDate()+"/"+objFecha.getMonth()+"/"+objFecha.getFullYear();
	},
	decimales: function(numero,cantidad){
		var fc = Math.pow(10,cantidad);
		return Math.round(numero*fc)/fc
	}
}