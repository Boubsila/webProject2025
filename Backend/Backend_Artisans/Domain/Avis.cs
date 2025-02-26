using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Avis
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; }

        public int ProduitId { get; set; }
        public Produit Produit { get; set; }

        public int Note { get; set; } // De 1 à 5
        public string Commentaire { get; set; }
        public string DateAvis { get; set; }
    }
}
