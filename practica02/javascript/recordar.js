function rellenar(){ // Se comprueba si hay soporte para Web Storage
  if(window.localStorage){
    var frm = document.querySelectorAll("form")[0];
    if(localStorage.getItem("usuario")){ // Si hay datos en loginStorage ...
      frm.usuario.value = sessionStorage.getItem("usuario");
      frm.password.value = sessionStorage.password; // modo alternativo
      frm.remember.checked = true;
    }
  }
}
