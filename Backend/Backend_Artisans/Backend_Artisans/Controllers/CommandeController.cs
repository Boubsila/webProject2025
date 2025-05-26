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
        public IActionResult GetOrder()
        {
            try
            {
                var commandes = _service.GetCommandeList(); // récupère la liste des commandes
                return Ok(commandes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur."); // erreur serveur
            }
        }

        [HttpPost("addOrder")]
        public IActionResult AddCommande([FromBody] Commande commande)
        {
            try
            {
                _service.AddCommande(commande); // ajoute une nouvelle commande
                return Ok(new { message = "Commande ajoutée avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur."); // erreur serveur
            }
        }

        [HttpPut("updateOrder/{id}")]
        public IActionResult UpdateCommande(int id, [FromBody] Commande updatedCommande)
        {
            try
            {
                // met à jour les champs principaux d'une commande
                _service.UpdateCommande(
                    id,
                    updatedCommande.statut,
                    updatedCommande.isOrderd,
                    updatedCommande.numeroCommande,
                    updatedCommande.adresseLivraison,
                    updatedCommande.dateLivraison
                );

                return Ok(new { message = "Commande mise à jour avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur lors de la mise à jour de la commande."); // erreur serveur
            }
        }

        //[HttpPut("updateOrder/{id}")]
        // Code alternatif de mise à jour complète d'une commande (commenté)

        [HttpDelete("Delete/{id}")]
        public ActionResult DeleteOrder(int id)
        {
            _service.DeleteCommande(id); // supprime une commande via son ID
            return Ok();
        }

        [HttpGet("GetCommandesByArtisan/{artisanName}")]
        public IActionResult GetCommandesByArtisan(string artisanName)
        {
            try
            {
                // récupère les commandes liées à un artisan
                var commandes = _service.GetCommandesByArtisanName(artisanName);

                if (commandes == null || commandes.Count == 0)
                {
                    return NotFound(new { message = "Aucune commande trouvée pour cet artisan." });
                }

                return Ok(commandes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur."); // erreur serveur
            }
        }

        // mettre à jour le statut d'une commande
        [HttpPut("ChangeOrderStatus/{numeroCommande}/{nouveauStatut}")]
        public ActionResult ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            try
            {
                _service.ChangeOrderStatus(numeroCommande, nouveauStatut); // met à jour le statut global d'une commande
                return Ok(new { message = $"Statut de la commande '{numeroCommande}' mis à jour avec succès à '{nouveauStatut}'." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur lors de la mise à jour du statut de la commande '{numeroCommande}'.");
            }
        }

        [HttpPut("Pickup/{nmOrder}/{adres}/{livreur}")]
        public ActionResult pickup(string nmOrder, string adres, string livreur)
        {
            _service.addPickupAdres(nmOrder, adres, livreur); // ajoute une adresse de ramassage à une commande

            return Ok(200);
        }

        // mise à jour du statut d'une commande spécifique à un artisan
        [HttpPut("ChangeCommandeStatut/{numeroCommande}/{artisanName}/{nouveauStatut}")]
        public IActionResult ChangeCommandeStatut(string numeroCommande, string artisanName, string nouveauStatut)
        {
            _service.ChangeCommandeStatusByProductAndArtisan(numeroCommande, artisanName, nouveauStatut); // met à jour un statut spécifique par artisan
            return Ok();
        }
    }
}
