function control(){
  var elements = document.getElementsByClassName('logged');
  var elements2 = document.getElementsByClassName('deslogged');

  if(sessionStorage.getItem('usuario') != null){
    console.log("logueado");
    for(item in elements){
      console.log("Antes de none, element:" + item);
      console.log(elements[item]);
      elements[item].style.display='block';
      console.log("Despues de none, element:" + item);
      console.log(elements[item]);
    }
    for(item2 in elements2){
      console.log("Antes de none, element:" + item2);
      console.log(elements2[item2]);
      elements2[item2].style.display='none';
      console.log("Despues de none, element:" + item2);
      console.log(elements2[item2]);
    }
  } else {
    console.log("deslogueado");
    for(item in elements){
      console.log("Antes de none, element:" + item);
      console.log(elements[item]);
      elements[item].style.display='none';
      console.log("Despues de none, element:" + item);
      console.log(elements[item]);
    }
    for(item2 in elements2){
      console.log("Antes de none, element:" + item2);
      console.log(elements2[item2]);
      elements2[item2].style.display='block';
      console.log("Despues de none, element:" + item2);
      console.log(elements2[item2]);
    }
  }
}
