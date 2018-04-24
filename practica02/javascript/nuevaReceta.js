var contador = 0;
var fotos = 0;

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
      fotos++;
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
        document.getElementById('id01').style.display='block';
      } else {
        image.src = "imgs/" + name;
        fotos++;
      }
    }
  }
}

function mandarReceta(form){
  console.log("mandarReceta()");
  if(fotos>0){
    console.log("fotos ok");
    let xhr = new XMLHttpRequest(),
    fd  = new FormData(form),
    url = 'rest/receta/',
    usu;

    if(xhr){
      usu = JSON.parse(sessionStorage.getItem('usuario'));
      fd.append('l',usu.login);
      fd.append('n',form.titulo.value);
      fd.append('e',form.elaboracion.value);
      fd.append('t',form.tiempo.value);
      fd.append('d',form.dificultad.value);
      fd.append('c',form.comensales.value);

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
  } else {
    console.log("Falta la foto");
    document.getElementById('id02').style.display='block';
  }
  return false;
}
