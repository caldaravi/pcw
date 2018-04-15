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


                              // =====================================
                              // SI TODOS LOS GETS DE ANTES HAN IDO BIEN
                              // =====================================


                                          // Obtenemos elementos del HTML
                                          // Calculamos string comentarios:
                                          var txt = " ";
                                          for( var i = 0; i < coments_data.length; i++ ){
                                            txt +=
                                            `
                                              <div>
                                                <p><span class="icon-user"></span> <a href="buscar.html?a=` + coments_data[i].autor + `"><strong>` + coments_data[i].autor + `</strong></a> dice:</p>
                                                <p><strong>` + coments_data[i].titulo + `</strong></p>
                                                <p>` + coments_data[i].texto + `</p>
                                                <time datetime="` + coments_data[i].fecha + `">` + coments_data[i].fecha + `</time>

                                              </div>
                                              <hr>
                                            `;
                                          }
                                          let docu = document.getElementById("receta");
                                          if(sessionStorage.getItem('usuario') != null){
                                            docu.innerHTML +=
                                            `
                                            <article class="card">
                                            <div>

                                              <div>
                                                <h3>` + inf_data.nombre + `</h3>
                                                  <p>` + inf_data.comensales + `s</p>
                                                  <img src="fotos/` + inf_data.fichero + `" alt="` + inf_data.descripcion_foto + `">
                                                  <a href="">&lt;</a>
                                                  <a href="">&gt;</a>
                                              </div>

                                              <div>
                                                <div>
                                                  <h4><span class="icon-user" aria-hidden="true"></span><a href="buscar.html?a=` + inf_data.autor + `">` + inf_data.autor + `</a></h4>
                                                  <p><span class="icon-clock"></span> ` + inf_data.tiempo + ` min </p>
                                                  <p><span class="icon-star-empty"></span>Nivel: ` + inf_data.dificultad + `</p>
                                                </div>
                                                <div>
                                                  <ul>
                                                    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, exercitationem.</li>
                                                    <li>Architecto cum ab voluptatem maxime, numquam saepe mollitia maiores tempora?</li>
                                                    <li>Sit sed voluptate odio, culpa libero, voluptas optio unde dolores.</li>
                                                    <li>Veniam blanditiis est tenetur enim quisquam doloremque fugiat maxime cupiditate.</li>
                                                    <li>Modi provident odit nisi labore obcaecati libero quos numquam similique.</li>
                                                    <li>Inventore architecto obcaecati suscipit placeat alias atque, laborum odit explicabo.</li>
                                                  </ul>
                                                </div>
                                        				<p>
                                                <a href="">
                                                <span class="icon-thumbs-up"></span>
                                                </a> ` + inf_data.positivos + ` likes<a href="">
                                                <span class="icon-thumbs-down"></span>
                                                </a> ` + inf_data.negativos + ` dislikes
                                                </p>
                                              </div>
                                            </div>
                                            `} else {
                                              docu.innerHTML +=
                                              `
                                              <article class="card">
                                              <div>

                                                <div>
                                                  <h3>` + inf_data.nombre + `</h3>
                                                    <p>` + inf_data.comensales + `s</p>
                                                    <img src="fotos/` + inf_data.fichero + `" alt="` + inf_data.descripcion_foto + `">
                                                    <a href="">&lt;</a>
                                                    <a href="">&gt;</a>
                                                </div>

                                                <div>
                                                  <div>
                                                    <h4><span class="icon-user" aria-hidden="true"></span><a href="buscar.html?a=` + inf_data.autor + `">` + inf_data.autor + `</a></h4>
                                                    <p><span class="icon-clock"></span> ` + inf_data.tiempo + ` min </p>
                                                    <p><span class="icon-star-empty"></span>Nivel: ` + inf_data.dificultad + `</p>
                                                  </div>
                                                  <div>
                                                    <ul>
                                                      <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, exercitationem.</li>
                                                      <li>Architecto cum ab voluptatem maxime, numquam saepe mollitia maiores tempora?</li>
                                                      <li>Sit sed voluptate odio, culpa libero, voluptas optio unde dolores.</li>
                                                      <li>Veniam blanditiis est tenetur enim quisquam doloremque fugiat maxime cupiditate.</li>
                                                      <li>Modi provident odit nisi labore obcaecati libero quos numquam similique.</li>
                                                      <li>Inventore architecto obcaecati suscipit placeat alias atque, laborum odit explicabo.</li>
                                                    </ul>
                                                  </div>
                                          				<p>
                                                   ` + inf_data.positivos + ` likes ` + inf_data.negativos + ` dislikes
                                                  </p>
                                                </div>
                                              </div>
                                            `}docu.innerHTML +=`
                                          <div>
                                            <p>` + inf_data.elaboracion + `</p>
                                            <p><time datetime="` + inf_data.fecha + `">` + inf_data.fecha + `</time></p>
                                          </div>

                                          </article>
                                          <div id="comentarios" class="card">
                                            <h4>Comentarios</h4>
                                          ` + txt + `</div>
                                          `;if(sessionStorage.getItem('usuario') != null){
                                            docu.innerHTML +=`
                                            <FORM name="ajax" method="POST" action="">
                                            	<p><INPUT type="BUTTON"
                                                       value="Deja tu comentario!"
                                                       ONCLICK="loadWholePage('comenta.html')">
                                            	</p>
                                            </FORM>

                                            <div id="displayed">
                                            </div>`


                                            } else {
                                              docu.innerHTML +=`
                                              <div id="comenta" class="card">
                                                <h4>Para dejar un comentario debes iniciar sesión</h4>
                                              </div>
                                              `
                                            }
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
