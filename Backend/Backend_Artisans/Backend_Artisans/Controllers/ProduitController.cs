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

                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

        //get products by artisan name
        [HttpGet("getProductsByArtisanName")]
        public ActionResult GetProductsByArtisanName(string artisanName)
        {
            try
            {
                var produits = _service.GetProductsByArtisanName(artisanName);
                return Ok(produits);
            }
            catch (Exception ex)
            {
                // Log l'erreur (optionnel)
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

        //change status
        [HttpPut("changeStatus")]
        public ActionResult changeProductStatus(int id)
        {
            _service.changeProductStatus(id);
            return Ok(new { message = "statut changed" });
        }

        // Delete product
        [HttpDelete("deleteProduct")]
        public ActionResult deleteProduct(int id)
        {
            _service.deleteProduct(id);
            return Ok(new { message = $"{id} : deleted" });
        }
        // addProduct
        [HttpPost("AddProduct")]

        public ActionResult addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)

        {
            _service.addProduct(nom, description, prix, categorie, image, quantite, artisan, statut);
            return Ok(new { message = "product added" });
        }

        //updateProduct

        [HttpPut("UpdateProduct")]
        public IActionResult UpdateProduct(
            int id,
            string nom,
            string description,
            double prix,
            string categorie,
            string image,
            int quantite
           )
        {
            _service.updateProduct(id, nom, description, prix, categorie, image, quantite);
            return Ok();
        }

        //update Quantity 

        [HttpPut ("updateQuantity")]

        public ActionResult updateQuantity(int id, int nouvelleQuantite)
        {
            _service.UpdateProductQuantity(id,nouvelleQuantite);

            return Ok(new {message = "quantité mise à jour"});
        }
    }
}