using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Business;
using Microsoft.AspNetCore.Authorization;

namespace Backend_Artisans.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class livraisonController : ControllerBase
{
    private readonly IService _service;

    public livraisonController(IService service)
    {
        _service = service;
    }


    [Authorize(Roles ="Admin")] 
    [HttpGet]
    public ActionResult GetLivraison()
    {
       
        return Ok(_service.GetLivraisons());
    }
}
