using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class PartenaireLivraison
    {
        public int Id { get; set; }
        public string Entreprise { get; set; }
        public string EmailSociete { get; set; }
        public string Phone { get; set; }

        // Relation avec User
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation avec Livraisons
        public ICollection<Livraison> Livraisons { get; set; } = new List<Livraison>();
    }
}
