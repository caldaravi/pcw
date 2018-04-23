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
var contador = 0;
function addFoto(){

  console.log("añadiendo foto");

  var cont = document.getElementById("fotosReceta");
  var div = document.createElement('div');
  var id = "foto" + contador;
  div.className = 'imgcontainer';
  div.setAttribute("id", id);
  cont.appendChild(div);

  div.innerHTML +=
  `
  <p><button onclick="cerrarFicha(` + id + `)" class="icon-cancel"></button></p>
  <input onchange="getPath(this)" required id="` + contador + `" type="file" name="foto" accept="image/*">


    <p>Foto:</p>
    <img id="img` + contador + `" onclick="image/*()" src="imgs/sin_imagen.jpg" alt="noimagen">

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

function getPath(x){
  var path = x.value;
  var filename = path.replace(/^.*\\/, "");
  var img = document.getElementById("img" + x.id);
  img.src = "imgs/" + filename;
}

function mandarReceta(receta){
  console.log("enviando receta");
  return false;
}
