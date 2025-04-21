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
        public string numeroCommande { get; set; }
        public string produitName { get; set; }
        public string clientName { get; set; }
        public string artisanName { get; set; }
        public int Note { get; set; } // De 1 à 5
        public List<string> Commentaire { get; set; }
        public string DateAvis { get; set; }


        public Avis(int id,string numeroCommande,string produitName,string clientName,string artisanName,int note,List<string> commentaire,string dateAvis)
        {
            id = Id;
            this.numeroCommande = numeroCommande;
            this.produitName = produitName;
            this.clientName = clientName;
            this.artisanName = artisanName;
            note = Note;
            commentaire = Commentaire;
            dateAvis = DateAvis;


        }
    }
}
