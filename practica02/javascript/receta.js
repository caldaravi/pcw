var rutas=[];
var contador = 0;
function compruebaid(){
  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("id");
  if(id!=undefined)
  {
    // Receta.html tiene un id pasado por GET -> se rellenan los datos
    // GET del API rest
    var url_inf = 'rest/receta/'+id;
    var inf_data = null;
    fetch(url_inf)
      .then(
        function(response){
          if(response.status !== 200){
            console.log("No se ha podido realizar la peticion GET correctamente.");
          }
          response.json().then(function(data) {

            inf_data = data.FILAS[0];
            if(inf_data === undefined )
            {
              window.location.replace("index.html");

            }
            //console.log(inf_data);

            // Si ha ido OK -> GET de fotos de esa receta
            var url_fotos = 'rest/receta/'+id+'/fotos';
            var fotos_data = null;
            fetch(url_fotos)
              .then(
                function( fotos_resp ){
                  if( fotos_resp.status !== 200){
                    console.log("Error STATUS GET fotos con id.");
                  }
                  fotos_resp.json().then( function(fotos) {

                    fotos_data = fotos.FILAS;
                    //console.log(fotos_data);

                    // Si ha ido OK -> GET de comentarios
                    var url_coments = 'rest/receta/'+id+'/comentarios';
                    var coments_data = null;
                    fetch(url_coments)
                      .then(
                        function( coments_resp ){
                          if(coments_resp.status !== 200){
                            console.log("Error STATUS GET comentarios.");
                          }
                          coments_resp.json().then( function( comentarios ){
                              //console.log(comentarios);

                              coments_data = comentarios.FILAS;
                              //console.log(coments_data);

                              // Si todo OK -> GET de ingredientes
                              var url_ingredientes = 'rest/receta/'+id+'/ingredientes';
                              var ingredientes_data = null;
                              fetch(url_ingredientes)
                              .then(
                                function( ingredientes_resp ) {
                                  if( ingredientes_resp.status !== 200){
                                    console.log("Error STATUS GET ingredientes ");
                                  }
                                  ingredientes_resp.json().then( function( ingredientes ){

                                    // =====================================
                                    // SI TODOS LOS GETS ANTERIORES HAN IDO BIEN
                                    // =====================================
                                    ingredientes_data = ingredientes.FILAS;
                                      // Obtenemos elementos del HTML

                                      let titulo = document.getElementById("titulo");
                                      let comensales = document.getElementById("comensales");
                                      let autor = document.getElementById("autor");
                                      let tiempo = document.getElementById("tiempo");
                                      let nivel = document.getElementById("nivel");
                                      let elabora = document.getElementById("elaboracion");
                                      let like = document.getElementById("valoraciones").children[1];
                                      let dislike = document.getElementById("valoraciones").children[3];
                                      let ing_ul = document.getElementById("ingredientes");
                                      let foto = comensales.nextSibling.nextSibling;
                                      let time = document.getElementsByTagName("time")[0];

                                      foto.src='fotos/'+fotos_data[0].fichero;
                                      foto.alt=fotos_data[0].texto;

                                      titulo.innerHTML += inf_data.nombre;
                                      comensales.innerHTML += inf_data.comensales + ' comensales';
                                      autor.innerHTML += inf_data.autor;
                                      autor.href += '?a=' + inf_data.autor;
                                      tiempo.innerHTML += inf_data.tiempo;
                                      nivel.innerHTML += inf_data.dificultad;
                                      elabora.innerHTML += inf_data.elaboracion;
                                      like.innerHTML += inf_data.positivos;
                                      dislike.innerHTML += inf_data.negativos;
                                      time.datetime = inf_data.fecha;
                                      time.innerHTML += inf_data.fecha;

                                      for(var ing in ingredientes_data)
                                      {
                                        ing_ul.innerHTML += '<li>' + ingredientes_data[ing].nombre + '</li>';
                                      }

                                      rutas = fotos_data;

                                      // Comentarios
                                      console.log(coments_data);
                                      let plantilla = document.getElementById("comentarios").children[1];
                                      for(var i = 0; i < coments_data.length; i++)
                                      {
                                        plantilla.innerHTML +=
                                        `
                                        <div>
                                  				<p><span class="icon-user"></span> <strong>` + coments_data[i].autor + `</strong> dice:</p>
                                  				<p><strong>` + coments_data[i].titulo + `</strong></p>
                                  				<p>` + coments_data[i].texto + `</p>
                                  				<time datetime="` + coments_data[i].fecha + `">` + coments_data[i].fecha + `</time>
                                  			</div>
                                        `;
                                      }
                                      let noreg = document.getElementById("comentarios").children[2];

                                      if(sessionStorage.getItem('usuario') != null){
                                            noreg.innerHTML +=
                                            `
                                            <button type="BUTTON"
                                                       ONCLICK="loadWholePage('comenta.html')">
                                                       Deja tu comentario!
                                            </button>
                                            `
                                            }
                                             else {
                                              noreg.innerHTML +=
                                              `
                                              <div id="comenta" class="card">
                                                <h4>Para dejar un comentario debes iniciar sesión</h4>
                                              </div>
                                              `
                                            }

                                  });
                                }
                              )
                              .catch( function(err){
                                  console.log("Error GET Ingredientes.", err);
                              })
                          });
                        }
                      )
                      .catch( function(err){
                        console.log("Error GET Comentarios.", err);
                      })
                  });
                }
              )
              .catch( function(err){
                console.log("Error en GET de fotos", err);
              })
          });
        }
      )
      .catch(function(err){
        console.log("Error en GET id receta", err);
      });
  }

}

function pasapagina(num)
{
  var doc = document.getElementById("comensales").nextSibling.nextSibling;
  contador += num;
  if(contador < 0 ){
    contador = rutas.length -1;
  }
  else if( contador == rutas.length){
    contador = 0;
  }
  console.log(contador);
  console.log(rutas[contador].fichero);
  doc.src='fotos/'+rutas[contador].fichero;

}
