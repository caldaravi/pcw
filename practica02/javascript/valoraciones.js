function like() {
  var url_string = window.location.href,
      url_str = new URL(url_string),
      id = url_str.searchParams.get("id");

  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
	url = 'rest/receta/' + id + '/voto/1',
  usu;

  if(xhr){

    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);

    xhr.open('POST', url, true);
    xhr.onload = function(){
  	   console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

     	 if(r.RESULTADO == "OK"){
         actualiza();
       } else {
         mostrarModal("03");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}

function dislike(){
  var url_string = window.location.href;
  var url_str = new URL(url_string);
  var id = url_str.searchParams.get("id");

  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
	url = 'rest/receta/' + id + '/voto/0',
  usu;

  if(xhr){

    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);

    xhr.open('POST', url, true);
    xhr.onload = function(){
  	   console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

     	 if(r.RESULTADO == "OK"){
         actualiza();
       } else {
         mostrarModal("03");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}
/* CON FETCH
function dislike(){
  var url_string = window.location.href;
  var url_str = new URL(url_string);
  var id = url_str.searchParams.get("id");

  let fd = new FormData();


  let usu = JSON.parse(sessionStorage.getItem('usuario'));

  fd.append('l',usu.login);

  var url = 'rest/receta/' + id + '/voto/0',
      init = {method: 'POST', body:fd, headers: {'Authorization':usu.clave}};


  fetch(url, init).then(function(response){
    response.text().then(function(data){
      console.log(data);
    });
    if(!response.ok){
      console.log(response);
      //document.getElementById('dislikeval').value;
      console.log("fgh");
      actualiza();
    };
  }).catch(function(err){
    console.log("Fetch Error:", err);
  });
}*/

function actualiza()
{
  var url_1 = new URL(window.location.href);
  var url_inf = 'rest/receta/'+url_1.searchParams.get("id");
  var inf_data = null;
  fetch(url_inf)
    .then(
      function(response){
        if(response.status !== 200){
          console.log("No se ha podido realizar la peticion GET correctamente.");
          mostrarModal("03");
        }
        response.json().then(function(data) {
          //ok
          console.log(data);
          document.getElementById('dislikeval').innerHTML = data.FILAS[0].negativos;
          document.getElementById('likeval').innerHTML = data.FILAS[0].positivos;
          console.log("cambiados");

          mostrarModal("02");
        });
      })
      .catch( function(err){
        console.log(err);
      });
}
function mostrarModal(num){
  var modal = document.getElementById('id'+num);
  var span = document.getElementsByClassName("close")[num-1];
  modal.style.display='block';

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
         modal.style.display = "none";
    }
  }
}
