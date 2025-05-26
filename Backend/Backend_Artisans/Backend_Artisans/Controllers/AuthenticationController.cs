using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend_Artisans.Authentication;
using Data;
//migration test
using Domain;
using Business;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")] // définit le préfixe de route pour ce contrôleur
    [ApiController] // indique qu'il s'agit d'un contrôleur d'API
    [Authorize] // nécessite une authentification par défaut
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger; // pour les logs
        private readonly Authentication.AuthenticationService _authenticationService; // service d'authentification
        //migration test
        private readonly IService _service; // service métier pour gestion des utilisateurs

        // constructeur qui injecte les dépendances
        public AuthenticationController(ILogger<AuthenticationController> logger, Authentication.AuthenticationService authenticationService, IService service)
        {
            _logger = logger;
            _authenticationService = authenticationService;
            _service = service;
        }

        [HttpPost("Register")]
        [AllowAnonymous] // cette action est accessible sans authentification
        public void Register(int id, string login, string password, string role, bool statut)
        {
            _authenticationService.RegisterUser(login, password, role); // enregistre un nouvel utilisateur
        }

        [HttpGet("GetUsers")]
        [AllowAnonymous] // cette action est accessible sans authentification
        public IEnumerable<User> GetUsers()
        {
            //migration test
            return _service.GetUsers(); // retourne tous les utilisateurs
        }

        [HttpPost("Login")]
        [AllowAnonymous] // cette action est accessible sans authentification
        public ActionResult Login(string login, string password)
        {
            var token = _authenticationService.Login(login, password); // génère un token JWT si login réussi
            return Ok(new { Token = token }); // retourne le token dans la réponse
        }

        [HttpPut("UpdateUserStatus/{id}")]
        [Authorize(Roles = "Admin")] // seul un Admin peut modifier le statut d'un utilisateur
        public ActionResult UpdateUserStatus(int id)
        {
            try
            {
                _service.SetUserStatus(id, true); // active l'utilisateur (Statut = true)
                return Ok(new { message = "statut changed" }); // message de succès
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status."); // enregistre l'erreur
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message }); // retourne une erreur 500
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin")] // seul un Admin peut supprimer un utilisateur
        public ActionResult DeleteUser(int id)
        {
            _service.DeleteUser(id); // supprime l'utilisateur par ID
            return Ok(new { message = $"User Id : {id} has been deleted." }); // message de confirmation
        }
    }
}
