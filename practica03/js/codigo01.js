// Puzzle Práctica 3 PCW

// Variables generales
var _ANCHO_ = 360,
    _ALTO_ = 240,
    wFicha, // anchura de la ficha del puzzle
    hFicha, // alto de la ficha del puzzle
    r;

// Variables de puzzle
var _piezas,        // vector que guarda columna, fila e imagedata de cada pieza
    _lasthoverX,    // comprobacion hover casilla anterior
    _lasthoverY,    // comprobacion hover casilla anterior
    _hoverX,        // comprobacion hover casilla actual
    _hoverY,        // comprobacion hover casilla actual
    linecolor,      // color de linea
    hovercolor,     // color de hover
    dibujadas,      // bool para controlar dibujado
    dificultad,     // MOD: habilitar trampa ganar de un boton (comprobar el mapa se ordena)
    click,          // controlar click pieza puzzle
    casillas,       // vector guarda columna y fila de ultima casilla clickada para comprobar
    start,          // permite hacer click y ordenar piezas del puzzle una vez se ha empezado el juego
    movimientos,    // contador de movimientos totales por partida
    total = 0,
    restantes = 0,
    _ayuda = true;

// Variables del tiempo
var timercount = 0,
    timestart = null,
    min = 0,
    s = 0,
    ms = 0;

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
  let section = document.querySelectorAll('section')[0];
  section.ondragover = function(a){
    cv01.ondragover = function(e){
      // Colocar aqui remarcado de canvas de color
      this.className="canvas-hover";
      e.stopPropagation();
      e.preventDefault(); // igual que return false;
    };
    cv01.className="";
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
    cv01.className="";
    enabledificultad(false);

  };

  cv01.onclick = function(e){
    e.preventDefault();
    document.getElementById("imgUp").click();
  };

  //EVENTOS DE RATON
  let cv02 = document.querySelector('#cv02');

  updatelines();
  updatehover();
  // Hover
  _lasthoverX = 0;
  _lasthoverY = 0;
  cv02.onmousemove = function(e){
    if(start){
      let mouseX = e.offsetX,
          mouseY = e.offsetY,
          celdaX = Math.floor( mouseX /(_ANCHO_ / wFicha) ), // coordsX / 60
          celdaY = Math.floor( mouseY /(_ALTO_ / hFicha) ), // coordsX / 60
          cv02 = document.querySelector('#cv02'),
          capa = cv02.getContext("2d");

          _hoverX = celdaX;
          _hoverY = celdaY;
          if(_hoverX != _lasthoverX || _hoverY != _lasthoverY){
            // Si tras moverse se encuentra en una casilla distinta --> borra anterior + hover sobre esa
            // BORRADO --> dibujar lineas rojas
            capa.strokeStyle = linecolor;
            capa.rect(celdaX * _ANCHO_ / wFicha, celdaY * _ALTO_/ hFicha, _ANCHO_ / wFicha, _ALTO_ / hFicha);
            capa.stroke();

            capa.beginPath();
            capa.strokeStyle = hovercolor;
            capa.rect(celdaX*_ANCHO_ / wFicha,celdaY*_ALTO_ / hFicha,_ANCHO_ / wFicha,_ALTO_ / hFicha);
            capa.stroke();
          }
      _lasthoverX = celdaX;
      _lasthoverY = celdaY;
    }

    };

  cv02.onmouseleave = function(e){
    if(dibujadas && start) drawlines();
    //let x = e.offsetX,
      //  y = e.offsetY;
  //  document.querySelector('#posLXY').textContent = `(${x}, ${y})`;
  };

  cv02.onclick = function(e){
    //Hacer con este el click de las fichas
      // Si start == true --> se puede empezar a clickar
    if(start){

      let x           = e.offsetX,
          y           = e.offsetY,
          [col, fila] = sacarFilaCol(e),      // COORDENADAS CLICK ACTUAL
          ctx01       = cv01.getContext('2d'),
          ctx02       = cv02.getContext('2d'),
          dim         = cv02.width / r,
          imgData     = ctx01.getImageData(col * dim, fila * dim,dim,dim);

          // Si ha clickado previamente
          if(click){
            //console.log("-- segundo click --");
            // Si 2a vez clicka en la misma casilla
            if([col,fila][0] == casillas[0] && [col,fila][1] == casillas[1]){
              //console.log("-- DESELECCIONA --");
              // Se DESELECCIONA
              var index = casillas[1]*wFicha+casillas[0];
              ctx02.putImageData(_piezas[index].imgData, casillas[0]*_ANCHO_/wFicha , casillas[1]*_ALTO_/hFicha);
              // Y se pintan las lineas de nuevo
              updatelines();
            }
            // Si 2a vez clicka en otra casilla distinta
            else{
                // Posicion en el array de cada celda tocada
                var anterior = casillas[1]   * wFicha + casillas[0],
                    actual   = [col,fila][1] * wFicha + [col,fila][0];

                    tmp               = _piezas[actual];
                    _piezas[actual]   = _piezas[anterior];
                    _piezas[anterior] = tmp;

                    ctx02.putImageData( _piezas[anterior].imgData, casillas[0] * (_ANCHO_ / wFicha), casillas[1] * (_ALTO_ / hFicha) );
                    ctx02.putImageData( _piezas[actual].imgData, [col,fila][0] * (_ANCHO_ / wFicha), [col,fila][1] * (_ALTO_ / hFicha) );

                    drawlines();
                    if(checkwin()){
                      finish_puzzle();
                    }
                    else{
                      movimientos++;
                      document.getElementById('movimientos').innerHTML = movimientos;
                      document.getElementById('desordenadas').innerHTML =restantes;
                    }
            }
            click = false;
          }
          else{
            //console.log("-- PRIMERA QUE MARCA --");

            // Primera que marca
            casillas = [col, fila];
            ctx02.beginPath();
            ctx02.fillStyle = 'rgba(0,35,0,0.2)';
            ctx02.fillRect(casillas[0] * (_ANCHO_/wFicha), casillas[1] * (_ALTO_/hFicha), _ANCHO_/wFicha, _ALTO_/hFicha);
            ctx02.stroke();
            // Se SELECCIONA
            /*
            ctx02.strokeStyle = linecolor;
            ctx02.rect(casillas[0]*_ANCHO_ / wFicha, celdaY * _ALTO_/ hFicha, _ANCHO_ / wFicha, _ALTO_ / hFicha);
            ctx02.stroke();*/
            click = true;
          }

    }

  };

  cv02.onmouseup = function(e){
    let x = e.offsetX,
        y = e.offsetY;
    //document.querySelector('#posUXY').textContent = `(${x}, ${y})`;
  };

  cv02.onmouseenter = function(e){
    if(start) undoayuda();
    _ayuda = true;
  };
  cv02.onmousedown = function(e){
    return false;
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
   document.getElementById("color_lines").disabled = false;
}


