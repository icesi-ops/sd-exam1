using Microsoft.AspNetCore.Mvc;

namespace backend_library_app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        // GET: api/Health
        [HttpGet]
        public IActionResult CheckHealth()
        {
            // Puedes personalizar la respuesta según lo que necesites
            // Aquí, simplemente devolvemos un código de estado 200 OK
            return Ok("Healthy :)");
        }
    }
}
