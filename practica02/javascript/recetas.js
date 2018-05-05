function getRecetas()
{
  url = 'rest/receta/?u=6';

  var logged = false;
  if(sessionStorage.getItem('usuario') != null){
    logged = true;
  }

  fetch(url)
  .then(
    function( response ){
      if(response.status !== 200){

      }
      response.json().then(function(data){
        //console.log(data);

    var cont = document.getElementsByTagName("section")[0].children[0];

    var i;
    for(i=0;i<data.FILAS.length;i++)
    {
      cont.innerHTML += escribeReceta(data,i,logged);
  }
    paginacion(i,6);

    });
})
.catch(function() {
    // This is where you run code if the server returns any errors

    console.log('ERROR');
});
}

function paginacion(i, results, url_params) {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var url_provi = ""

  // Select actual page:
  var pag = url.searchParams.get("pag");
  pagina = pag;

  // Paginacion
  var total = i;
  let paginas = total / results;
  // Ceil redondea al entero mayor (si hay 13 resultados, 13/6 = 2,... habrán 3 páginas)
  paginas = Math.ceil(paginas);

  var docu = document.getElementsByClassName("pagination");
  if(pagina == null){
    // no viene por URL la pagina
    pagina = 0;
  }

  if(paginas == 1){
    docu[0].innerHTML =
    `
    <p>
    Página ` + eval(pagina+1) + ` de ` + paginas + `
    </p>
    `;
  }
  else {
    if(pagina == 0){
      docu[0].innerHTML =
      `
      <p>Página ` + eval(pagina+1) + ` de ` + paginas + `
      <a href="buscar.html?` + url_params + `&pag=` + (eval(pagina+1)) +`&lpag=4">&gt</a>
      </p>
      `;
    }
    else if(pagina == eval(paginas-1)){
      docu[0].innerHTML =
      `
      <p>
      <a href="buscar.html?` + url_params + `&pag=` + (eval(pagina-1)) +`&lpag=4">&lt</a>
      Página ` + ( parseInt(pagina)+1 ) + ` de ` + paginas + `
      </p>
      `;
    }
    else {
      docu[0].innerHTML =
      `
      <p>
      <a href="buscar.html?` + url_params + `&pag=` + (eval(pagina-1)) +`&lpag=4">&gt</a>
      Página ` + ( parseInt(pagina)+1 ) + ` de ` + paginas + `
      <a href="buscar.html?` + url_params + `&pag=` + (eval(pagina+1)) +`&lpag=4">&gt</a>
      </p>
      `;
    }
  }

}

function build_params(data) {
  let ret = [];
  for (let pos in data){
    ret.push(encodeURIComponent(pos) + "=" + encodeURIComponent(data[pos]));
  }
  return ret.join('&');
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
              <p></a> ` + search.FILAS[i].positivos + ` likes</p>
              <p><span class="icon-comment"></span> ` + search.FILAS[i].comentarios + ` comentarios</p>
            </div>
            <div>
              <p></a> ` + search.FILAS[i].negativos + ` dislikes</p>
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
              <p> ` + search.FILAS[i].positivos + ` likes</p>
              <p><span class="icon-comment"></span> ` + search.FILAS[i].comentarios + ` comentarios</p>
            </div>
            <div>
              <p> ` + search.FILAS[i].negativos + ` dislikes</p>
          <p><time datetime="` + search.FILAS[i].fecha + `">` + search.FILAS[i].fecha + `</time></p>
            </div>
          </div>
        </footer>
      </article>
    `;
  }

  return texto;
}
