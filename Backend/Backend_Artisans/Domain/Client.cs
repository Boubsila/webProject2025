using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Client
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string AdresseLivraison { get; set; }
        public string Phone { get; set; }

        // Relation avec User
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation avec Commandes
        public ICollection<Commande> Commandes { get; set; } = new List<Commande>();

        // Relation avec Avis
        public ICollection<Avis> Avis { get; set; } = new List<Avis>();
    }
}
