var pantallaActual = 0,
	pantallas = document.getElementsByClassName('pantalla'),
	general = document.getElementById("general"),
	contenedor = document.getElementById("contenedor"),
	modal = document.getElementById("modal"),
	datosKardex = [],
	cantRegistros = 0
	n_decimales = -1,
	metodo = '',
	responsable = '';

var inicializar = function(silente){
	Velocity(modal, "fadeIn", {duration: 200});
}

document.getElementById("msj").innerHTML = "<span><i class=\"fa fa-chevron-right\"></i>&nbsp;Ir al Kardex&nbsp;<i class=\"fa fa-chevron-right\"></i></span>";

document.getElementById('msj').addEventListener('click', function(e){
         if(pantallaActual == 0){
			pantallaActual = 1;
			Velocity(contenedor, {left: -1*pantallas[pantallaActual].offsetLeft}, {duration: 400});
			document.getElementById("msj").innerHTML = "<span><i class=\"fa fa-chevron-left\"></i>&nbsp;Ir al formulario de operaciones&nbsp;<i class=\"fa fa-chevron-left\"></i></span>";
		}else{
			pantallaActual = 0;
			Velocity(contenedor, {left: pantallas[pantallaActual].offsetLeft}, {duration: 400 });
			document.getElementById("msj").innerHTML = "<span><i class=\"fa fa-chevron-right\"></i>&nbsp;Ir al Kardex&nbsp;<i class=\"fa fa-chevron-right\"></i></span>";
		}
        e.preventDefault();
  });
general.onmousemove = function(){
	//console.log('f');
}

//Listeners
document.getElementById("datosIniciales").onsubmit = function(e){
	e.preventDefault();
	var dataSrc = e.target;

	 responsable = dataSrc[0].value;
	 metodo = dataSrc[1].value;
	 n_decimales = parseInt(dataSrc[2].value);
	
	if(n_decimales === -1 || metodo === '' || responsable === ''){
		return false;
	}else{
		Velocity(modal, "fadeOut", {duration: 200, complete: function(){
			console.log(responsable);
			console.log(metodo);
			console.log(n_decimales);
		}});
	}	
}



if(n_decimales === -1 || metodo === '' || responsable === ''){
	inicializar();
}