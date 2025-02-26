using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Produit
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public decimal Prix { get; set; }
        public string Categorie { get; set; }
        public string ImageUrl { get; set; }
        public int Quantite { get; set; }

        // Relation avec Artisan
        public int ArtisanId { get; set; }
        public Artisan Artisan { get; set; }

        // Relation avec CommandesProduits
        public ICollection<CommandeProduit> CommandesProduits { get; set; } = new List<CommandeProduit>();

        // Relation avec Avis
        public ICollection<Avis> Avis { get; set; } = new List<Avis>();
    }
}
