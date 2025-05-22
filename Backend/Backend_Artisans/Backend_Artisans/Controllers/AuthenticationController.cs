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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly Authentication.AuthenticationService _authenticationService;
        //migration test
        
        private readonly IService _service;

        public AuthenticationController(ILogger<AuthenticationController> logger,Authentication.AuthenticationService authenticationService,IService service)
        {
            _logger = logger;
            _authenticationService = authenticationService;
            _service = service;
        }


        [HttpPost("Register")]
        [AllowAnonymous]
        public void Register(int id,string login, string password,string role,bool statut)
        {

            _authenticationService.RegisterUser(login, password,role);
        }

        [HttpGet("GetUsers")]
        [AllowAnonymous]
        public IEnumerable<User> GetUsers()
        {
            
            //migration test
            return _service.GetUsers();
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public ActionResult Login(string login, string password)
        {

            var token = _authenticationService.Login(login, password);
            return Ok(new { Token = token });
        }


        [HttpPut("UpdateUserStatus/{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult UpdateUserStatus(int id)
        {
            try
            {
                _service.SetUserStatus(id,true);
                return Ok(new { message = "statut changed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }


        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult DeleteUser(int id)
        {
            _service.DeleteUser(id);
            return Ok(new { message = $"User Id : {id} has been deleted." });
        }




    }
}
