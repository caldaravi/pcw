function hacerLogin(frm)
{
	let fd = new FormData(frm),
  xhr = new XMLHttpRequest(),
  url = 'rest/login/';

  xhr.open('POST', url, true);

  xhr.onload = function(){
  	console.log(xhr.responseText);
  	let r = JSON.parse(xhr.responseText);

  	if(r.RESULTADO=='OK'){
      if(window.localStorage){ // Se comprueba si hay soporte para Web Storage
         var frm = document.querySelectorAll("form")[0];
          //if(frm.remember.checked){ // Si se ha marcado guardar datos ...
            sessionStorage.setItem("usuario", xhr.responseText);
            //sessionStorage.setItem("password", frm.pwd.value); // modo alternativo
          //}
      }
  		console.log(r);
      document.getElementById('id01').style.display='block';
    } else {
    	 console.log('ERROR');
       document.getElementById('id02').style.display='block';

    }
  }


  xhr.send(fd);

  return false;
}
