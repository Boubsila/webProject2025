using Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Artisans.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IService _service;

        public StatisticsController(IService service)
        {
            _service = service;
        }


        [HttpGet("statisticsAllUsers")]
        public int GetAllUsersCount()
        {
            int count = _service.GetUsers().Count;
            return count;
        }

        [HttpGet("statisticsUsers/byRole")]
        public int GetAllUsersCount(string role)
        {
            int count = _service.GetUsers().Count(x=>x.Role.ToLower() ==role.ToLower()&& x.Statut==true);
            return count;
        }
    }
}
