// Accede a la cámara web
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    var video = document.getElementById('webcam');
    video.srcObject = stream;
  })
  .catch(function (error) {
    console.log('Error al acceder a la cámara: ' + error);
  });


var capturarBoton = document.getElementById('capturar');
capturarBoton.addEventListener('click', function () {
  var video = document.getElementById('webcam');
  var canvas = document.getElementById('lienzo');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  var fotoURL = canvas.toDataURL('image/png');
  var fotobase64 = fotoURL.split(',')[1];
  enviarImagenAlBackend(fotobase64)


});

document.getElementById('pruebaBoton').addEventListener('click', function () {
  // URL de la imagen de ejemplo
  var urlImagen = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';

  // Obtener la imagen desde la URL y convertirla a base64
  fetch(urlImagen)
    .then(response => response.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Obtener solo la parte base64
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
    .then(imagenBase64 => {
      // Enviar la imagen al backend
      enviarImagenAlBackend(imagenBase64);
    })
    .catch(error => {
      console.error('Error al cargar y convertir la imagen:', error);
    });
});

function enviarImagenAlBackend(imagenBase64) {
  fetch('http://localhost:8083/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imagenBase64 }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del backend:', data);
    })
    .catch(error => {
      console.error('Error al enviar imagen al backend:', error);
    });
}
function obtenerYMostrarImagenes() {
  fetch('http://localhost:8083/getimages')
    .then(response => response.json())
    .then(data => {
      // Obtener el elemento ul
      var listaFotos = document.getElementById('lista-fotos');

      // Crear un elemento li y un elemento img para cada imagen y añadirlo al DOM
      data.forEach(imagenBase64 => {
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = 'data:image/png;base64,' + imagenBase64;
        img.style.width = '400px'; // puedes ajustar esto a lo que necesites
        img.style.height = '400px'; // puedes ajustar esto a lo que necesites
        li.appendChild(img);
        listaFotos.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error al obtener imágenes del backend:', error);
    });
}

// Llamar a la función al cargar la página
window.addEventListener('load', obtenerYMostrarImagenes);
