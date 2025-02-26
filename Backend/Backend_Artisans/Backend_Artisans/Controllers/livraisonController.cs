using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Business;

namespace Backend_Artisans.Controllers;

[ApiController]
[Route("api/[controller]")]

public class livraisonController : ControllerBase
{
    private readonly IService _service;

    public livraisonController(IService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult GetLivraison()
    {
       
        return Ok(_service.GetLivraisons());
    }
}
