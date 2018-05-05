var contador = 0;
var numFotos = 0;
var numIngredientes = 0;
var fotos = [];
var titulo;

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
  var id = "fichaFoto" + contador;
  div.className = 'imgcontainer';
  div.setAttribute("id", id);
  cont.appendChild(div);
  div.innerHTML +=
  `
  <p><button id="cerrar` + contador + `" onclick="cerrarFicha(this)" class="icon-cancel"></button></p>
  <button id="btn` + contador +`" onclick="elegirImagen(event)">Elegir imagen</button>
  <input required id="` + contador + `" onchange="elegirImagen(event)" type="file" accept="image/*" style="display: none">

  <p>Foto:</p>
  <img id="img` + contador +`" onclick="elegirImagen(event)" accept="image/*()" src="imgs/sin_imagen.jpg" alt="noimagen" style="cursor: pointer">

  <p>Descripción: </p>
  <textarea id="descripcion` + contador + `" name="descripcion` + contador + `" cols="30" rows="4"></textarea>
  `
  contador++;
}

function elegirImagen(event){
// Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    var reader = new FileReader();
    var file = event.target;

    if(file.type == "file"){
      if(file.files[0].size > 300000){
        mostrarModal("01");
      } else {
        reader.onload = function(){
          var dataURL = reader.result;
          var output = document.getElementById('img' + event.explicitOriginalTarget.id);
          if(output.alt == "noimagen"){
            output.src = dataURL;
            output.alt = "imagen";
            numFotos++;
            fotos.push({file:file.files[0], id: event.explicitOriginalTarget.id, src: dataURL});
          } else {
            output.src = dataURL;
            output.alt = "imagen";
            for(var i=0; i<fotos.length; i++){
              if(fotos[i].id == event.explicitOriginalTarget.id){
                fotos[i].file = file.files[0];
                fotos[i].src = dataURL;
              }
            }
          }
        };
         reader.readAsDataURL(file.files[0]);
       }
     } else {
       if(file.localName == "button"){
         var splited = event.explicitOriginalTarget.id.split('btn');
         var id = splited[1];
         var image = document.getElementById("img" + id);
         file.onclick = function () {
             document.getElementById(id).click();
         };
       } else {
         if(file.localName == "img"){
           var splited = event.explicitOriginalTarget.id.split('img');
           var id = splited[1];
           file.onclick = function () {
               document.getElementById(id).click();
           };
         }
       }
     }
    } else {
    alert('The File APIs are not fully supported in this browser.');
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
        titulo = form.titulo.value;

        fd.append('l',usu.login);
        fd.append('n',titulo);
        fd.append('e',form.elaboracion.value);
        fd.append('t',form.tiempo.value);
        fd.append('d',form.dificultad.value);
        fd.append('c',form.comensales.value);

        xhr.open('POST', url, true);

        xhr.onload = function(){
           console.log(xhr.responseText);

           let r = JSON.parse(xhr.responseText);

           if(r.RESULTADO == "OK"){
             enviarIngredientes(r.ID);
             for(var i=0; i<fotos.length; i++){
               enviarFotos(r.ID, i);
             }
             limpiarFormulario();

             document.getElementById("msgReceta").innerHTML = "Se ha creado correctamente la receta " + titulo;
             mostrarModal("05");
           } else {
               mostrarModal("03");
           }
        }
        xhr.setRequestHeader('Authorization', usu.clave);
        xhr.send(fd);
      }
    } else {
      mostrarModal("04");
    }
  } else {
      mostrarModal("02");
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

       let r = JSON.parse(xhr.responseText);

       if(r.RESULTADO == "OK"){
         console.log("ingredientes enviados a la BD");
       } else {
         console.log("nope");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}

function enviarFotos(id, i){
  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
  url = 'rest/receta/' + id + '/foto',
  usu;

  var desc = document.getElementById("descripcion" + fotos[i].id).value;

  if(xhr){
    usu = JSON.parse(sessionStorage.getItem('usuario'));

    fd.append('l',usu.login);
    fd.append('t',desc);
    fd.append('f',fotos[i].file);

    xhr.open('POST', url, true);
    xhr.onload = function(){

       let r = JSON.parse(xhr.responseText);

       if(r.RESULTADO == "OK"){
         console.log("Foto " + i + " subida");
       } else {
         console.log("No se ha podido subir la foto");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}

function limpiarFormulario(){
  document.getElementById("nuevaRecetaForm").reset();
  var div = document.getElementById("fotosReceta");
  var list = document.getElementById("ingredientes");

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  while(list.hasChildNodes()) {
    list.removeChild(list.childNodes[0]);
  }
}

function cerrarFicha(x){
  var split = x.id.split("cerrar");
  var id = split[1];
  var img = document.getElementById("img"+id);

  var index = -1;
  for(var i=0; i<fotos.length; i++){
    if(fotos[i].src == img.src){
      index = i;
    }
  }

  if(index > -1){
    fotos.splice(index, 1);
    numFotos--;
  }

  var elem = document.getElementById("fichaFoto" + id);
  elem.parentNode.removeChild(elem);

  return false;
}

function mostrarModal(num){
  var modal = document.getElementById('id'+num);
  modal.style.display='block';
  if(num != "05"){
    var span = document.getElementsByClassName("close")[num-1];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
         modal.style.display = "none";
         if(num == "05")
          window.location.href = "/pcw/practica02/index.html";
    }
  }
}