function limpiar(){
  let cv1 = document.querySelector('#cv01'),
      cv2 = document.querySelector('#cv02');
  //let cv = e.target.parentNode.parentNode.querySelector('canvas');
  cv1.width = cv1.width;
  cv2.width = cv2.width;
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
  dificultad = {};
  _piezas = [];
  copiar01();
  let color = document.getElementById("color_lines").value;
  document.getElementById("start").disabled = false;
  r = w;
  wFicha = w;
  hFicha = h;
  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d');

  drawlines();

  enable_start();

  dificultad.x = w;
  dificultad.y = h;
}

function guardardatos(){
  // Guardar datos casillas originales
  cv = document.getElementById('cv02');
  ctx = cv.getContext('2d');
  let pixW = _ANCHO_ / wFicha,
      pixH = _ALTO_ / hFicha;
  for (var i = 0; i < hFicha; i++) {
    for(var j = 0; j < wFicha; j++){
        tmp = {};
        tmp.sx   = j*pixW;
        tmp.sy   = i*pixH;
        tmp.col = j;
        tmp.fila  = i;
        tmp.imgData = ctx.getImageData(j*pixW,i*pixH,pixW,pixH);
        _piezas.push(tmp);
    }
  }
}

function drawlines()
{
    cv = document.getElementById('cv02');
    ctx = cv.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = linecolor;

    ancho = cv.width / wFicha,
    alto = cv.height / hFicha;
    r = wFicha;

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
    dibujadas = true;

}

function ayuda() {
  if(_ayuda){
    cv = document.getElementById('cv02');
    ctx = cv.getContext('2d');
    //ctx.beginPath();
    for(var i = 0 ; i < hFicha; i++){
      for(var j = 0; j < wFicha; j++){
        index = (i*wFicha)+j;
        if( _piezas[index].sx != j*(_ANCHO_/wFicha) || _piezas[index].sy != i*(_ALTO_/hFicha) ){
          ctx.beginPath();
          ctx.fillStyle = 'rgba(70,0,0,0.5)';
          ctx.fillRect(j * (_ANCHO_/wFicha),i * (_ALTO_/hFicha), _ANCHO_/wFicha, _ALTO_/hFicha);
          ctx.stroke();
        }
      }
    }
    _ayuda = false;
  }
}

function undoayuda(){
  cv = document.getElementById('cv02');
  ctx = cv.getContext('2d');
  for(var i = 0 ; i < hFicha; i++){
    for(var j = 0; j < wFicha; j++){
      index = (i*wFicha)+j;
      console.log("actualizo");
      ctx.putImageData(_piezas[index].imgData, j * (_ANCHO_/wFicha),i * (_ALTO_/hFicha) );

    }
  }
}

