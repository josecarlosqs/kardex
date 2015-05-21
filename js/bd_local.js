var soportaLS = function(){
	if(typeof(Storage) !== "undefined") {
    	return true;
	} else {
	    return false;
	}
}

var configurarKardex = function(responsable,metodo,decimales){
	var decimales = decimales || 2;
	localStorage.responsable = responsable;
	localStorage.metodo = metodo;
	localStorage.decimales = decimales;
}
var obtenerConfiguracion = function(){
	if(typeof localStorage.responsable !== "undefined" && typeof localStorage.metodo !== "undefined" && typeof localStorage.decimales !== "undefined"){
		return {"responsable": localStorage.responsable, "metodo": localStorage.metodo, "decimales": localStorage.decimales};
	}else{
		return false;
	}
}

var reiniciarTodo = function(){
	localStorage.clear();
}