//Variables globales
var datosKardex = [],
	datosSalidas = [],
	stockTotal = 0;

//Objetos
var contenidoKardex = document.getElementById("contenidoKardex"),
	divCostoUnitario = document.getElementById("costoUnitario"),
	mensajekardex = document.getElementById("mensajeKardex");

//Funciones
var agregarEntrada = function(fecha,cantidad,valorUnitario,proveedor,comprobante){
	var proveedor = proveedor || "-",
		comprobante = comprobante || "-";
	stockTotal += parseInt(cantidad);
	datosKardex.push({"tipo":"entrada","fecha":fecha,"cantidadIngresada":parseInt(cantidad),"restante":parseInt(cantidad),"valorUnitario":parseFloat(valorUnitario),"proveedor":proveedor,"comprobante":comprobante});
	console.log(datosKardex);
	console.log(stockTotal);
},
agregarSalida = function(fecha,cantidad,proveedor,comprobante){
	var proveedor = proveedor || "-",
		comprobante = comprobante || "-";
	stockTotal -= parseInt(cantidad);
	datosKardex.push({"tipo":"salida","fecha":fecha,"cantidadSacada":parseInt(cantidad),"proveedor":proveedor,"comprobante":comprobante});
	var cod = datosKardex.length - 1;
	datosSalidas[cod] = generarSalidasSegunMetodoSeleccionado(cod);
	console.log(datosSalidas);
},
generarSalidasSegunMetodoSeleccionado = function(cod){
	var tem = [];
	switch(configuracion.metodo){
		case 'peps':
			var restanteParaSacar = datosKardex[cod].cantidadSacada;
			for(x in datosKardex){
				if(datosKardex[x].tipo === "entrada" && datosKardex[x].restante > 0){
					if(datosKardex[x].restante >= restanteParaSacar){
						datosKardex[x].restante = datosKardex[x].restante - restanteParaSacar;
						tem.push({"precioUnitario": datosKardex[x].valorUnitario,"cantidad":restanteParaSacar});
						break;
					}else{
						tem.push({"precioUnitario": datosKardex[x].valorUnitario,"cantidad":datosKardex[x].restante});
						restanteParaSacar -= datosKardex[x].restante;
						datosKardex[x].restante = 0;
					}
				}
				//Verificar luego
				if(x === cod){
					break;
				}
			}
		break;
		case 'ueps':
			console.log("Entro a ueps");
			var restanteParaSacar = datosKardex[cod].cantidadSacada;
			for (var x = cod; x >= 0; x--) {
				console.log("plep");
				if(datosKardex[x].tipo === "entrada" && datosKardex[x].restante > 0){
					if(datosKardex[x].restante >= restanteParaSacar){
						datosKardex[x].restante = datosKardex[x].restante - restanteParaSacar;
						tem.push({"precioUnitario": datosKardex[x].valorUnitario,"cantidad":restanteParaSacar});
						break;
					}else{
						tem.push({"precioUnitario": datosKardex[x].valorUnitario,"cantidad":datosKardex[x].restante});
						restanteParaSacar -= datosKardex[x].restante;
						datosKardex[x].restante = 0;
					}
				}
			};
		break;
		case 'pp':

		break;
		default:

	}

	return tem;
},
vaciarFormulario = function(){
	formularioOperaciones.cantidad.value = "";
	formularioOperaciones.compra.value = "";
	formularioOperaciones.tipoEspecie.selectedIndex = 0;
	divCostoUnitario.classList.add('oculto');
	formularioOperaciones.persona.value = "";
	formularioOperaciones.comprobante.value = "";
	formularioOperaciones.fecha.focus();
},
mostrarMensajeNuevaENtradaKardex = function(msj){
	var divMsj=document.createElement("div"),
		mensajes = document.getElementsByClassName("mensajeKardex");
	divMsj.classList.add('mensajeKardex');
	divMsj.innerHTML = "<i class=\"fa fa-check\"></i>&nbsp;"+msj;
	if(mensajes.length > 0){
		Velocity(mensajes, {bottom: "+=90"}, {duration:150});
	}
	general.appendChild(divMsj);
	Velocity(divMsj,{right:20},{duration:200,complete:function(e){
		setTimeout(function(edom){Velocity(edom, "fadeOut", 150)},1500,this)
	}});
},
decimales = function(decimales, numero){
	factor = Math.pow(10,decimales);
	return Math.round(numero*factor)/factor;
}


