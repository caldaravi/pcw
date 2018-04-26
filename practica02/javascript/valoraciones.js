function like(){
  console.log("like con ajax");
  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
	url = 'rest/receta/1/voto/1',
  usu;

  if(xhr){

    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);

    xhr.open('POST', url, true);
    xhr.onload = function(){
  	   console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

     	 if(r.RESULTADO == "OK"){
         console.log("voto ok");
       } else {
         console.log("nope");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}

function dislike(){
  console.log("dislike con fetch");

  let fd = new FormData(),
  usu;

  fd.append('l','usuario1');

  var url = 'rest/receta/1/voto/0',
      init = {method: 'POST', body:fd, headers: {'Authorization':'cfd95109aeea1ff47bca4c5e83cd2af0'}};


  fetch(url, init).then(function(response){
    response.text().then(function(data){
      console.log(data);
    });
    if(!response.ok){

      console.log("Error con código:" + response.status);
      return;
    }
    response.json().then(function(data){
      console.log("nombre:" + data.nombre);
    });
  }).catch(function(err){
    console.log("Fetch Error:", err);
  });
}
