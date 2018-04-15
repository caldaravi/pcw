function dejarComentario(frm)
{
	let fd = new FormData(frm),
  xhr = new XMLHttpRequest(),
	url = 'rest/receta/1/comentario/',
	usu;

  if(!sessionStorage.getItem('usuario')) return false;



	fd.append('titulo', frm.titulo);
	fd.append('texto', frm.texto);
	fd.append('l', sessionStorage.getItem('usuario'));


  xhr.onload = function(){
    usu = JSON.parse(sessionStorage.getItem('usuario'));
	   console.log(xhr.responseText);
  }
  xhr.open('POST', url, true);

  xhr.setRequestHeader('Authorization', usu.clave);
  xhr.send(fd);

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
