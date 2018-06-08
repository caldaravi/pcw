// Puzzle Práctica 3 PCW

// Variables generales
var _ANCHO_ = 360,
    _ALTO_ = 240,
    wFicha,
    hFicha,
    r;

// Variables del Puzzle
var _piezas,
    _piezaActual,
    _piezaCambio,
    _movimientos,
    _desordenadas;
// Variables de Tiempo
var timercount = 0,
    timestart = null;

function sacarFilaCol(e){
    let dim = e.target.width / r,
        fila = Math.floor(e.offsetY / dim),
        col = Math.floor(e.offsetX / dim);

    return [col, fila];
}

function prepararCanvas(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d'),
      cvs = document.querySelectorAll('canvas');

  cvs.forEach(function(e){
    e.width = _ANCHO_;
    e.height = _ALTO_;
  });

  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Haz click o arrastra una imagen aquí",_ANCHO_/6,_ALTO_/2);

  //Implementación drag and drop
  let cv01 = document.querySelector('#cv01');
  cv01.ondragover = function(e){
    e.stopPropagation();

    //Resaltar canvas que puede drag&drop aqui
    e.target.style.border = "3px dotted red";

    e.preventDefault(); // igual que return false;
  };
  cv01.ondragleave = function(e){
    e.stopPropagation();

    //Devolver Canvas a estado inicial
    e.target.style.border = "";

    e.preventDefault(); // igual que return false;
  };
  cv01.ondrop = function(e){
    e.preventDefault();
    e.target.style.border = "";
    let fichero = e.dataTransfer.files[0],
        fr = new FileReader();
    fr.onload = function(){
      let img = new Image();
      img.onload = function(){

        let ctx = cv01.getContext('2d');
        ctx.clearRect(0, 0, cv01.width, cv01.height);
        ctx.drawImage(img,0,0,cv01.width,cv01.height);
        copiar01();
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(fichero);

    let btn = document.getElementsByClassName("btnDificultad");
    for (let i = 0; i < btn.length; i++) {
        btn[i].disabled = false;
    }
    document.getElementById("color").disabled = false;
  };

  cv01.onclick = function(e){
    e.preventDefault();
    document.getElementById("imgUp").click();
  };


  //EVENTOS DE RATON
  let cv02 = document.querySelector('#cv02');
  // cv02.onmousemove = function(e){
  //   let x           = e.offsetX,
  //       y           = e.offsetY,
  //       [col, fila] = sacarFilaCol(e),
  //       ctx02       = cv02.getContext('2d'),
  //       dim         = cv02.width / r;
  //
  //   document.querySelector('#posXY').textContent = `(${x}, ${y})`;
  //   document.querySelector('#filaCol').textContent = `(${fila}, ${col})`;
  //
  //   let fc= cv02.getAttribute('data-FC');
  //   if(fc){
  //     fc = JSON.parse(fc);
  //     if(fc.fila == fila && fc.col == col)
  //       return;
  //   }
  //   console.log("REPINTANDO");
  //   cv02.width = cv02.width;
  //   ctx02.drawImage(cv01, col * dim, fila * dim,dim,dim,col * dim, fila * dim,dim,dim);
  //   eligeDificultad(wFicha, hFicha);
  //
  //   fc = {'fila': fila, 'col': col};
  //   cv02.setAttribute('data-FC', JSON.stringify(fc));
  // };
  cv02.onmouseenter = function(e){
    let x = e.offsetX,
        y = e.offsetY;
    document.querySelector('#posEXY').textContent = `(${x}, ${y})`;
  };
  cv02.onmouseleave = function(e){
    let x = e.offsetX,
        y = e.offsetY;
    document.querySelector('#posLXY').textContent = `(${x}, ${y})`;
  };
  cv02.onmousedown = function(e){
    let x = e.offsetX,
        y = e.offsetY;
    document.querySelector('#posDXY').textContent = `(${x}, ${y})`;
  };
  cv02.onclick = function(e){
    //Hacer con este el click de las fichas
    let x           = e.offsetX,
        y           = e.offsetY,
        [col, fila] = sacarFilaCol(e),
        ctx01       = cv01.getContext('2d'),
        ctx02       = cv02.getContext('2d'),
        dim         = cv02.width / r,
        imgData     = ctx01.getImageData(col * dim, fila * dim,dim,dim);

    document.querySelector('#posCXY').textContent = `(${x}, ${y})`;
    //ctx02.putImageData(imgData, col * dim, fila * dim);
    ctx02.drawImage(cv01, col * dim, fila * dim,dim,dim,col * dim, fila * dim,dim,dim);
    //eligeDificultad(wFicha, hFicha);
  };
  cv02.onmouseup = function(e){
    let x = e.offsetX,
        y = e.offsetY;
    document.querySelector('#posUXY').textContent = `(${x}, ${y})`;
  };
}

function subirImg(event){

  var reader = new FileReader();
  var file = event.target.files[0];

  reader.onload = function(){
    let img = new Image();

    img.onload = function(){
      let ctx = cv01.getContext('2d');
      ctx.clearRect(0, 0, cv01.width, cv01.height);
      ctx.drawImage(img,0,0,cv01.width,cv01.height);
      copiar01();
    };
    img.src = reader.result;
  };

  reader.readAsDataURL(file);

   let btn = document.getElementsByClassName("btnDificultad");
   for (let i = 0; i < btn.length; i++) {
       btn[i].disabled = false;
   }
   document.getElementById("color").disabled = false;
}

function prueba01(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d');

      //Cambiar el ancho de línea
      ctx.lineWidth = 2;
      //Color rojo
      ctx.strokeStyle = '#a00';
      //dibujamos en la 0,0 ancho 100, alto 75
      ctx.strokeRect(0,0,100,75);
}

function translacion(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d');

  //Transladamos el origen de coordenadas en x,y de la anterior
  //ctx.translate(20,50);
  ctx.translate(cv.width / 2, cv.height / 2);

}

function rotacion(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d')
      ang = 45;

  //Se tiene que rotar en Radianes
  ctx.rotate(Math.PI * (ang / 180));

}

function escalado(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d');

  //Escalamos en x,y (1,1) es dejarlo igual
  ctx.escale(2,1);

}

function limpiar(){
  let cv1 = document.querySelector('#cv01'),
      cv2 = document.querySelector('#cv02');
  //let cv = e.target.parentNode.parentNode.querySelector('canvas');
  cv1.width = cv1.width;
  cv2.width = cv2.width;
}

function imagen01(){
  let cv = document.querySelector('#cv01'),
      ctx = cv.getContext('2d'),
      img = new Image();

  img.onload = function(){
    //Imagen a dibujar, x, y
    // ctx.drawImage(img,0,0);
    //Imagen a dibujar, x, y, ancho canvas, alto canvas
    ctx.drawImage(img,0,0, cv.width, cv.height);
  }
  img.src = 'imgs/paisaje.jpg';

}

function copiar01(){
  let cv01 = document.querySelector('#cv01'),
      cv02 = document.querySelector('#cv02'),
      ctx01 = cv01.getContext('2d'),
      ctx02 = cv02.getContext('2d');

  //ctx02.drawImage(cv01,0,0);
  imgData = ctx01.getImageData(0,0, cv01.width, cv01.height);
   ctx02.putImageData(imgData,0,0);
  //                          destino  origen  tamaño
  //ctx02.putImageData(imgData, 100, 50, 50, 50, 100, 80);

}

function eligeDificultad(w, h){

  copiar01();
  let color = document.getElementById("color").value;
  document.getElementById("start").disabled = false;
  r = w;
  wFicha = w;
  hFicha = h;
  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d'),
      ancho = cv.width / w,
      alto = cv.height / h;

      //Limpiar canvas
      //ctx.clearRect(0, 0, cv02.width, cv02.height);

  ctx.beginPath();
  ctx.lineWidht = 2;
  ctx.strokeStyle = color;

  for(let i=1; i<r; i++){
    //líneas verticales
    ctx.moveTo(i * ancho, 0);
    ctx.lineTo(i * ancho, cv.height);

    //líneas horizontales
    ctx.moveTo(0, i * alto);
    ctx.lineTo(cv.width, i * alto);
  }
  ctx.rect(0,0,cv.width, cv.height);
  ctx.stroke();
}

function finalizar(){
  limpiar();
  stop();
  document.getElementById("cv01").style.pointerEvents = "auto";

}

function empezar(){
  let btn = document.getElementsByClassName("btnDificultad");
  for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = true;
  }
  document.getElementById("color").disabled = true;
  document.getElementById("start").disabled = true;
  document.getElementById("end").disabled = false;
  document.getElementById("help").disabled = false;
  document.getElementById("cv01").style.pointerEvents = "none";

  _piezas = [];
  showtimer();
  sw_start();
}

function showtimer() {
	if(timercount) {
		clearTimeout(timercount);
		clockID = 0;
	}
	if(!timestart){
		timestart = new Date();
	}
	var timeend = new Date();
	var timedifference = timeend.getTime() - timestart.getTime();
	timeend.setTime(timedifference);
	var minutes_passed = timeend.getMinutes();
	if(minutes_passed < 10){
		minutes_passed = "0" + minutes_passed;
	}
	var seconds_passed = timeend.getSeconds();
	if(seconds_passed < 10){
		seconds_passed = "0" + seconds_passed;
	}
	document.timeform.timetextarea.value = minutes_passed + ":" + seconds_passed;
	timercount = setTimeout("showtimer()", 1000);
}

function sw_start(){
	if(!timercount){
	timestart   = new Date();
	document.timeform.timetextarea.value = "00:00";
	timercount  = setTimeout("showtimer()", 1000);
	}
	else{
	var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
		var milliseconds_passed = timeend.getMilliseconds();
		if(milliseconds_passed < 10){
			milliseconds_passed = "00" + milliseconds_passed;
		}
		else if(milliseconds_passed < 100){
			milliseconds_passed = "0" + milliseconds_passed;
		}
	}
}

function stop() {
	if(timercount) {
		clearTimeout(timercount);
		timercount  = 0;
		var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
		var milliseconds_passed = timeend.getMilliseconds();
		if(milliseconds_passed < 10){
			milliseconds_passed = "00" + milliseconds_passed;
		}
		else if(milliseconds_passed < 100){
			milliseconds_passed = "0" + milliseconds_passed;
		}
		document.timeform.timetextarea.value = minutes_passed + ":" + seconds_passed + "." + milliseconds_passed;
	}
	timestart = null;
}

function reset() {
	timestart = null;
	document.timeform.timetextarea.value = "00:00";
}
