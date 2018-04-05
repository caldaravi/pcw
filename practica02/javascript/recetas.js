function getRecetas()
{
  console.log("hola");
  xhr = new XMLHttpRequest(),
  url = 'rest/receta/?u=6';

  xhr.open('GET', url, true);

  xhr.onload = function(){
    console.log(xhr.responseText);
    let r = JSON.parse(xhr.responseText);

    //if(r.RESULTADO == 'OK'){
      console.log(r);

    //}
  }
}
