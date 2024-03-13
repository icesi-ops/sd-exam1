using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Firebase.Storage;
using Firebase.Auth;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

namespace backend_library_app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly string _firebaseStorageUrl = "library-app-d3e16.appspot.com"; // URL de Firebase Storage



        // GET: api/Image/{fileName}
        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetImage(string fileName)
        {
            try
            {
                var firebaseStorage = new FirebaseStorage(_firebaseStorageUrl);
                var downloadUrl = await firebaseStorage.Child("images").Child(fileName).GetDownloadUrlAsync();

                // Descarga el archivo desde Firebase Storage usando la URL de descarga
                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetAsync(downloadUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        var stream = await response.Content.ReadAsStreamAsync();
                        return File(stream, "image/jpeg"); // Cambiar el tipo MIME según el tipo de imagen
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error obteniendo (GET) imagen: " + ex.ToString());
                return StatusCode(500, $"Error al obtener la imagen: {ex.Message}");
            }
        }

        // POST: api/Image
        [HttpPost]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Archivo no proporcionado");
                }

                string downloadUrl = await SubirStorage(file.OpenReadStream(), file.FileName);

                // Guarda la URL de la imagen en tu base de datos si es necesario

                return Ok(downloadUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error subiendo imagen: " + ex.ToString());
                return StatusCode(500, $"Error al subir la imagen: {ex.Message}");
            }
        }

        // PUT: api/Image/{fileName}
        [HttpPut("{fileName}")]
        public async Task<IActionResult> UpdateImage(string fileName, [FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Archivo no proporcionado");
                }

                await EliminarStorage(fileName);
                string downloadUrl = await SubirStorage(file.OpenReadStream(), file.FileName);

                // Guarda la URL de la imagen en tu base de datos si es necesario

                return Ok(downloadUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error actualizando (PUT) imagen: " + ex.ToString());
                return StatusCode(500, $"Error al actualizar la imagen: {ex.Message}");
            }
        }

        // DELETE: api/Image/{fileName}
        [HttpDelete("{fileName}")]
        public async Task<IActionResult> DeleteImage(string fileName)
        {
            try
            {
                await EliminarStorage(fileName);

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error eliminando (DELETE) imagen: " + ex.ToString());
                return StatusCode(500, $"Error al eliminar la imagen: {ex.Message}");
            }
        }

        private async Task<string> SubirStorage(Stream archivo, string nombre)
        {
            // Ingresa aquí tus propias credenciales y la ruta de Firebase Storage
            string email = "santicoguvi@gmail.com";
            string clave = "password1";
            string ruta = _firebaseStorageUrl;
            string api_key = "AIzaSyD7-NYaDEUu736Dady5IbUzOo99uRc6Ha0";

            var auth = new FirebaseAuthProvider(new FirebaseConfig(api_key));
            var a = await auth.SignInWithEmailAndPasswordAsync(email, clave);

            var cancellation = new CancellationTokenSource();

            var task = new FirebaseStorage(
                ruta,
                new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                    ThrowOnCancel = true
                })
                .Child("images")
                .Child(nombre)
                .PutAsync(archivo, cancellation.Token);

            var downloadURL = await task;

            return downloadURL;
        }

        private async Task EliminarStorage(string imageUrl)
        {
            // Ingresa aquí tus propias credenciales y la ruta de Firebase Storage
            string email = "santicoguvi@gmail.com";
            string clave = "password1";
            string ruta = _firebaseStorageUrl;
            string api_key = "AIzaSyD7-NYaDEUu736Dady5IbUzOo99uRc6Ha0";

            var auth = new FirebaseAuthProvider(new FirebaseConfig(api_key));
            var a = await auth.SignInWithEmailAndPasswordAsync(email, clave);

            var firebaseStorage = new FirebaseStorage(
                ruta,
                new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                    ThrowOnCancel = true
                });

            // Extraer el nombre de la imagen de la URL
       

            // Eliminar el archivo utilizando la ruta en el almacenamiento de Firebase
            await firebaseStorage.Child("images").Child(imageUrl).DeleteAsync();
        }


    }
}
