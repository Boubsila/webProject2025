using Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Artisans.Controllers
{
    [Authorize] // Nécessite une authentification pour accéder aux méthodes de ce contrôleur
    [Route("api/[controller]")] // Définit le préfixe de route pour ce contrôleur
    [ApiController] // Spécifie qu’il s’agit d’un contrôleur d’API
    public class StatisticsController : ControllerBase
    {
        private readonly IService _service; // Injection du service métier

        public StatisticsController(IService service)
        {
            _service = service;
        }





        [HttpGet("statisticsAllUsers")]
        public ActionResult<int> GetAllUsersCount()
        {
            try
            {
                int count = _service.GetUsers().Count;
                return Ok(count); // 200 OK avec le nombre total
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 Internal Server Error sans message détaillé
            }
        }





        [HttpGet("statisticsUsers/byRole")]
        public ActionResult<int> GetAllUsersCount(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return BadRequest(); // 400 Bad Request si rôle vide ou null
            }

            try
            {
                int count = _service.GetUsers().Count(x => x.Role.ToLower() == role.ToLower() && x.Statut == true);
                return Ok(count); // 200 OK avec le nombre filtré
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 Internal Server Error
            }
        }




    }
}
