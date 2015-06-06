var mostrarMensajeNuevaEntradaKardex = function(msj){
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
}