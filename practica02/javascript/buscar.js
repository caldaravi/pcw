
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
  if(frm.dificultad.value != ''){
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

function escribeReceta(search, i, log){
  var texto = '';
  if(log == true){
    // Registrado -> incluye enlaces mg / nomg
    texto = `
    <article class="card">
        <a href="receta.html?id=` + search.FILAS[i].id + `"><h3>` + search.FILAS[i].nombre + `</h3></a>
        <img src="fotos/` + search.FILAS[i].fichero + `" alt="` + search.FILAS[i].descripcion_foto + `">
        <p>` + search.FILAS[i].descripcion_foto + `</p>
        <div>
          <span class="icon-user" aria-hidden="true"></span><a href=buscar.html?a=` + search.FILAS[i].autor + `>` + search.FILAS[i].autor + `</a></h4>
        </div>
        <footer>
          <div>
            <div>
              <p><a href=""><span class="icon-thumbs-up"></span></a> ` + search.FILAS[i].positivos + ` likes</p>
              <p><span class="icon-comment"></span> ` + search.FILAS[i].comentarios + ` comentarios</p>
            </div>
            <div>
              <p><a href=""><span class="icon-thumbs-down"></span></a> ` + search.FILAS[i].negativos + ` dislikes</p>
              <p><time datetime="` + search.FILAS[i].fecha + `">` + search.FILAS[i].fecha + `</time></p>
            </div>
          </div>
        </footer>
      </article>
    `
  }
  else{
    // No registrado -> NO incluye enlaces mg / nomg
    texto = `
    <article class="card">
        <a href="receta.html?id=` + search.FILAS[i].id + `"><h3>` + search.FILAS[i].nombre + `</h3></a>
        <img src="fotos/` + search.FILAS[i].fichero + `" alt="` + search.FILAS[i].descripcion_foto + `">
        <p>` + search.FILAS[i].descripcion_foto + `</p>
        <div>
          <span class="icon-user" aria-hidden="true"></span><a href=buscar.html?a=` + search.FILAS[i].autor + `>` + search.FILAS[i].autor + `</a></h4>
        </div>
        <footer>
          <div>
            <div>
              <p><span class="icon-thumbs-up"></span> ` + search.FILAS[i].positivos + ` likes</p>
              <p><span class="icon-comment"></span> ` + search.FILAS[i].comentarios + ` comentarios</p>
            </div>
            <div>
              <p><span class="icon-thumbs-down"></span> ` + search.FILAS[i].negativos + ` dislikes</p>
          <p><time datetime="` + search.FILAS[i].fecha + `">` + search.FILAS[i].fecha + `</time></p>
            </div>
          </div>
        </footer>
      </article>
    `;
  }

  return texto;
}

// Backup
function compruebaUsuario() {
  // Comprobar tipo de busqueda
  var url_string = window.location.href;
  var url = new URL(url_string);
  var user = url.searchParams.get("a");
  var submit = url.searchParams.get("submit");
  var pagina = url.searchParams.get("pag");
  if( user != undefined )
  {
    // Si hay usuario en la URL se realiza la consulta para ese usuario

    var url_u = "rest/receta/?a="+user;
    fetch( url_u )
    .then(
      function(response){
        if( response.status !== 200 )
        {
          console.log("Error fetch usuario en buscar.");
        }
        response.json().then( function(data){
          // Si el JSON es OK
          console.log("busco por usuario introducido en URL");

          var docu = document.getElementsByTagName("section")[0].children[0];
          for (var i = 0; i < data.FILAS.length; i++) {
            docu.innerHTML +=
            `
            <article class="card">
                <a href="receta.html?id=` + data.FILAS[i].id + `"><h3>` + data.FILAS[i].nombre + `</h3></a>
                <img src="fotos/` + data.FILAS[i].fichero + `" alt="` + data.FILAS[i].descripcion_foto + `">
                <p>` + data.FILAS[i].descripcion_foto + `</p>
                <div>
                  <span class="icon-user" aria-hidden="true"></span><a href=buscar.html?u=` + data.FILAS[i].autor + `>` + data.FILAS[i].autor + `</a></h4>
                </div>
                <footer>
                  <div>
                    <div>
                      <p><a href=""><span class="icon-thumbs-up"></span></a> ` + data.FILAS[i].positivos + ` likes</p>
                      <p><span class="icon-comment"></span> ` + data.FILAS[i].comentarios + ` comentarios</p>
                    </div>
                    <div>
                      <p><a href=""><span class="icon-thumbs-down"></span></a> ` + data.FILAS[i].negativos + ` dislikes</p>
                  <p><time datetime="` + data.FILAS[i].fecha + `">` + data.FILAS[i].fecha + `</time></p>
                    </div>
                  </div>
                </footer>
              </article>
            `
          }
        });
      })
    .catch( function( err ) {

    })

  }
  else if( (submit != undefined) || (typeof(pagina) != "undefined" && pagina !== null) )
  {
    // Si usuario ha rellenado formulario O pagina
    var titulo = url.searchParams.get("busqueda");
    console.log("titulo: ");
    console.log(titulo);
    var ingredientes = url.searchParams.get("ingredientes");
    console.log("ingredientes: ");
    console.log(ingredientes);
    var tmin = url.searchParams.get("tiempomin");
    console.log("tmin: ");
    console.log(tmin);
    var tmax = url.searchParams.get("tiempomax");
    console.log("tmax: ");
    console.log(tmax);
    var dificultad = url.searchParams.get("dificultad");
    console.log("difi: ");
    console.log(dificultad);
    var comensales = url.searchParams.get("comensales");
    console.log("comensales: ");
    console.log(comensales);
    var autor = url.searchParams.get("autor");
    console.log("autor: ");
    console.log(autor);
    if( ( submit=="Buscar" && titulo=="" && ingredientes=="" && tmin=="" && tmax=="" && dificultad=="" && comensales=="" && autor=="" ) )
    {
      // Usuario no ha introducido ningun valor en la busqueda
      getRecetas();
    }
    else {
      // Si introduce cualquier otra cosa -> realizar busqueda
      var link = "rest/receta/?";
      // Si ha realizado una busqueda

        var params = [];

        if(typeof(titulo) != "undefined" && titulo !== null && titulo !== "" ){
          params.t = titulo.replace(/\s+/g, ',');
        }

        if(typeof(ingredientes) != "undefined" && ingredientes !== null && ingredientes !== "" ){
          params.i = ingredientes.replace(/\s+/g, ',');
        }

        if(typeof(tmin) != "undefined" && tmin !== null && tmin != "" ){
          params.di = tmin;
        }

        if(typeof(tmax) != "undefined" && tmax !== null && tmax != "" ){
          params.df = tmax;
        }

        if(typeof(dificultad) != "undefined" && dificultad !== null && dificultad != "" ){
          params.d = dificultad;
        }

        if(typeof(comensales) != "undefined" && comensales !== null && comensales != "" ){
          params.c = comensales;
        }

        if(typeof(autor) != "undefined" && autor !== null && autor != "" ){
          params.a = autor;
        }

        params.pag = 0;
        params.lpag = 4;
        if(typeof(pagina) != "undefined" && pagina !== null){
          params.pag = pagina;
          var records = url.searchParams.get("lpag");
          if(typeof(records) != "undefined" && records !== null){
            params.lpag = records;
          }
        }

        var url_params = build_params(params).replace(/\%2C/g,',');
        link += url_params;
        console.log("params:");
        console.log(url_params);
        console.log("link:");
        console.log(link);

        fetch(link)
        .then( function(response){
          if(response.status !== 200){
            console.log("Error status");
          }
          response.json().then(function( search ) {
            console.log("search: ");
            console.log(search);

            var cont = document.getElementsByTagName("section")[0].children[0];

            if(search.FILAS.length > 0){

              // Muestra infor

              var i;
              for(i=0;i<4;i++)
              {
                cont.innerHTML +=
                `
                <article class="card">
                <a href="receta.html?id=` + search.FILAS[i].id + `"><h3>` + search.FILAS[i].nombre + `</h3></a>
                <img src="fotos/` + search.FILAS[i].fichero + `" alt="` + search.FILAS[i].nombre + `">
                <p>`+ search.FILAS[i].descripcion_foto + `</p>
                <div>
                  <span class="icon-user" aria-hidden="true"></span><a href=buscar.html?u=` + search.FILAS[i].autor + `>` + search.FILAS[i].autor + `</a></h4>
                </div>
                <footer>
                  <div>
                    <div>
                      <p><a href=""><span class="icon-thumbs-up"></span></a> ` + search.FILAS[i].positivos + ` likes</p>
                      <p><span class="icon-comment"></span> ` + search.FILAS[i].comentarios + ` comentarios</p>
                    </div>
                    <div>
                      <p><a href=""><span class="icon-thumbs-down"></span></a>` + search.FILAS[i].negativos + ` dislikes</p>
                  <p><time datetime="` + search.FILAS[i].fecha + `">` + search.FILAS[i].fecha + `</time></p>
                    </div>
                  </div>
                </footer>
                </article>
                `;

              }
              // paginacion
              console.log("tot:");
              console.log(search.TOTAL_COINCIDENCIAS);
              paginacion(search.TOTAL_COINCIDENCIAS,4, url_params);
            }
            else{
              // No resultados
              cont.innerHTML +=
              `
              <article class="card">
              <p>No se han encontrado resultados.</p>
              </article>
              `;
            }
          })
        })
        .catch( function(err){
          console.log("Error catch", err);
        });

    }


  }
  else
  {
    // Si ha entrado en buscar.html sin parametros ni nada
    getRecetas();
    console.log("pagina: ");
    console.log(pagina);
  }
}
