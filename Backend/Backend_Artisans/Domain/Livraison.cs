using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Livraison
    {
        public int Id { get; set; }
        public int CommandeId { get; set; }
        public Commande Commande { get; set; }

        public int PartenaireId { get; set; }
        public PartenaireLivraison Partenaire { get; set; }

        public string Statut { get; set; } = "En attente";
        public string DateEnlevement { get; set; }
    }
}
