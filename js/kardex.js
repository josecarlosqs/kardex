

var decimales = function(decimales, numero){
	factor = Math.pow(10,decimales);
	return Math.round(numero*factor)/factor;
}

var existenciasTotales = function(){
	var total = 0;
	if(datos.length > 1){
		for(n in datos){		
			if(typeof datos[n].entrada !== "undefined"){
				total += datos[n].entrada;
			}else{
				total -= datos[n].salida;
			}
		}
	}
	return parseFloat(total);
}

var saldoTotal = function(){
	var total = 0;
	if(datos.length > 0){
	
		for(n in datos){
			if(typeof datos[n].debe !== "undefined"){
				total += datos[n].debe;
			}else{
				total -= datos[n].haber;
			}
		}
	}

	return parseFloat(total);
}

var obtenerCodEntrada = function(){
	switch(metodo){
		case 'peps':
			for(n in datos){
				if(datos[n].especie.entradaActual > 0){
					return n;
					break;
				}
			}
			break;
		case 'ueps':
			for (var i = datos.length - 1; i >= 0; i--) {
				if(datos[i].especie.entradaActual > 0){
					return i;
					break;
				}
			};
			break;
	}
}

var agregar = function(obj){
	var insertar = null;
	if(obj.tipoEspecie === "entrada"){
		insertar = {
					numero: ++cant,
					fecha: obj.fecha,
					comprobante: obj.comprobante,
					especie: {
						entradaOrig : obj.cantidad,
						entradaActual : obj.cantidad,
						existencia: function(){return existenciasTotales() + parseFloat(obj.cantidad);}
					},
					compra: obj.compra,
					valor: {
						debe : decimales(n_decimales,obj.compra*obj.cantidad),
						saldo: function(){return saldoTotal() + parseFloat(obj.cantidad);}
						}
					};
	}else{
		if(metodo === "pp"){
			insertar = {
					'numero': ++cant,
					'fecha': obj.fecha,
					'comprobante': '-',
					'especie': {
						'salida' : obj.cantidad,
						'existencia':function(){return existenciasTotales() - parseFloat(obj.cantidad);}
					},
					'salida': decimales(n_decimales,saldoTotal/existenciasTotales()),
					'valor': {
						'haber' : decimales(n_decimales,obj.salida*obj.cantidad),
						'saldo':function(){return saldoTotal() - obj.cantidad;}
						}
					};
		}else{
			insertar = {
					'numero': ++cant,
					'fecha': obj.fecha,
					'comprobante': obj.comprobante,
					'salida' : obj.cantidad,
					'salidas': function(){
						var salidas = [],
							cod = obtenerCodEntrada(),
							salida = this.salida;
						do{
							if(datos[cod].especie.entradaActual >= salida){
								datos[cod].especie.entradaActual -= salida;
								salidas.push({
									'especie':{
										'salida':salida,
										'existencia':function(){return existenciasTotales() - salida;}
									},
									'salida':datos[cod].compra,
									'valor': {
										'haber' : decimales(n_decimales,obj.salida*obj.cantidad),
										'saldo':function(){return saldoTotal() - obj.cantidad;}
										}
								});
							}else{
								salida = salida - datos[cod].especie.entradaActual;
								datos[cod].especie.entradaActual = 0;
								salidas.push({
									'especie':{
										'salida':salida,
										existencia:function(){return existenciasTotales() - salida;}
									},
									'salida':datos[cod].compra,
									'valor': {
										'haber' : decimales(n_decimales,obj.salida*obj.cantidad),
										'saldo':function(){return saldoTotal() - obj.cantidad;}
										}
								});
								cod = obtenerCodEntrada();
							}
						}while(salida > 0);

						return salidas;
					}
				};
		}

	}
	datos.push(insertar);
}

var htmlUnitario = function(fecha, comprobante, e_entrada, e_salida, e_existencia, p_compra, p_salida, v_debe, v_haber, v_saldo){
	var comprobante = comprobante || "-",
	e_entrada = e_entrada || "-",
	e_salida = e_salida || "-",
	e_existencia = e_existencia || "-",
	p_compra = p_compra || "-",
	p_salida = p_salida || "-",
	v_debe = v_debe || "-",
	v_haber = v_haber || "-",
	v_saldo = v_saldo || "-";
	return '<tr><td>'+fecha+'</td><td>'+comprobante+'</td><td>Mr. Brain</td><td>'+e_entrada+'</td><td>'+e_salida+'</td><td>'+e_existencia+'</td><td>'+p_compra+'</td><td>'+p_salida+'</td><td>'+v_debe+'</td><td>'+v_haber+'</td><td>'+v_saldo+'</td><td class="colUsr"><a href="#" class="btnUsr" data-accion="editar" data-codigo="" title="Editar esta fila"><i class="fa fa-pencil"></i></a><a href="#" class="btnUsr" data-accion="eliminar" data-codigo="" title="Eliminar esta fila"><i class="fa fa-trash-o"></i></a></td></tr>';
}

var generarHTML = function(){
	var codigoHTML = "";

	for(num in datos){
		if(typeof datos[num].compra === "undefined"){
			codigoHTML += htmlUnitario(
				datos[num].fecha,
				datos[num].comprobante,
				null,
				datos[num].especie.salida,
				(datos[num].especie.existencia()),
				null,
				datos[num].salida,
				null,
				datos[num].valor.haber,
				datos[num].valor.saldo()
				);
		}else{
			codigoHTML += htmlUnitario(
				datos[num].fecha,
				datos[num].comprobante,
				datos[num].especie.entradaOrig,
				null,
				datos[num].especie.existencia(),
				datos[num].compra,
				null,
				datos[num].valor.debe,
				null,
				datos[num].valor.saldo()
				);
		}
	}
	document.getElementById("tablaKardex").innerHTML = codigoHTML;
}

//Listeners
document.getElementById("formu").onsubmit = function(e){
	var dataSrc = e.srcElement, formuDat = "{";
	formuDat += "\""+dataSrc[0].name+"\""+":"+"\""+dataSrc[0].value+"\""+",";
	formuDat += "\""+dataSrc[1].name+"\""+":"+"\""+dataSrc[1].value+"\""+",";
	formuDat += "\""+dataSrc[2].name+"\""+":"+"\""+dataSrc[2].value+"\""+",";
	formuDat += "\""+dataSrc[3].name+"\""+":"+"\""+dataSrc[3].value+"\""+",";
	formuDat += "\""+dataSrc[4].name+"\""+":"+"\""+dataSrc[4].value+"\"";
	formuDat += "}";
	agregar(JSON.parse(formuDat));
	generarHTML();
	return false;
}
