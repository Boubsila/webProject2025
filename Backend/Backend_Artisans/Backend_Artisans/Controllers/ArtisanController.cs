using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtisanController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello from Artisan Controller");
        }

        [HttpPost]
        public IActionResult Post()
        {
            return Ok("Hello from Artisan Controller");
        }
    }
}
