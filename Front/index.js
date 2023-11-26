 // Accede a la cámara web
 navigator.mediaDevices.getUserMedia({ video: true })
 .then(function(stream) {
   var video = document.getElementById('webcam');
   video.srcObject = stream;
 })
 .catch(function(error) {
   console.log('Error al acceder a la cámara: ' + error);
 });


var capturarBoton = document.getElementById('capturar');
      capturarBoton.addEventListener('click', function() {
        var video = document.getElementById('webcam');
        var canvas = document.getElementById('lienzo');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var fotoURL = canvas.toDataURL('image/png');
        // Aquí puedes enviar fotoURL al servidor si es necesario
      });