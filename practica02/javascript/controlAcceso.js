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
  var no_reg = [];
  no_reg.push({a: "index.html", icon: "home", text: "Inicio"});
  no_reg.push({a: "buscar.html", icon: "search", text: "Buscar"});
  no_reg.push({a: "login.html", icon: "login", text: "Login"});
  no_reg.push({a: "registro.html", icon: "registro", text: "Regístrate"});

  var menu = [];
  menu.push({a: "index.html", icon: "home", text: "Inicio"});
  menu.push({a: "buscar.html", icon: "search", text: "Buscar"});
  menu.push({a: "nuevareceta.html", icon: "list-add", text: "Nueva receta"});
  menu.push({a: "index.html", icon: "logout", text: "Logout"});

  var ul = document.getElementsByTagName('nav')[0].children[0];

/*
  // Paginacion persistente (varia en funcion de esto y no de url)
  if(sessionStorage.getItem("busqueda_avanzada") != '' && sessionStorage.getItem("busqueda_avanzada") != null){
    if(window.location.href.split('?')[0] != "http://localhost/pcw/practica02/buscar.html")
    {
      sessionStorage.removeItem("busqueda_avanzada");
      console.log("busqueda avanzada borrada");
    }
  }*/

  if(sessionStorage.getItem('usuario') != null){
    // Hay Usuario
    var i;
    for(i=0; i<menu.length; i++)
    {
      ul.innerHTML +=
      `
      <li>
        <a href="` + menu[i].a + `">
          <span class="icon-` + menu[i].icon + `" aria-hidden="true"></span>
          <span>` + menu[i].text +`</span>
        </a>
      </li>
      `
    }
    // Se añade el logout onclick
    var li_logout = ul.children[i];
    //  li_logout.onclick = logout();
    li_logout.addEventListener('click', logout, true);
    //console.log(li_logout);

  } else {
    for(var i=0; i<menu.length; i++)
    {
      ul.innerHTML +=
      `
      <li>
        <a href="` + no_reg[i].a + `">
          <span class="icon-` + no_reg[i].icon + `" aria-hidden="true"></span>
          <span>` + no_reg[i].text +`</span>
        </a>
      </li>
      `
    }
  }
}

function logout(){
  console.log("fuera");
  sessionStorage.removeItem('usuario');
  sessionStorage.removeItem('password');
}
