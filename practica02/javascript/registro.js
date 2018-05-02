function check(form) {
  let fd = new FormData(form),
  xhr = new XMLHttpRequest(),
  url = 'rest/usuario/';

  xhr.open('POST', url, true);

  xhr.onload = function(){
  	console.log(xhr.responseText);
  	let r = JSON.parse(xhr.responseText);

  	if(r.RESULTADO=='OK'){
        document.getElementById("registroForm").reset();
        var modal = document.getElementById('id01');
        var span = document.getElementsByClassName("close")[0];
        modal.style.display='block';
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
           modal.style.display = "none";
           window.location.href = "/pcw/practica02/login.html";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
               modal.style.display = "none";
               window.location.href = "/pcw/practica02/login.html";
          }
        }

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
    let r = JSON.parse(xhr.responseText);

    if(r.RESULTADO=='OK'){
      var texto = document.getElementById("usuarioStatus");
        if(r.DISPONIBLE){
          texto.innerHTML = "Usuario disponible";
          texto.style.color = "#4BB543";
        } else {
          texto.innerHTML = "Usuario NO disponible";
          texto.style.color = "#B22222";
        }
    } else {
      document.getElementById("usuarioStatus").innerHTML = "";
    }
  }

  xhr.send();

  return false;
}

function checkKey(e){
  if (e.which == 32)
    return false;
}

function noSpace(){
  var str = document.getElementById("nickname").value;
  var res = str.replace(/\s/g, "");
  document.getElementById("nickname").value = res;
}
