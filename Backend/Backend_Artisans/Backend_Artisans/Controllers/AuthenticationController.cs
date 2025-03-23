using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend_Artisans.Authentication;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly Authentication.AuthenticationService _authenticationService;

        public AuthenticationController(ILogger<AuthenticationController> logger,Authentication.AuthenticationService authenticationService)
        {
            _logger = logger;
            _authenticationService = authenticationService;
        }


        [HttpPost("Register")]
        [AllowAnonymous]
        public void Register(int id,string login, string password,string role,bool statut)
        {

            _authenticationService.RegisterUser(login, password,role);
        }

        [HttpGet]
        [AllowAnonymous]
        public List<User> GetUsers()
        {
            return _authenticationService.GetUsers();
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public ActionResult Login(string login, string password)
        {

            var token = _authenticationService.Login(login, password);
            return Ok(new { Token = token });
        }


        [HttpPut("Users/{id}")]
        [Authorize(Roles = "Admin")] 
        public ActionResult UpdateUserStatus(int id)
        {
            try
            {
                var users = _authenticationService.GetUsers();
                var user = users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }

                user.Statut = true;



                return Ok(new { message = "statut changed" }); // Renvoie un objet JSON
            
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the user status." }); // Renvoie un objet JSON
            }
        }



    }
}
