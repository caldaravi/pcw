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
       document.getElementById("contrasenaDistinta").innerHTML = "";
       document.getElementById("usuarioStatus").innerHTML = "";
        if(r.CODIGO==400){
          if(r.DESCRIPCION=='Login no válido'){
            document.getElementById("usuarioStatus").innerHTML = "Usuario incorrecto";
          } else {
            document.getElementById("usuarioStatus").innerHTML = "Usuario NO disponible";
          }
        } else {
          if(r.CODIGO==401){
            document.getElementById("contrasenaDistinta").innerHTML = "Las contraseñas no coinciden";
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
        if(r.DISPONIBLE){
          document.getElementById("usuarioStatus").innerHTML = "Usuario disponible";
        } else {
          document.getElementById("usuarioStatus").innerHTML = "Usuario NO disponible";
        }

      console.log(r);
    } else {
      document.getElementById("usuarioStatus").innerHTML = "";
    }
  }

  xhr.send();

  return false;
}
