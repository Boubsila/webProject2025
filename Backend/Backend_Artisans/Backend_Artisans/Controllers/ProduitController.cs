using Business;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Artisans.Controllers
{
    [Authorize] // nécessite une authentification pour accéder aux méthodes du contrôleur
    [Route("api/[controller]")] // définit le préfixe de route pour ce contrôleur
    [ApiController] // indique qu'il s'agit d'un contrôleur d'API
    public class ProduitController : ControllerBase
    {
        private readonly IService _service; // service métier injecté

        public ProduitController(IService service)
        {
            _service = service; // injection du service
        }




        [HttpGet("getAllProducts")]
        public IActionResult GetAllProducts()
        {
            try
            {
                var produits = _service.getAllProducts();

                if (produits == null || !produits.Any())
                {
                    return NotFound(); // 404 : aucun produit
                }

                return Ok(produits); // 200 : produits retournés
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }







        [HttpGet("getProductsByArtisanName")]
        public ActionResult GetProductsByArtisanName(string artisanName)
        {
            try
            {
                var produits = _service.GetProductsByArtisanName(artisanName);

                if (produits == null || !produits.Any())
                {
                    return NotFound(); // 404 : aucun produit pour cet artisan
                }

                return Ok(produits); // 200
            }
            catch (Exception)
            {
                return StatusCode(500); // 500
            }
        }






        [HttpPut("changeStatus")]
        public ActionResult changeProductStatus(int id)
        {
            try
            {
                _service.changeProductStatus(id);
                return Ok(); // 200
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







        [HttpDelete("deleteProduct")]
        public ActionResult deleteProduct(int id)
        {
            try
            {
                _service.deleteProduct(id);
                return Ok(); // 200
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






        [HttpPost("AddProduct")]
        public ActionResult addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            try
            {
                _service.addProduct(nom, description, prix, categorie, image, quantite, artisan, statut);
                return Ok(); // 200
            }
            catch (ArgumentException)
            {
                return BadRequest(); // 400 : données invalides
            }
            catch (Exception)
            {
                return StatusCode(500); // 500
            }
        }





        [HttpPut("UpdateProduct")]
        public IActionResult UpdateProduct(
             int id,
             string nom,
             string description,
             double prix,
             string categorie,
             string image,
             int quantite)
        {
            try
            {
                _service.updateProduct(id, nom, description, prix, categorie, image, quantite);
                return Ok(); // 200
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




        [HttpPut("updateQuantity")]
        public ActionResult updateQuantity(int id, int nouvelleQuantite)
        {
            try
            {
                _service.UpdateProductQuantity(id, nouvelleQuantite);
                return Ok(); // 200
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
