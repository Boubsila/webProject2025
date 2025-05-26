using Business;
using Domain;
using Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;
using System.Globalization;

namespace Backend_Artisans.Controllers
{
    [Authorize] // nécessite une authentification pour accéder à ce contrôleur
    [Route("api/[controller]")] // définit le préfixe de route pour ce contrôleur
    [ApiController] // indique qu'il s'agit d'un contrôleur d'API
    public class AvisController : ControllerBase
    {
        private readonly IService _service; // service métier injecté

        // constructeur avec injection de dépendance
        public AvisController(IService service)
        {
            _service = service;
        }

        // Récupérer les avis liés à un artisan
        [HttpGet("GetComent")]
        public ActionResult<List<Avis>> GetAvis(string ORD, string produitName)
        {
            var avis = _service.GetComent(ORD, produitName); // récupère les avis pour un produit et une commande donnés
            return Ok(avis); // retourne les avis avec statut 200
        }

        [HttpPost("AjouterAvis")]
        public ActionResult AjouterAvis([FromBody] Avis avis)
        {
            if (avis == null)
            {
                return BadRequest("L'avis ne peut pas être null"); // vérifie que l'avis n'est pas null
            }

            try
            {
                _service.AjouterAvis(avis); // ajoute l'avis via le service
                return Ok(new { message = "Avis ajouté avec succès" }); // message de confirmation
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message }); // erreur liée à une mauvaise saisie
            }
            catch (Exception ex)
            {
                // Log l'exception ici
                return StatusCode(500, new { error = "Erreur interne" }); // erreur serveur
            }
        }

        [HttpGet("GetNote")]
        public ActionResult<int> GetNote(string ORD, string produitName)
        {
            var note = _service.GetNote(ORD, produitName); // récupère la note globale pour un produit et une commande
            return Ok(note); // retourne la note avec statut 200
        }

        [HttpPost("ajouterCommentaire")]
        public ActionResult ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            _service.ajouterCommentaire(ORD, produitName, commentaire); // ajoute un commentaire à un avis
            return Ok(new { message = "commentaire ajouté avec succès" }); // message de confirmation
        }
    }
}
