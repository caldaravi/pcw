function check(form) {
  let fd = new FormData(form),
  xhr = new XMLHttpRequest(),
  url = 'rest/usuario/';

  xhr.open('POST', url, true);

  xhr.onload = function(){
  	console.log(xhr.responseText);
  	let r = JSON.parse(xhr.responseText);

  	if(r.RESULTADO=='OK'){
        //document.getElementById("usuarioStatus").innerHTML = "Usuario disponible";
        document.getElementById("registroForm").reset();
        document.getElementById('id01').style.display='block';

  		console.log(r);
    } else {
    	 console.log('ERROR');
       var pass = document.getElementById("contrasenaDistinta") ;
       var user = document.getElementById("usuarioStatus");
       user = "";
       pass.innerHTML = "";
        if(r.CODIGO==400){
          if(r.DESCRIPCION=='Login no válido'){
            user.innerHTML  = "Usuario incorrecto";
            user.style.color = "#4BB543";
          } else {
            user.innerHTML  = "Usuario NO disponible";
            user.style.color = "#B22222";
          }
        } else {
          if(r.CODIGO==401){
            pass.innerHTML = "Las contraseñas NO coinciden";
            pass.style.color = "#B22222";
          }
          else{
            pass.innerHTML = "Las contraseñas coinciden";
            pass.style.color = "#4BB543";
          }
        }
    }
  }
  xhr.send(fd);

  return false;
}

function checkUser(value){
  let xhr = new XMLHttpRequest(),
  url = 'rest/login/' + value;

  xhr.open('GET', url, true);

  xhr.onload = function(){
    console.log(xhr.responseText);
    let r = JSON.parse(xhr.responseText);

    if(r.RESULTADO=='OK'){
      var texto = document.getElementById("usuarioStatus");
      console.log(texto);
        if(r.DISPONIBLE){
          texto.innerHTML = "Usuario disponible";
          texto.style.color = "#4BB543";
        } else {
          texto.innerHTML = "Usuario NO disponible";
          texto.style.color = "#B22222";

        }

      console.log(r);
    } else {
      document.getElementById("usuarioStatus").innerHTML = "";
    }
  }

  xhr.send();

  return false;
}
