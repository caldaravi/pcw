function compruebaUsuario() {
  // Comprobar tipo de busqueda
  var url_string = window.location.href;
  var url = new URL(url_string);
  var user = url.searchParams.get("u");
  var submit = url.searchParams.get("submit");
  var pagina = url.searchParams.get("pag");
  if( user != undefined )
  {
    // Si hay usuario en la URL se realiza la consulta
    console.log("Usuario activo: ");
    console.log(user);
    var url_u = "rest/receta/?a="+user;
    fetch( url_u )
    .then(
      function(response){
        if( response.status !== 200 )
        {
          console.log("Error fetch usuario en buscar.");
        }
        response.json().then( function(data){
          console.log("data: ");
          console.log(data);
          // Si el JSON es OK

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

        if(typeof(titulo) != "undefined" && titulo !== null && titulo != "" ){
          params.t = titulo.replace(/\s+/g, ',');
        }

        if(typeof(ingredientes) != "undefined" && ingredientes !== null && ingredientes != "" ){
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
              paginacion(search.TOTAL_COINCIDENCIAS,4);
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

function build_params(data) {
  let ret = [];
  for (let pos in data){
    ret.push(encodeURIComponent(pos) + "=" + encodeURIComponent(data[pos]));
  }
  return ret.join('&');
}
