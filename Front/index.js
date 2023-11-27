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
  // Aquí puedes enviar fotoURL al servidor si es necesario
  // Aquí puedes convertir el archivo de texto a base64 (por ejemplo, "prueba" a base64)
  // var archivoTexto = "prueba";
  // var archivoBase64 = btoa(archivoTexto);

  // // Enviar el archivo al backend
  // fetch('http://image_app:8083/image', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ archivoBase64 }),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Respuesta del backend:', data);
  //   })
  //   .catch(error => {
  //     console.error('Error al enviar archivo al backend:', error);
  //   });
  

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
  // // Simular otro archivo de texto para la prueba
  // var otroArchivoTexto = "prueba para otro botón";
  // var otroArchivoBase64 = btoa(otroArchivoTexto);

  // // Enviar el otro archivo al backend
  // fetch('http://localhost:8083/image', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ archivoBase64: otroArchivoBase64 }),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Respuesta del backend (pruebaBoton):', data);
  //   })
  //   .catch(error => {
  //     console.error('Error al enviar archivo al backend (pruebaBoton):', error);
  //   });
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