//Listeners
document.getElementById("fecha").addEventListener("focus",function(e){
	selFecha.adjustPosition();
});
formularioOperaciones.onsubmit = function(e){
	e.preventDefault();

	if(validar.fecha(e.target[0].value)){
		if(e.target[1].value === "entrada" || e.target[1].value === "salida"){
			if(validar.entero(e.target[2].value)){
				if(e.target[1].value === "salida" || validar.flotante(e.target[3].value)){
					if(e.target[1].value === "entrada"){
						agregarEntrada(e.target[0].value,e.target[2].value,e.target[3].value,e.target[4].value,e.target[5].value);
						vaciarFormulario();
						mostrarMensajeNuevaENtradaKardex("Nueva entrada registrada en Kardex");
					}else{
						if(parseInt(e.target[2].value) <= stockTotal){
							agregarSalida(e.target[0].value,e.target[2].value,e.target[4].value,e.target[5].value);
							vaciarFormulario();
							mostrarMensajeNuevaENtradaKardex("Nueva salida registrada a Kardex");
						}else{
							e.target[2].focus();
							swal("Error!","Stock insuficiente para cumplir con esta salida","error");
						}
					}
					vaciarFormulario();
				}else{
					e.target[3].focus();
					swal({title:"Error", text:"El precio no es válido!",type:"error"});
				}
			}else{
				e.target[2].focus();
				swal({title:"Error", text:"La cantidad debe ser un numero entero!",type:"error"});
			}
		}else{
			e.target[1].focus();
			swal({title:"Error", text:"Debes seleccionar el tipo de operación!",type:"error"});
		}
	}else{
		e.target[0].focus();
		swal({title:"Error", text:"Fecha no válida!",type:"error"});
	}
}


document.getElementById("tipoEspecie").onchange = function(a){
	if(a.target.selectedIndex === 1){
		divCostoUnitario.classList.remove('oculto');
	}else{
		divCostoUnitario.classList.add('oculto');
	}
}
/*
var str = "<tr>";
			str += "<td>"+datosKardex[i].fecha+"</td>";//Fecha
			str += "<td>"+datosKardex[i].comprobante+"</td>";//Comprobante opcional
			str += "<td>"+datosKardex[i].persona+"</td>";//Cliente o proveedor
			str += "<td>-</td>";//Especie - Entrada
			str += "<td>"+datosKardex[i].cantidad+"</td>";//Especie - Salida
			str += "<td>"+calcularExistenciasHasta(i)+"</td>";//Especie - Existencia
			str += "<td>-</td>";//Precio - Compra
			var pSalida = calcularSaldoHasta(i)/calcularExistenciasHasta(i);
			str += "<td"+pSalida+"</td>";//Precio - Salida
			str += "<td>-</td>";//Valores - Debe
			str += "<td>"+pSalida*datosKardex[i].cantidad+"</td>";//Valores - Haber
			str += "<td>"+calcularSaldoHasta(i)+"</td>";//Valores - Saldo
			str += "<td class=\"colUsr\"><a href=\"#\" class=\"btnUsr\" data-accion=\"editar\" data-codigo=\"\" title=\"Editar esta fila\"><i class=\"fa fa-pencil\"></i></a><a href=\"#\" class=\"btnUsr\" data-accion=\"eliminar\" data-codigo=\"\" title=\"Eliminar esta fila\"><i class=\"fa fa-trash-o\"></i></a></td>";//Opciones de usuario
			str += "</tr>";
*/