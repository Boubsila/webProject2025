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




        [HttpGet("GetComent")]
        public ActionResult<List<Avis>> GetAvis(string ORD, string produitName)
        {
            try
            {
                var avis = _service.GetComent(ORD, produitName);

                if (avis == null || avis.Count == 0)
                {
                    return NotFound(); // 404 : Aucun avis trouvé
                }

                return Ok(avis); // 200 : Avis trouvés
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : Erreur interne
            }
        }








        [HttpPost("AjouterAvis")]
        public ActionResult AjouterAvis([FromBody] Avis avis)
        {
            if (avis == null)
            {
                return BadRequest(); // 400 : Mauvaise requête
            }

            try
            {
                _service.AjouterAvis(avis);
                return Ok(); // 200 : Avis ajouté
            }
            catch (ArgumentException)
            {
                return BadRequest(); // 400 : Données invalides
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : Erreur interne
            }
        }








        [HttpGet("GetNote")]
        public ActionResult<int> GetNote(string ORD, string produitName)
        {
            try
            {
                var note = _service.GetNote(ORD, produitName);

                if (note < 0)
                {
                    return NotFound(); // 404 : Note non trouvée
                }

                return Ok(note); // 200 : Note retournée
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : Erreur serveur
            }
        }








        [HttpPost("ajouterCommentaire")]
        public ActionResult ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            if (string.IsNullOrWhiteSpace(commentaire))
            {
                return BadRequest(); // 400 : Commentaire vide
            }

            try
            {
                _service.ajouterCommentaire(ORD, produitName, commentaire);
                return Ok(); // 200 : Commentaire ajouté
            }
            catch (KeyNotFoundException)
            {
                return NotFound(); // 404 : Produit ou commande non trouvés
            }
            catch (Exception)
            {
                return StatusCode(500); // 500 : Erreur serveur
            }
        }

    }
}
