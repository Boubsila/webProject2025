using Business;
using Domain;
using Domain.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;
using System.Globalization;

namespace Backend_Artisans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvisController : ControllerBase
    {
        private readonly IService _service;

        public AvisController(IService service)
        {
            _service = service;
        }

      

        // Récupérer les avis liés à un artisan
        [HttpGet("GetComent")]
        public ActionResult<List<Avis>> GetAvis(string ORD, string produitName)
        {
            var avis = _service.GetComent(ORD,produitName);
            return Ok(avis);
        }


       


        [HttpPost("AjouterAvis")]
        public ActionResult AjouterAvis([FromBody] Avis avis)
        {
            if (avis == null)
            {
                return BadRequest("L'avis ne peut pas être null");
            }

            try
            {
                _service.AjouterAvis(avis);
                return Ok(new { message = "Avis ajouté avec succès" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // Log l'exception ici
                return StatusCode(500, new { error = "Erreur interne" });
            }
        }

        [HttpGet("GetNote")]
        public ActionResult<int> GetNote(string ORD, string produitName)
        {
            var note = _service.GetNote(ORD, produitName);
            return Ok(note);
        }

        [HttpPost("ajouterCommentaire")]
        public ActionResult ajouterCommentaire(string ORD , string produitName, string commentaire)
        {
            _service.ajouterCommentaire(ORD, produitName, commentaire);
            return Ok(new {message=  "commentaire ajouté avec succès" });
        }
    }
}
