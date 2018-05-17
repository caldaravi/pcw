var _ANCHO_ = 360,
    _ALTO_ = 240,
    wFicha,
    hFicha,
    r;

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

  //Implementación drag and drop
  let cv01 = document.querySelector('#cv01');
  cv01.ondragover = function(e){
    e.stopPropagation();
    e.preventDefault(); // igual que return false;
  };
  cv01.ondrop = function(e){
    e.preventDefault();
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

function limpiar(e){
  //let cv = document.querySelector('#cv01');
  let cv = e.target.parentNode.parentNode.querySelector('canvas');
  cv.width = cv.width;
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
  ctx.strokeStyle = '#a00';

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
