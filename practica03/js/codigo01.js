var _ANCHO_ = 360,
    _ALTO_ = 360;

function prepararCanvas(){
  let cvs = document.querySelectorAll('canvas');

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
        ctx.drawImage(img,0,0,cv01.width,cv01.height);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(fichero);


  }
}

let cv02 = document.querySelector('#cv02');
console.log(cv02);
cv02.onmousemove = function(e){
  let x = e.offsetX,
      y = e.offsetY;
      console.log(e);
      document.querySelector('#posXY').textContent = `(${x},${y})`;
};

//
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
  let cv = document.querySelector('#cv01');

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

function facil(){
  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d'),
      r = 3,
      dim = cv.width / 3;

  ctx.beginPath();
  ctx.lineWidht = 2;
  ctx.strokeStyle = '#a00';

  for(let i=0; i<r; i++){
    //líneas verticales
    ctx.moveTo(i * dim, 0);
    ctx.lineTo(i * dim, cv.height);

    //líneas horizontales
    ctx.moveTo(0, i * dim);
    ctx.lineTo(cv.height, i * dim);
  }
  ctx.stroke();
}

function media(){
  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d'),
      r = 6,
      dim = cv.width / 6;

  ctx.beginPath();
  ctx.lineWidht = 2;
  ctx.strokeStyle = '#a00';

  for(let i=0; i<r; i++){
    //líneas verticales
    ctx.moveTo(i * dim, 0);
    ctx.lineTo(i * dim, cv.height);

    //líneas horizontales
    ctx.moveTo(0, i * dim);
    ctx.lineTo(cv.height, i * dim);
  }
  ctx.stroke();
}

function dificil(){
  let cv = document.querySelector('#cv02'),
      ctx = cv.getContext('2d'),
      r = 12,
      dim = cv.width / 12;

  ctx.beginPath();
  ctx.lineWidht = 2;
  ctx.strokeStyle = '#a00';

  for(let i=0; i<r; i++){
    //líneas verticales
    ctx.moveTo(i * dim, 0);
    ctx.lineTo(i * dim, cv.height);

    //líneas horizontales
    ctx.moveTo(0, i * dim);
    ctx.lineTo(cv.height, i * dim);
  }
  ctx.stroke();
}
