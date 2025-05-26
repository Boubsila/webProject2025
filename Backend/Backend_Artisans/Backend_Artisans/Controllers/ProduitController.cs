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
        //[Authorize(Roles ="Admin,Client")]
        public IActionResult GetAllProducts()
        {
            try
            {
                var produits = _service.getAllProducts(); // récupère tous les produits
                return Ok(produits);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur."); // erreur serveur
            }
        }

        // obtenir les produits par nom d'artisan
        [HttpGet("getProductsByArtisanName")]
        public ActionResult GetProductsByArtisanName(string artisanName)
        {
            try
            {
                var produits = _service.GetProductsByArtisanName(artisanName); // récupère les produits d'un artisan donné
                return Ok(produits);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur."); // erreur serveur
            }
        }

        // changer le statut d'un produit
        [HttpPut("changeStatus")]
        public ActionResult changeProductStatus(int id)
        {
            _service.changeProductStatus(id); // change le statut d'un produit (actif/inactif)
            return Ok(new { message = "statut changed" });
        }

        // supprimer un produit
        [HttpDelete("deleteProduct")]
        public ActionResult deleteProduct(int id)
        {
            _service.deleteProduct(id); // supprime un produit via son ID
            return Ok(new { message = $"{id} : deleted" });
        }

        // ajouter un produit
        [HttpPost("AddProduct")]
        public ActionResult addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            _service.addProduct(nom, description, prix, categorie, image, quantite, artisan, statut); // ajoute un nouveau produit
            return Ok(new { message = "product added" });
        }

        // mettre à jour un produit
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
            _service.updateProduct(id, nom, description, prix, categorie, image, quantite); // met à jour les détails d'un produit
            return Ok();
        }

        // mettre à jour la quantité d'un produit
        [HttpPut("updateQuantity")]
        public ActionResult updateQuantity(int id, int nouvelleQuantite)
        {
            _service.UpdateProductQuantity(id, nouvelleQuantite); // met à jour la quantité disponible d'un produit

            return Ok(new { message = "quantité mise à jour" });
        }
    }
}