function start_puzzle() {
  movimientos = 0;
  // Guardamos en _piezas posiciones iniciales e imagesdata correspondientes
  guardardatos();

  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d');
  // Randomizar _piezas --> desordena el vector
  _piezas = shuffle(_piezas);

  // Dibujamos fichas desordenadas
  let pixW = _ANCHO_ / wFicha,
      pixH = _ALTO_ / hFicha;

  var ind = 0;
  for (var i = 0; i < hFicha; i++) {
    for(var j = 0; j < wFicha; j++){
      ctx.putImageData(_piezas[ind].imgData,j*pixW,i*pixH);
      ind++;
    }
  }

  document.getElementById("cv01").style.pointerEvents = "none";
  document.getElementById("imgBtn").disabled = true;

  showtimer();
  sw_start();

  updatebuttons(true);

  start = true;

  total = hFicha * wFicha;

  checkwin();

  document.getElementById('desordenadas').innerHTML   = restantes;
  document.getElementById('movimientos').innerHTML = movimientos;

}


function popup(x) {
  texto = '¡Has perdido!';
  if(restantes == 0) texto = '¡Has ganado!';
  // Modificamos tiempos
  if(min == 0) min = '';
  else min += ' min ';
  if(s == 0) s = '';
  else s += ' s ';

  var t = document.timeform.timetextarea.value;
  if(x){
    // Aparece
    container = document.getElementById('container');
    modal = document.createElement('div');
    modal.setAttribute('id', 'win-popup');
    container.appendChild(modal);
    document.getElementById('win-popup').className = 'modal';

    modal.innerHTML =
    `<div class="modal-content">
        <div id="modalHeader" class="modal-header">
          <span id="cross" onclick="popup(false)" class="close">&times;</span>
          <h2>` + texto + `</h2>
        </div>
        <div class="modal-body">
          <p>Has realizado un tiempo de ` + min + s + ms + ` ms</p>
          <p>Has colocado correctamente ` + (total-restantes) + ` piezas de un total de ` + total + ` en ` + movimientos + ` movimientos.</p>
        </div>
      </div>
    `;
    if(restantes == 0) document.getElementById("modalHeader").style.backgroundColor = "green";
    modal.style.display = "block";
  }
  else{
    // Desaparece
    modal = document.getElementById('win-popup');
    modal.parentNode.removeChild(modal);
  }

  window.onclick = function(event) {
    if (event.target == modal) {
        popup(false);
    }
  }
}

function finish_puzzle() {

  // Restaurar botones
  updatebuttons(false);
  popup(true);
  limpiar();
  stop();

  start = false;
  total = 0;
  movimientos = 0;
  restantes = 0;

  document.getElementById("cv01").style.pointerEvents = "auto";
  document.getElementById('movimientos').innerHTML = movimientos;
  document.getElementById('desordenadas').innerHTML = restantes;

  // Dibujamos texto
  cv = document.getElementById('cv01');
  ctx = cv.getContext('2d');
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Haz click o arrastra una imagen aquí",_ANCHO_/6,_ALTO_/2);
}

function checkwin() {
  var value = true;
  var coords;
  var ok = 0;
  for(var i = 0 ; i < hFicha; i++){
    for(var j = 0; j < wFicha; j++){
      index = (i*wFicha)+j;
      if( _piezas[index].sx == j*(_ANCHO_/wFicha) && _piezas[index].sy == i*(_ALTO_/hFicha) ){
        ok++
      }
    }
  }
  if( ok != total ) value = false;
  restantes = total - ok;
  return value;
}

function gana(){
  cv = document.getElementById('cv02');
  ctx = cv.getContext('2d');
  for(var i = 0 ; i < hFicha; i++){
    for(var j = 0; j < wFicha; j++){
      index = (i*wFicha)+j;
      ctx.putImageData(_piezas[index].imgData,_piezas[index].sx,_piezas[index].sy);
    }
  }
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function enabledificultad(x){
  let btn = document.getElementsByClassName("btnDificultad");
  for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = x;
  }
}

function enable_start(){
  let btn = document.getElementById("start");
  btn.disabled = false;
}

function updatebuttons(x) {
  if(x){
    enabledificultad(true);
    document.getElementById('color_lines').disabled = true;
    document.getElementById('start').disabled       = true;
    document.getElementById('finish').disabled      = false;
    document.getElementById('help').disabled        = false;
  }
  else{
      enabledificultad(true);
      document.getElementById('color_lines').disabled = false;
      document.getElementById("imgBtn").disabled      = false;
      document.getElementById('start').disabled       = true;
      document.getElementById('finish').disabled      = true;
      document.getElementById('help').disabled        = true;
  }
}


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function contains(xini,yini,offset,x,y){
  let value = false;
  if( (xini < x && x < (xini + offset)) && (yini < y && y < (yini + offset) ) ) value = true;
  return value;
}

function updatelines() {
  linecolor = document.getElementById('color_lines').value;
  if(dibujadas){
    drawlines();
  }
}

function updatehover() {
  hovercolor = document.getElementById('color_hover').value;
}

// Contador de Tiempo

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
  min = minutes_passed;
  s = seconds_passed;
  ms = milliseconds_passed;
	timestart = null;
  document.timeform.timetextarea.value = "00:00";
}
