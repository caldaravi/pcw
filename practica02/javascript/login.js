function hacerLogin(frm)
{
  var comprueba = require("./recordar");
	let fd = new FormData(frm),
  xhr = new XMLHttpRequest(),
  url = 'rest/login/';

  xhr.open('POST', url, true);

  xhr.onload = function(){
  	console.log(xhr.responseText);
  	let r = JSON.parse(xhr.responseText);

  	if(r.RESPUESTA='OK'){
  		console.log(r);
  		sessionStorage.setItem('usuario', xhr.responseText);
      comprueba.comprobar();
    } else {
    	 console.log('ERROR')
    }
  }


  xhr.send(fd);

  return false;
}
