/**
*** OBJETOS Y VARIABLES NESESARIAS ***
**/
var datosKardex = [],
	datosSalidas = [],
	total = {"especie":0,"saldo":0};

/**
*** REFERENCIAS A DOM
**/
var	tablaKardex = document.getElementById("tablaKardex");
	cuerpoTablaKardex = tablaKardex.getElementsByTagName('tbody')[0],
	divCostoUnitario = document.getElementById("costoUnitario");

/**
*** FUNCIONES PRINCIPALES ***
**/
var registrar = {
	entrada: function(fecha,cantidadEntrada,valorUnitario,persona,factura){
		var cantidadEntrada = parseInt(cantidadEntrada),
			valorUnitario = parseFloat(valorUnitario),
			persona = persona || "<span class=\"campoVacio\">(No especificado)</span>",
			factura = factura || "<span class=\"campoVacio\">(No especificado)</span>";
		var ins = {"tipo":"entrada","fecha":formato.fechaObj(fecha),"factura":factura,"persona":persona,"entrada":cantidadEntrada,"valor":valorUnitario};
		var ult = datosKardex.length - 1;
		var indice = 0;
		console.log(ult);
		if(ult === -1){
			datosKardex.push(ins);
		}else{
			for (var i = ult; i >= 0; i--) {
				if(datosKardex[i].fecha.getTime() < ins.fecha.getTime()){
					indice = i+1;
					datosKardex.splice(indice,0,ins);
					break;
				}
			};
		}
		//datosKardex.push(ins);
		total.especie += cantidadEntrada;
		total.saldo += cantidadEntrada*valorUnitario;
		insertarFilaEntrada(ins,indice);

	},
	salida: function(fecha,cantidadSalida,persona,factura){
		var cantidadSalida = parseInt(cantidadSalida),
			valorUnitario = parseFloat(valorUnitario),
			persona = persona || "<span class=\"campoVacio\">(No especificado)</span>",
			factura = factura || "<span class=\"campoVacio\">(No especificado)</span>";
		var ins = {"tipo":"salidaTitulo","fecha":formato.fechaObj(fecha),"factura":factura,"persona":persona,"salida":cantidadSalida};
		var ult = datosKardex.length - 1;
		var indice = 0;
		var filas = cuerpoTablaKardex.rows;
		var cantFilas = filas.length;
		for (var i = ult; i >= 0; i--) {
			if(datosKardex[i].fecha.getTime() < ins.fecha.getTime()){
				indice = i+1;
				break;
			}
		}
		if(parseInt(filas[indice-1].cells[5].innerHTML) >= cantidadSalida){
			insertarFilaTituloSalida(ins,indice);
			datosKardex.splice(indice,0,ins);
			//datosKardex.push(ins);
			total.especie -= cantidadSalida;
			var salidas = obtenerSalidasSegunMetodoSeleccionado(indice,cantidadSalida,formato.fechaObj(fecha));
			
			for (var j = salidas.length - 1; j >= 0 ; j--) {
				insertarFilaSalida(salidas[j],indice+1);
				datosKardex.splice(indice+1,0,salidas[j]);
			};

			//total.saldo -= cantidadSalida*valorUnitario;
		
			mostrarMensajeNuevaEntradaKardex("Nueva salida registrada a Kardex");
		}else{
			swal("Error!","Stock insuficiente para cumplir con esta salida","error");
		}

	}
}

