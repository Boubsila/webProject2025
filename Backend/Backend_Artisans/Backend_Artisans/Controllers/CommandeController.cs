using Business;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommandeController : ControllerBase
    {
        private readonly IService _service;

        public CommandeController(IService service)
        {
            _service = service;
        }

        [HttpGet("GetOrder")]
        public IActionResult GetOrder()
        {
            try
            {
                var commandes = _service.GetCommandeList();
                return Ok(commandes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

        [HttpPost("addOrder")]
        public IActionResult AddCommande([FromBody] Commande commande)
        {
            try
            {
                _service.AddCommande(commande);
                return Ok(new { message = "Commande ajoutée avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

 

        [HttpPut("updateOrder/{id}")]
        public IActionResult UpdateCommande(int id, [FromBody] Commande updatedCommande)
        {
            var commande = _service.GetCommandeList().FirstOrDefault(c => c.Id == id);

            if (commande == null)
                return NotFound();

            // Mise à jour des champs
            commande.numeroCommande = updatedCommande.numeroCommande ?? commande.numeroCommande;
            commande.produitId = updatedCommande.produitId;
            commande.produitName = updatedCommande.produitName;
            commande.artisanName = updatedCommande.artisanName;
            commande.clientName = updatedCommande.clientName;
            commande.livreurName = updatedCommande.livreurName;
            commande.dateCommande = updatedCommande.dateCommande ?? commande.dateCommande;
            commande.statut = updatedCommande.statut ?? commande.statut;
            commande.isOrderd = updatedCommande.isOrderd;
            commande.quantite = updatedCommande.quantite;
            commande.prix = updatedCommande.prix;
            commande.adresseLivraison = updatedCommande.adresseLivraison ?? commande.adresseLivraison;
            commande.dateLivraison = updatedCommande.dateLivraison ?? commande.dateLivraison;

            return Ok(commande); // ou NoContent()
        }

        [HttpDelete("Delete/{id}")]

        public ActionResult DeleteOrder(int id)
        {
            _service.DeleteCommande(id);
            return Ok();
        }


        [HttpGet("GetCommandesByArtisan/{artisanName}")]
        public IActionResult GetCommandesByArtisan(string artisanName)
        {
            try
            {
                // Appel au service pour récupérer les commandes de l'artisan
                var commandes = _service.GetCommandesByArtisanName(artisanName);

                if (commandes == null || commandes.Count == 0)
                {
                    return NotFound(new { message = "Aucune commande trouvée pour cet artisan." });
                }

                return Ok(commandes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }

        //update order status 

        [HttpPut("ChangeOrderStatus/{numeroCommande}/{nouveauStatut}")]
        public ActionResult ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            try
            {
                _service.ChangeOrderStatus(numeroCommande, nouveauStatut);
                return Ok(new { message = $"Statut de la commande '{numeroCommande}' mis à jour avec succès à '{nouveauStatut}'." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur lors de la mise à jour du statut de la commande '{numeroCommande}'.");
            }
        }

        [HttpPut("Pickup/{nmOrder}/{adres}")]

        public ActionResult pickup(string nmOrder, string adres)
        {
            _service.addPickupAdres(nmOrder, adres);

            return Ok(200);
        }

        // update status order multi artisan 

        [HttpPut("ChangeCommandeStatut/{numeroCommande}/{artisanName}/{nouveauStatut}")]
        public IActionResult ChangeCommandeStatut(string numeroCommande, string artisanName, string nouveauStatut)
        {
            _service.ChangeCommandeStatusByProductAndArtisan(numeroCommande, artisanName, nouveauStatut);
            return Ok();
        }


    }
}