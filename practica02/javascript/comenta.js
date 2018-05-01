function dejarComentario(frm)
{
	console.log(frm);
	var url_string = window.location.href;
	var url_str = new URL(url_string);
	var id = url_str.searchParams.get("id");

	let fd = new FormData(),
  xhr = new XMLHttpRequest(),
	url = 'rest/receta/' + id + '/comentario';

  if(!sessionStorage.getItem('usuario')) return false;

	var usu = JSON.parse(sessionStorage.getItem('usuario'));
	fd.append('l', usu.login );
	fd.append('titulo', frm.titulo_coment.value);
	fd.append('texto', frm.comentario.value);

	xhr.open('POST', url, true);

  xhr.onload = function(){
	   console.log(xhr.responseText);

		 let r = JSON.parse(xhr.responseText);

		 if(r.RESULTADO == "OK"){
			 console.log("coment ok");
			 document.getElementById("form_comentario").reset();



		 } else {
			 console.log("nope");
			 // modal

			 var modal = document.getElementById('id01');
       var span = document.getElementsByClassName("close")[0];
       modal.style.display='block';
       // When the user clicks on <span> (x), close the modal
       span.onclick = function() {
          modal.style.display = "none";
					document.getElementById('titulo_coment').focus();
       }

       // When the user clicks anywhere outside of the modal, close it
       window.onclick = function(event) {
         if (event.target == modal) {
              modal.style.display = "none";
         }
       }

		 }
  }
	xhr.setRequestHeader('Authorization', "a");
  xhr.send(fd);

	return false;

}

function getBody(content)
{
   test = content.toLowerCase();
   var x = test.indexOf("<body");
   if(x == -1) return "";

   x = test.indexOf(">", x);
   if(x == -1) return "";

   var y = test.lastIndexOf("</body>");
   if(y == -1) y = test.lastIndexOf("</html>");
   if(y == -1) y = content.length;    // If no HTML then just grab everything till end

   return content.slice(x + 1, y);
}
function createXHR()
{
    var request = false;
        try {
            request = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                request = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (err3) {
		try {
			request = new XMLHttpRequest();
		}
		catch (err1)
		{
			request = false;
		}
            }
        }
    return request;
}

function loadHTML(url, fun, storage, param)
{
	var xhr = createXHR();
	xhr.onreadystatechange=function()
	{
		if(xhr.readyState == 4)
		{
			//if(xhr.status == 200)
			{
				storage.innerHTML = getBody(xhr.responseText);
				fun(storage, param);
			}
		}
	};

	xhr.open("GET", url , true);
	xhr.send(null);

}

function processHTML(temp, target)
{
	target.innerHTML = temp.innerHTML;
}

function loadWholePage(url)
{
	var y = document.getElementById("storage");
	var x = document.getElementById("displayed");

	loadHTML(url, processHTML, x, y);
}