var insertarFilaEntrada = function(obj,indice){
	console.log(indice);
	fila = cuerpoTablaKardex.insertRow(indice);
	fila.dataset.tipo = "entrada";
	var celda = fila.insertCell(0);
	celda.innerHTML = formato.fechaStr(obj.fecha);

	celda = fila.insertCell(1);
	celda.innerHTML = obj.factura;

	celda = fila.insertCell(2);
	celda.innerHTML = obj.persona;

	celda = fila.insertCell(3);
	celda.innerHTML = obj.entrada;
	fila.dataset.restante = obj.entrada;
	fila.dataset.total = obj.entrada;

	celda = fila.insertCell(4);
	celda.innerHTML = "-";

	celda = fila.insertCell(5);
	celda.innerHTML = "<i class=\"fa fa-spinner\"></i>";

	celda = fila.insertCell(6);
	celda.innerHTML = formato.decimales(obj.valor,configuracion.decimales);
	fila.dataset.vu = obj.valor;

	celda = fila.insertCell(7);
	celda.innerHTML = "-";

	celda = fila.insertCell(8);
	celda.innerHTML = formato.decimales(obj.entrada * obj.valor,configuracion.decimales);
	fila.dataset.debe = obj.entrada * obj.valor;

	celda = fila.insertCell(9);
	celda.innerHTML = "-";

	celda = fila.insertCell(10);
	celda.innerHTML = "<i class=\"fa fa-spinner\"></i>";

	celda = fila.insertCell(11);
	celda.classList.add('colUsr');
	celda.innerHTML = "<a href=\"#\" class=\"btnUsr\" data-accion=\"editar\" data-codigo=\"\" title=\"Editar esta fila\"><i class=\"fa fa-pencil\"></i></a><a href=\"#\" class=\"btnUsr\" data-accion=\"eliminar\" data-codigo=\"\" title=\"Eliminar esta fila\"><i class=\"fa fa-trash-o\"></i></a>";

	calcularTotalesTabla();

//	cuerpoTablaKardex.appendChild(fila);
},insertarFilaTituloSalida = function(obj,indice){
	fila = cuerpoTablaKardex.insertRow(indice);
	fila.dataset.tipo = "tituloSalida";
	fila.classList.add("tituloSalida");
	var celda = fila.insertCell(0);
	celda.innerHTML = formato.fechaStr(obj.fecha);

	celda = fila.insertCell(1);
	celda.innerHTML = obj.factura;

	celda = fila.insertCell(2);
	celda.innerHTML = obj.persona;

	celda = fila.insertCell(3);
	celda.innerHTML = "-";

	celda = fila.insertCell(4);
	celda.innerHTML = obj.salida;
	fila.dataset.salida = obj.salida;

	celda = fila.insertCell(5);
	celda.innerHTML = "-";

	celda = fila.insertCell(6);
	celda.innerHTML = "-";

	celda = fila.insertCell(7);
	celda.innerHTML = "-";

	celda = fila.insertCell(8);
	celda.innerHTML = "-";

	celda = fila.insertCell(9);
	celda.innerHTML = "-";

	celda = fila.insertCell(10);
	celda.innerHTML = "-";

	celda = fila.insertCell(11);
	celda.classList.add('colUsr');
	celda.innerHTML = "<a href=\"#\" class=\"btnUsr\" data-accion=\"editar\" data-codigo=\"\" title=\"Editar esta fila\"><i class=\"fa fa-pencil\"></i></a><a href=\"#\" class=\"btnUsr\" data-accion=\"eliminar\" data-codigo=\"\" title=\"Eliminar esta fila\"><i class=\"fa fa-trash-o\"></i></a>";

	calcularTotalesTabla();
}
,insertarFilaSalida = function(obj,indice){
	fila = cuerpoTablaKardex.insertRow(indice);
	fila.classList.add("filaSalida");
	fila.dataset.tipo = "salida";
	var celda = fila.insertCell(0);
	celda.innerHTML = formato.fechaStr(obj.fecha);

	celda = fila.insertCell(1);
	celda.innerHTML = "~";

	celda = fila.insertCell(2);
	celda.innerHTML = "~";

	celda = fila.insertCell(3);
	celda.innerHTML = "~";

	celda = fila.insertCell(4);
	celda.innerHTML = obj.salida;
	fila.dataset.total = obj.salida;

	celda = fila.insertCell(5);
	celda.innerHTML = "<i class=\"fa fa-spinner\"></i>";

	celda = fila.insertCell(6);
	celda.innerHTML = "-";

	celda = fila.insertCell(7);
	celda.innerHTML = formato.decimales(obj.pu,configuracion.decimales);

	celda = fila.insertCell(8);
	celda.innerHTML = "-";

	celda = fila.insertCell(9);
	celda.innerHTML = formato.decimales(obj.salida * obj.pu,configuracion.decimales);
	fila.dataset.haber = obj.salida * obj.pu;

	celda = fila.insertCell(10);
	celda.innerHTML = "<i class=\"fa fa-spinner\"></i>";

	celda = fila.insertCell(11);
	celda.classList.add('colUsr');
	celda.innerHTML = "";

	calcularTotalesTabla();
},
obtenerSalidasSegunMetodoSeleccionado = function(pos,cant,fecha){
	var tem = [];
	var filas = cuerpoTablaKardex.rows;
	var cantFilas = filas.length;
	switch(configuracion.metodo){
		case 'peps':
			var i;
			for (i = 0; i <= pos; i++) {
				if(filas[i].dataset.tipo === "entrada" && parseInt(filas[i].dataset.restante) > 0){
					if(parseInt(filas[i].dataset.restante) >= cant){
						filas[i].dataset.restante = parseInt(filas[i].dataset.restante) - cant;
						tem.push({"tipo":"salida","fecha":fecha,"salida":cant,"pu":parseFloat(filas[i].dataset.vu)});
						break;
					}else{
						cant = cant-parseInt(filas[i].dataset.restante);
						tem.push({"tipo":"salida","fecha":fecha,"salida":parseInt(filas[i].dataset.restante),"pu":parseFloat(filas[i].dataset.vu)});
						filas[i].dataset.restante = 0;
					}
				}
			};

		break;
		case 'ueps':
			var i;
			for (i = pos-1; i >= 0; i--) {
				if(filas[i].dataset.tipo === "entrada" && parseInt(filas[i].dataset.restante) > 0){
					if(parseInt(filas[i].dataset.restante) >= cant){
						filas[i].dataset.restante = parseInt(filas[i].dataset.restante) - cant;
						tem.push({"tipo":"salida","fecha":fecha,"salida":cant,"pu":parseFloat(filas[i].dataset.vu)});
						break;
					}else{
						cant = cant-parseInt(filas[i].dataset.restante);
						tem.push({"tipo":"salida","fecha":fecha,"salida":parseInt(filas[i].dataset.restante),"pu":parseFloat(filas[i].dataset.vu)});
						filas[i].dataset.restante = 0;
					}
				}
			};
		break;
		case 'pp':
			var fila = filas[pos-1];
			var pu = parseFloat(fila.cells[10].innerHTML)/parseInt(fila.cells[5].innerHTML);
			tem.push({"tipo":"salida","fecha":fecha,"salida":cant,"pu":pu});
		break;
		default:

	}
	console.log(tem)
	return tem;
};

