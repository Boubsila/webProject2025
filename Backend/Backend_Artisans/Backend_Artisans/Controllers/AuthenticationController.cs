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


        //*********************************************************************************

        [HttpPost("Register")]
        [AllowAnonymous]
        public IActionResult Register(int id, string login, string password, string role, bool statut)
        {
            try
            {
                _authenticationService.RegisterUser(login, password, role);
                return StatusCode(201); // Created
            }
            catch (Exception)
            {
                return Conflict(); // 409 - Conflit : utilisateur déjà existant,
            }
        }


        [HttpGet("GetUsers")]
        [AllowAnonymous]
        public IActionResult GetUsers()
        {
            var users = _service.GetUsers();
            return Ok(users); // 200
        }




        [HttpPost("Login")]
        [AllowAnonymous]
        public IActionResult Login(string login, string password)
        {
            try
            {
                var token = _authenticationService.Login(login, password);
                return Ok(new { token }); // 200
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(); // 401 - Accès refusé
            }
            catch (Exception)
            {
                return BadRequest(); // 400 - Erreur générale
               
            }
        }


        [HttpPut("UpdateUserStatus/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateUserStatus(int id)
        {
            try
            {
                _service.SetUserStatus(id, true);
                return NoContent(); // 204 - Modification réussie, 
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 - Utilisateur non trouvé
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 - Erreur interne
            }
        }






        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                _service.DeleteUser(id);
                return NoContent(); // 204
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404
            }
            catch (Exception)
            {
                return StatusCode(500); // 500
            }
        }





    }
}
