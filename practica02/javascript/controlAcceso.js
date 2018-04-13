function acceso(){
  if(sessionStorage.getItem('usuario') != null){
    if(location.pathname === "/pcw/practica02/login.html" ||
       location.pathname === "/pcw/practica02/registro.html"){
        window.location.href = "/pcw/practica02/index.html";
        //window.location.replace("/pcw/practica02/index.html"); HACE LO MISMO
    }
  } else {
    if(location.pathname === "/pcw/practica02/nuevareceta.html"){
      window.location.href = "/pcw/practica02/index.html";
    }
  }
}

function control(){
  var logged = document.getElementsByClassName('logged');
  var offline = document.getElementsByClassName('offline');

  if(sessionStorage.getItem('usuario') != null){
    console.log("logueado");
     for(item in logged){
       if(item < logged.length){
        logged[item].style.display='block';
      }
    }
    for(item2 in offline){
      if(item2 < offline.length){
        offline[item2].style.display='none';
      }
    }
  } else {
    console.log("deslogueado");
    for(item in logged){
      if(item < logged.length){
        logged[item].style.display='none';
      }
    }
    for(item2 in offline){
      if(item2 < offline.length){
        offline[item2].style.display='block';
      }
    }
  }
}

function logout(){
  sessionStorage.removeItem('usuario');
  sessionStorage.removeItem('password');
}
