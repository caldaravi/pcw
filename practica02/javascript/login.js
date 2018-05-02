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
			var modal = document.getElementById('id01');
      var span = document.getElementsByClassName("close")[0];
      modal.style.display='block';
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
         modal.style.display = "none";
				 window.location.href = "/pcw/practica02/index.html";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
             modal.style.display = "none";
						 window.location.href = "/pcw/practica02/index.html";
        }
      }
    } else {
    	 console.log('ERROR');
			 var modal = document.getElementById('id02');
       var span = document.getElementsByClassName("close")[1];
       modal.style.display='block';
       // When the user clicks on <span> (x), close the modal
       span.onclick = function() {
				 document.getElementById('usuario').focus();
          modal.style.display = "none";
       }

       // When the user clicks anywhere outside of the modal, close it
       window.onclick = function(event) {
         if (event.target == modal) {
              modal.style.display = "none";
							document.getElementById('usuario').focus();
         }
       }
    }
  }


  xhr.send(fd);

  return false;
}
