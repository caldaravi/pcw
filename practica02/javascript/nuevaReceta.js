var contador = 0;
var numFotos = 0;
var numIngredientes = 0;
var fotos = [];

function addIngrediente(ingrediente){

  var x = ingrediente.value;

  if(x!=""){
    var list = document.getElementById("ingredientes");

    // Crear el item li
    var item = document.createElement('li');

    // Poner el contenido
    item.appendChild(document.createTextNode(x));

    // Añadir a la lista
    list.appendChild(item);

    //Devolver el focus y resetear texto
    document.getElementById("ingrediente").value = '';
    document.getElementById("ingrediente").focus();
    numIngredientes++;
  } else {
    alert("No hay ingrediente");
  }

}

function addFoto(){

  var cont = document.getElementById("fotosReceta");
  var div = document.createElement('div');
  var id = "foto" + contador;
  div.className = 'imgcontainer';
  div.setAttribute("id", id);
  cont.appendChild(div);

  div.innerHTML +=
  `
  <p><button onclick="cerrarFicha(` + id + `)" class="icon-cancel"></button></p>
  <input onchange="getImg(this)" required id="` + contador + `" type="file" name="foto" accept="image/*">

  <p>Foto:</p>
  <img id="img` + contador + `" type="file" onclick="getImg(this)" accept="image/*()" src="imgs/sin_imagen.jpg" alt="noimagen" style="cursor: pointer">

  <p>Descripción: </p>
  <textarea name="descripcion` + contador + `" cols="30" rows="4"></textarea>
  `
  contador++;
}

function cerrarFicha(x){

  var id = x.id.split("foto");
  id = "img" + id[1];

  var src = document.getElementById(id).src;
  var img = src.split("http://localhost/pcw/practica02/imgs/");
  img = img[1];

  var index = fotos.indexOf(img);
  if(index > -1){
    fotos.splice(index, 1);
  }

  var elem = document.getElementById(x.id);
  elem.parentNode.removeChild(elem);

  return false;
}

function getImg(x){

  if(x.type == "file"){
    var file = x.files[0].size;
    var name = x.files[0].name;
    var img = document.getElementById("img" + x.id);

    if(file>300000){
      document.getElementById('id01').style.display='block';
    } else {
      img.src = "imgs/" + name;
      numFotos++;
      fotos.push(name);
    }
  } else {

    var splited = x.id.split('img');
    var inputId = splited[1];
    var fileupload = document.getElementById(inputId);
    var image = document.getElementById(x.id);

    image.onclick = function () {
        fileupload.click();
    };
    fileupload.onchange = function () {
      var file = fileupload.files[0].size;
      var name = fileupload.files[0].name;

      if(file>300000){
        var modal = document.getElementById('id01');
        modal.style.display='block';
        window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
        }
      } else {
          image.src = "imgs/" + name;
          numFotos++;
          fotos.push(name);
      }
    }
  }
}

function mandarReceta(form){
  if(numFotos>0){
    if(numIngredientes > 0){
      let xhr = new XMLHttpRequest(),
      fd  = new FormData(form),
      url = 'rest/receta/',
      usu;

      if(xhr){
        usu = JSON.parse(sessionStorage.getItem('usuario'));
        var dificultad;
        switch(form.dificultad.value){
          case 'baja': dificultad = 0; break;
          case 'media': dificultad = 1; break;
          case 'alta': dificultad = 2; break;
        }
        fd.append('l',usu.login);
        fd.append('n',form.titulo.value);
        fd.append('e',form.elaboracion.value);
        fd.append('t',form.tiempo.value);
        fd.append('d',dificultad);
        fd.append('c',form.comensales.value);

        xhr.open('POST', url, true);

        xhr.onload = function(){
           console.log(xhr.responseText);

           let r = JSON.parse(xhr.responseText);

           if(r.RESULTADO == "OK"){
             enviarIngredientes(r.ID);
           } else {

               var modal = document.getElementById('id03');
               var span = document.getElementsByClassName("close")[0];
               modal.style.display='block';
               // When the user clicks on <span> (x), close the modal
              span.onclick = function() {
                  modal.style.display = "none";
              }

              // When the user clicks anywhere outside of the modal, close it
              window.onclick = function(event) {
                  if (event.target == modal) {
                      modal.style.display = "none";
                  }
              }
           }
        }
        xhr.setRequestHeader('Authorization', usu.clave);
        xhr.send(fd);
      }
    } else {
      var modal = document.getElementById('id04');
      var span = document.getElementsByClassName("close")[0];
      modal.style.display='block';
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
         modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
             modal.style.display = "none";
        }
      }
    }
  } else {
      var modal = document.getElementById('id02');
      var span = document.getElementsByClassName("close")[0];
      modal.style.display='block';
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
         modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
             modal.style.display = "none";
        }
      }
  }
  return false;
}

function enviarIngredientes(id){
  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
  url = 'rest/receta/' + id + '/ingredientes',
  usu;

  if(xhr){
    var ul = document.getElementById("ingredientes");
    var vIngredientes = [];
    var i;

    for(i=0; i<ul.children.length; i++){
      vIngredientes.push(ul.childNodes[i].innerText);
    }

    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);
    fd.append('i',JSON.stringify(vIngredientes));

    xhr.open('POST', url, true);
    xhr.onload = function(){
       console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

       if(r.RESULTADO == "OK"){
         enviarFotos(id);
       } else {
         console.log("nope");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}

function enviarFotos(id){
  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
  url = 'rest/receta/' + id + '/foto',
  usu;

  if(xhr){
    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);
    fd.append('t',"desc");

    xhr.open('POST', url, true);
    xhr.onload = function(){
       console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

       if(r.RESULTADO == "OK"){
         console.log("fotos subidas al servidor")
       } else {
         console.log("nope");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}