/***
** FUNCIONES CALCULAR ***
***/
var calcularTotalesTabla = function(){
	var filas = cuerpoTablaKardex.rows;
	var totalEspecie = 0;
	var saldoTotal = 0;
	var totalFilas = filas.length;
	var i;
	for(i = 0; i < totalFilas; i++){
		if(filas[i].dataset.tipo !== "tituloSalida"){
			if(filas[i].dataset.tipo === "entrada"){				
				totalEspecie += parseInt(filas[i].dataset.total);
				saldoTotal += parseFloat(filas[i].dataset.debe);	
			}else{
				totalEspecie -= parseInt(filas[i].dataset.total);
				saldoTotal -= parseFloat(filas[i].dataset.haber);
			}

			filas[i].cells[5].innerHTML = formato.decimales(totalEspecie,configuracion.decimales);
			filas[i].cells[10].innerHTML = formato.decimales(saldoTotal,configuracion.decimales);
		}
	}
};

/**
*** OTRAS FUNCIONES
**/
var vaciarFormulario = function(){
	formularioOperaciones.cantidad.value = "";
	formularioOperaciones.compra.value = "";
	formularioOperaciones.tipoEspecie.selectedIndex = 0;
	divCostoUnitario.classList.add('oculto');
	formularioOperaciones.persona.value = "";
	formularioOperaciones.comprobante.value = "";
	formularioOperaciones.fecha.focus();
},
recalcularSalidas = function(){
	console.log(datosKardex)
	console.log("Recalculando salidas con la nueva metodologia");
	var i,total = datosKardex.length;
	cuerpoTablaKardex.innerHTML = "";

	for(i = 0; i<total;i++){
		if(datosKardex[i].tipo === "salida"){
			datosKardex.splice(i,1);
		}
	}
	console.log(datosKardex);
	//eliminart salidas de datosKardex
	//reponer
	//reimprimir
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
						registrar.entrada(e.target[0].value,e.target[2].value,e.target[3].value,e.target[4].value,e.target[5].value);
						vaciarFormulario();
						mostrarMensajeNuevaEntradaKardex("Nueva entrada registrada en Kardex");
						console.log(datosKardex);
					}else{
						registrar.salida(e.target[0].value,e.target[2].value,e.target[4].value,e.target[5].value);
						
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