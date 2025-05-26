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

        // Récupère le nombre total d'utilisateurs
        [HttpGet("statisticsAllUsers")]
        public int GetAllUsersCount()
        {
            int count = _service.GetUsers().Count; // Compte tous les utilisateurs
            return count;
        }

        // Récupère le nombre d'utilisateurs ayant un rôle spécifique et un statut actif
        [HttpGet("statisticsUsers/byRole")]
        public int GetAllUsersCount(string role)
        {
            int count = _service.GetUsers().Count(x => x.Role.ToLower() == role.ToLower() && x.Statut == true);
            return count;
        }
    }
}
