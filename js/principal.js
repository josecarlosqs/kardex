//Variables globales
var pantallaActual = 0,
	configuracion = {},
	reconfigurar = false;

//Objetos DOM
var pantallas = document.getElementsByClassName('pantalla'),
	general = document.getElementById("general"),
	contenedor = document.getElementById("contenedor"),
	modal = document.getElementById("modal"),
	contenido = document.getElementsByClassName("contenido"),
	formularioDatosIniciales = document.getElementById("datosIniciales"),
	formularioOperaciones = document.getElementById("formularioOperaciones");

//Funciones
var dimensionarDivContenido = function(callback){
		var callback = callback || function(){};
		for(i in contenido){
			if(typeof contenido[i] === "object"){
				contenido[i].style.height = (document.body.clientHeight-100)+"px";
			}
		}
		callback();
	},
	cantidadItemsObjeto = function(obj){
		cant = 0;
		for(n in obj){
			cant++;
		}
		return cant;
	},
	inicializar = function(reconf){
		formularioDatosIniciales.reset();
		formularioOperaciones.reset();
		reconf = reconf || false;
		this.reconfigurar = reconf;
		Velocity(modal, "fadeIn", {duration: 10});
	},
	cambiarPantalla=function(){
		if(pantallaActual == 0){
			pantallaActual = 1;
			Velocity(contenedor, {left: -1*pantallas[pantallaActual].offsetLeft}, {duration: 500, easing: "easeOutQuint"});
		}else{
			pantallaActual = 0;
			Velocity(contenedor, {left: pantallas[pantallaActual].offsetLeft}, {duration: 500, easing: "easeOutQuint" });
		}
	},
	verDatos = function(){
		swal({
			title: "Datos:",
			text: "<strong class=\"textoSWAL\">Empresa:</strong><p class=\"textoSWAL\">"+configuracion.empresa+"</p><strong class=\"textoSWAL\">Responsable:</strong><p class=\"textoSWAL\">"+configuracion.responsable+"</p><strong class=\"textoSWAL\">Metodo:</strong><p class=\"textoSWAL\">"+configuracion.metodo.toUpperCase()+"</p>",
			html: true,
			customClass: "sweetExtra"
		});
	},
	validar = {
		fecha: function(fecha){
			var regex =  /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[012])[-\/](19|20)?[019][1-9]$/m;
			return regex.test(fecha);
		},
		entero: function(num){
			var regex = /^[0-9]+$/m;
			return regex.test(num);
		},
		flotante: function(num){
			var regex = /^[0-9]+([\.][0-9]+)?$/m;
			return regex.test(num);
		}
	},
	aDosDigitos = function(numero){
		var str = "" + numero;
		var pad = "00";
		return pad.substring(0, pad.length - str.length) + str;
	};

//Objetos de Plugin
var eventosMobile = new Hammer(general),
	selFecha = new Pikaday(
		{
			field: document.getElementById('fecha'),
			format: 'DD/MM/YY',
			i18n: {
			    previousMonth : 'Mes anterior',
			    nextMonth     : 'Mes siguiente',
			    months        : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'],
			    weekdays      : ['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo'],
			    weekdaysShort : ['Lun','Mar','Mie','Jue','Vie','Sab','Dom']
			},
			onSelect: function(date) {
		        document.getElementById('fecha').value = aDosDigitos(date.getDate())+"/"+aDosDigitos(date.getMonth()+1)+"/"+date.getFullYear();
		    }
			})

//Listeners
formularioDatosIniciales.onsubmit = function(e){
	e.preventDefault();
	var dataSrc = e.target,
		empresa = dataSrc[0].value,
		responsable = dataSrc[1].value,
		metodo = dataSrc[2].value;
		n_decimales = parseInt(dataSrc[3].value) || 2
 	
 	configuracion.empresa = empresa;
 	configuracion.responsable = responsable;
 	configuracion.metodo = metodo;
 	configuracion.decimales = n_decimales;
	dimensionarDivContenido(function(){
		Velocity(modal, "fadeOut", {duration: 200, complete:function(){
			if(reconfigurar === true){
				swal({title: "Exito", text:"Kardex reconfigurado!",type:"success",timer: 1500});
			}else{
				swal({title: "Exito", text:"Kardex configurado!\nPuedes empezar a llenarlo",type:"success",timer: 1500});
			}
		}});
	});
}


modal.addEventListener("click", function(e){
	if(e.target.id === "modal" && reconfigurar === true){
		Velocity(modal, "fadeOut", {duration: 200});
	}
});
document.addEventListener("keydown", function(e){
	if(e.keyCode === 27 && reconfigurar === true){
		Velocity(modal, "fadeOut", {duration: 200});
	}
});

eventosMobile.on('swipe', function(ev) {
    if(ev.pointerType !== "mouse"){
    	if((pantallaActual === 0 && ev.direction === 2) ||(pantallaActual === 1 && ev.direction === 4)){
    		cambiarPantalla();	
    	}
    	
    }
});

//Funciones a ejecutar
inicializar();