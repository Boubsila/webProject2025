using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Commande
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; }
        public string DateCommande { get; set; }
        public decimal Total { get; set; }
        public string Statut { get; set; } = "En attente";

        // Relation avec Produits (table de jointure)
        public ICollection<CommandeProduit> CommandesProduits { get; set; } = new List<CommandeProduit>();

        // Relation avec Livraison
        public Livraison? Livraison { get; set; }
    }
}
