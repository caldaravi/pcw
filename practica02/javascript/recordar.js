function comprobar(){
  if(window.localStorage){ // Se comprueba si hay soporte para Web Storage
     var frm = document.querySelectorAll("form")[0];
      if(frm.remember.checked){ // Si se ha marcado guardar datos ...
        localStorage.setItem("usuario", frm.usuario.value);
        localStorage.setItem("password", frm.password.value); // modo alternativo
      }
  }
}

function rellenar(){ // Se comprueba si hay soporte para Web Storage
  if(window.localStorage){
    var frm = document.querySelectorAll("form")[0];
    if(localStorage.getItem("usuario")){ // Si hay datos en loginStorage ...
      frm.usuario.value = localStorage.getItem("usuario");
      frm.password.value = localStorage.password; // modo alternativo
      frm.remember.checked = true;
    }
  }
}
