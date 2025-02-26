using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class CommandeProduit
    {
        public int Id { get; set; }

        // Clés étrangères
        public int CommandeId { get; set; }
        public Commande Commande { get; set; }

        public int ProduitId { get; set; }
        public Produit Produit { get; set; }

        public int Quantite { get; set; }
    }
}
