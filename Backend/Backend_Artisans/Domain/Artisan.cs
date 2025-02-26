using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Artisan
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public string Adresse { get; set; }
        public string Phone { get; set; }

        // Relation avec User
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation avec Produits
        public ICollection<Produit> Produits { get; set; } = new List<Produit>();
    }
}
