using Business;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduitController : ControllerBase
    {
        private readonly IService _service;

        public ProduitController(IService service)
        {
            _service = service;
        }

        [HttpGet("getAllProducts")]
        //[Authorize(Roles ="Admin,Client")] 
        public IActionResult GetAllProducts()
        {
            try
            {
                var produits = _service.getAllProducts();
                return Ok(produits);
            }
            catch (Exception ex)
            {
                // Log l'erreur (optionnel)
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

        [HttpPut("changeStatus")]
        public ActionResult changeProductStatus(int id)
        {
            _service.changeProductStatus(id);
            return Ok(new { message = "statut changed" });
        }

        [HttpDelete("deleteProduct")]
        public ActionResult deleteProduct(int id)
        {
            _service.deleteProduct(id);
            return Ok(new { message = $"{id} : deleted" });
        }

    }
}