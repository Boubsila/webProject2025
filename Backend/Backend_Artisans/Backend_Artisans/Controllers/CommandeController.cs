using Business;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;

namespace Backend_Artisans.Controllers
{
    [Authorize] // nécessite une authentification pour accéder aux méthodes du contrôleur
    [Route("api/[controller]")] // définit le préfixe de route pour ce contrôleur
    [ApiController] // indique qu'il s'agit d'un contrôleur d'API
    public class CommandeController : ControllerBase
    {
        private readonly IService _service; // service métier injecté

        public CommandeController(IService service)
        {
            _service = service; // injection du service
        }

        [HttpGet("GetOrder")]
        public ActionResult GetOrder()
        {
            try
            {
                var commandes = _service.GetCommandeList();

                if (commandes == null || !commandes.Any())
                {
                    return NotFound(); // 404 : aucune commande
                }

                return Ok(commandes); // 200 : commandes trouvées
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }






        [HttpPost("addOrder")]
        public ActionResult AddCommande([FromBody] Commande commande)
        {
            if (commande == null)
            {
                return BadRequest(); // 400 : commande invalide
            }

            try
            {
                _service.AddCommande(commande);
                return Ok(); // 200 : ajout réussi
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }






        [HttpPut("updateOrder/{id}")]
        public IActionResult UpdateCommande(int id, [FromBody] Commande updatedCommande)
        {
            if (updatedCommande == null)
            {
                return BadRequest(); // 400 : données manquantes
            }

            try
            {
                _service.UpdateCommande(
                    id,
                    updatedCommande.statut,
                    updatedCommande.isOrderd,
                    updatedCommande.numeroCommande,
                    updatedCommande.quantite,
                    updatedCommande.adresseLivraison,
                    updatedCommande.dateLivraison
                    

                   
                );

                return Ok(); // 200 : mise à jour réussie
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande introuvable
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }




        [HttpDelete("Delete/{orderNumber}")]
        public ActionResult DeleteOrder(string orderNumber)
        {
            try
            {
                _service.DeleteCommande(orderNumber);
                return Ok(); // 200 : suppression réussie
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande introuvable
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }

        [HttpDelete("DeleteCart/{id}")]
        public ActionResult DeleteOrder(int id)
        {
            try
            {
                _service.DeleteCommandeCart(id);
                return Ok(); // 200 : suppression réussie
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande introuvable
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }




        [HttpGet("GetCommandesByArtisan/{artisanName}")]
        public IActionResult GetCommandesByArtisan(string artisanName)
        {
            try
            {
                var commandes = _service.GetCommandesByArtisanName(artisanName);

                if (commandes == null || commandes.Count == 0)
                {
                    return NotFound(); // 404 : aucune commande pour cet artisan
                }

                return Ok(commandes); // 200 : données disponibles
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }






        [HttpPut("ChangeOrderStatus/{numeroCommande}/{nouveauStatut}")]
        public ActionResult ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            try
            {
                _service.ChangeOrderStatus(numeroCommande, nouveauStatut);
                return Ok(); // 200 : statut modifié
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande non trouvée
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }






        [HttpPut("Pickup/{nmOrder}/{adres}/{livreur}")]
        public ActionResult pickup(string nmOrder, string adres, string livreur)
        {
            try
            {
                _service.addPickupAdres(nmOrder, adres, livreur);
                return Ok(); // 200 : adresse de pickup ajoutée
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande non trouvée
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }




        [HttpPut("ChangeCommandeStatut/{numeroCommande}/{artisanName}/{nouveauStatut}")]
        public IActionResult ChangeCommandeStatut(string numeroCommande, string artisanName, string nouveauStatut)
        {
            try
            {
                _service.ChangeCommandeStatusByProductAndArtisan(numeroCommande, artisanName, nouveauStatut);
                return Ok(); // 200 : statut mis à jour
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : commande ou produit/artisan introuvable
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : erreur serveur
            }
        }

    }
}
