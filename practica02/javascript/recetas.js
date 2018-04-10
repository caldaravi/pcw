function getRecetas()
{
  url = 'rest/receta/?u=6';

  fetch(url)
  .then(
    function( response ){
      if(response.status !== 200){

      }
      response.json().then(function(data){
        //console.log(data);

    var cont = document.querySelectorAll("article");

    var i;
    for(i=0;i<data.FILAS.length;i++)
    {
      cont[i].innerHTML +=
      `
      <a href="receta.html?id=` + data.FILAS[i].id + `"><h3>` + data.FILAS[i].nombre + `</h3></a>
      <img src="fotos/` + data.FILAS[i].fichero + `" alt="` + data.FILAS[i].nombre + `">
      <p>`+ data.FILAS[i].descripcion_foto + `</p>
      <div>
        <span class="icon-user" aria-hidden="true"></span><a href=buscar.html?="` + data.FILAS[i].autor + `">` + data.FILAS[i].autor + `</a></h4>
      </div>
      <footer>
        <div>
          <div>
            <p><a href=""><span class="icon-thumbs-up"></span></a> ` + data.FILAS[i].positivos + ` likes</p>
            <p><span class="icon-comment"></span> ` + data.FILAS[i].comentarios + ` comentarios</p>
          </div>
          <div>
            <p><a href=""><span class="icon-thumbs-down"></span></a>` + data.FILAS[i].negativos + ` dislikes</p>
        <p><time datetime="` + data.FILAS[i].fecha + `">` + data.FILAS[i].fecha + `</time></p>
          </div>
        </div>
      </footer>
      `;
      console.log(cont[i]);
    }

    // Paginacion
    var total = cont.length;
    let paginas = total / 6;
      // Ceil redondea al entero mayor (si hay 13 resultados, 13/6 = 2,... habrán 3 páginas)
    paginas = Math.ceil(paginas);
    var docu = document.getElementsByClassName("pagination");
    if(paginas == 1 )
    {
        docu[0].innerHTML +=
        `
        <a href="#">1</a>
        `;
    }
    else {
      docu[0].innerHTML += '<a href="#">&laquo;</a>';
      for(var i = 1; i<=paginas; i++)
      {
        docu[0].innerHTML += '<a href="#">' + i + '</a>';
      }
      docu[0].innerHTML += '<a href="#">&raquo;</a>';
    }
    console.log(paginas);


    });
})
.catch(function() {
    // This is where you run code if the server returns any errors

    console.log('ERROR');
});
}
