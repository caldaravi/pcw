
function check() {
  var url_string = window.location.href;
  var url = new URL(url_string);

  var logged = false;
  if(sessionStorage.getItem('usuario') != null){
    logged = true;
  }

  var params = url_string.split('?')[1];

  // Si la URL tiene parametros -> fetch con esos params
  if( url_string.split('?')[1] != undefined ){
    // Calcular paginacion para busqueda rapida
    var pag = url.searchParams.get("pag");
    var pag_txt = '';
    if(pag === null ){
      pag = 0; pag_txt = "&pag=" + pag + "&lpag=4";
    }
    params = params.replace('&submit=Enviar','');
    var link = "rest/receta/?" + params + pag_txt;
    console.log("hago fetch con: " + link);

    // Abrir formulario y rellenarlo con datos de la URL
    document.getElementById("busqueda_ext").checked = true;
    var i = url.searchParams.get("i");
    var t = url.searchParams.get("t"); // texto
    var di = url.searchParams.get("di");
    var df = url.searchParams.get("df");
    var d = url.searchParams.get("d");
    var c = url.searchParams.get("c");
    var a = url.searchParams.get("a");
    if(i != null){
      document.getElementById("ingredientes").value = i;
    }
    if(t != null){
      document.getElementById("titulo").value = t;
      console.log("busqueda es " + t);
    }
    if(di != null){
      document.getElementById("tiempomin").value = di;
    }
    if(df != null){
      document.getElementById("tiempomax").value = df;
    }
    if(d != null){
      document.getElementById("dificultad").value = d;
    }
    if(c != null){
      document.getElementById("comensales").value = c;
    }
    if(a != null){
      document.getElementById("autor").value = a;
    }
    fetch(link)
    .then(function(response){
      if(response.status !== 200){
        console.log("Error status fetch");
      }
      response.json().then(function(data){
        // Si el JSON es OK
        var docu = document.getElementsByTagName("section")[0].children[0];
        var paginas = data.TOTAL_COINCIDENCIAS;

        if(data.FILAS.length>0){
          for (var i = 0; i < data.FILAS.length; i++) {
            docu.innerHTML += escribeReceta(data, i, logged);
          }
        }
        else{
          // No ha habido resultados con esa busqueda
          docu.innerHTML +=
          `
          <article class="card">
            <p style="text-align: center">No se han encontrado resultados.</p>
          </article>
          `;
          paginas = undefined;
        }
        // Paginacion
        if(paginas == undefined ){
          paginas = 1;
        }
        var url_pag = url.searchParams.get("pag");
        console.log("url_pag = " + url_pag);

        if( url_pag !== null && url_pag !== undefined && url_pag !== '' ){
          params = params.slice(0,-13);
          console.log("existe pagina en URL -> BORRO datos pag");
          console.log("url_pag = " + url_pag);
        }
        console.log("paginacion concatenará "+params);
        paginacion(paginas,4,params);
      });
    })
    .catch()
  }
  else{
    // Si no -> getRecetas()
    getRecetas();
  }
}

function comprobarDatos(frm) {
  var logged = false;
  if(sessionStorage.getItem('usuario') != null){
    logged = true;
  }

  var link = "rest/receta/?";

  params = [];
  if(frm.busqueda.value != ''){
    params.t = frm.busqueda.value.replace(/\s+/g, ',');
  }
  if(frm.ingredientes.value != ''){
    params.i = frm.ingredientes.value.replace(/\s+/g, ',');
  }
  if(frm.tiempomin.value != ''){
    params.di = frm.tiempomin.value;
  }
  if(frm.tiempomax.value != ''){
    params.df = frm.tiempomax.value;
  }
  if(frm.dificultad.value != '-1'){
    params.d = frm.dificultad.value;
  }
  if(frm.comensales.value != ''){
    params.c = frm.comensales.value;
  }
  if(frm.autor.value != ''){
    params.a = frm.autor.value;
  }

  params.pag = 0;
  params.lpag = 4;

  var url_params = build_params(params).replace(/\%2C/g,',');
  console.log("pre-fect params: " + url_params);
  link += url_params;
  console.log("HACE fetch: " + link);
  fetch(link)
  .then(function(response){
    if(response.status !== 200){
      console.log("Error fetch usuario en comprobar datos.");
    }
    response.json().then(function(search){
      var docu = document.getElementsByTagName("section")[0].children[0];
      var paginar;
      var i = 0;
      docu.innerHTML = '';
      if(search.FILAS.length>0){
        for(i=0;i<search.FILAS.length;i++){
          docu.innerHTML += escribeReceta(search, i, logged);
        }
        paginar = search.TOTAL_COINCIDENCIAS;
      }
      else{
        docu.innerHTML +=
        `
        <article class="card">
          <p style="text-align: center">No se han encontrado resultados.</p>
        </article>
        `;
        paginar = 1;
      }

      // paginacion

      console.log("busqueda avanzada: paginacion concatenará " + url_params.slice(0,-13));
      // controlar paginas BIEN
      paginacion(paginar,4, url_params.slice(0,-13));

});
  })
  .catch(function(err){
    console.log(err);
  });

  // form se queda sin recargar la pagina
  return false;
}
