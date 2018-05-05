function dejarComentario(frm)
{
	var url_string = window.location.href;
	var url_str = new URL(url_string);
	var id = url_str.searchParams.get("id");

	let fd = new FormData(),
  xhr = new XMLHttpRequest(),
	url = 'rest/receta/' + id + '/comentario';

  if(!sessionStorage.getItem('usuario')) return false;

	var usu = JSON.parse(sessionStorage.getItem('usuario'));
	fd.append('l', usu.login );
	fd.append('titulo', frm.titulo_coment.value);
	fd.append('texto', frm.comentario.value);

	xhr.open('POST', url, true);

  xhr.onload = function(){

		 let r = JSON.parse(xhr.responseText);

		 if(r.RESULTADO == "OK"){
			 var form = document.getElementById("form_comentario").reset();

			 // cargar coments

			 mostrarModalComt("04")

		 } else {
			 mostrarModalComt("01");
		 }
  }
	xhr.setRequestHeader('Authorization', usu.clave);
  xhr.send(fd);

	return false;

}

function loadHTML(url){
  let xhr = new XMLHttpRequest(),
  fd  = new FormData();

  xhr.open('POST', url, true);
  xhr.onload = function(){
		var div = document.getElementById("displayed");
	  div.innerHTML += xhr.responseText;

  }
  xhr.send(fd);

	// Escondemos boton de dejar comentario
	hidebtn();

}

function mostrarModalComt(num){
  var modal = document.getElementById('id'+num);
  var span = document.getElementsByClassName("close")[num-1];
  modal.style.display='block';

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
		if(num == "01"){
			var form = document.getElementById("titulo_coment").focus();
		}
		else if(num == '04'){
			// Cargamos Comentarios
			var url = new URL(window.location.href);
			getComentarios(url.searchParams.get("id"));
		}
	}

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
         modal.style.display = "none";
				 if(num == "01"){
				 	var form = document.getElementById("titulo_coment").focus();
				}
				else if(num == '04'){
					// Cargamos Comentarios
					var url = new URL(window.location.href);
					getComentarios(url.searchParams.get("id"));
				}
    }
  }
}
