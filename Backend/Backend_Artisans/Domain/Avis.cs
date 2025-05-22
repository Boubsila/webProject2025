//using System.Text.Json.Serialization;

//namespace Domain
//{
//    public class Avis
//    {
//        public int Id { get; set; }
//        public string NumeroCommande { get; set; }
//        public string ProduitName { get; set; }
//        public string UserName { get; set; }
//        public int? Note { get; set; }              // De 1 à 5
//        public List<string> Commentaire { get; set; }
//        public string DateAvis { get; set; }

//        public Avis() { } // Constructor par défaut nécessaire pour la désérialisation JSON

//        [JsonConstructor]
//        public Avis(int id, string numeroCommande, string produitName, string userName, int? note, List<string> commentaire, string dateAvis)
//        {
//            Id = id;
//            NumeroCommande = numeroCommande;
//            ProduitName = produitName;
//            UserName = userName;
//            Note = note;
//            Commentaire = commentaire;
//            DateAvis = dateAvis;
//        }
//    }
//}


using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class Avis
    {
        public int Id { get; set; }
        public string NumeroCommande { get; set; }
        public string ProduitName { get; set; }
        public string UserName { get; set; }
        public int? Note { get; set; }

        [NotMapped]
        public List<string> Commentaire
        {
            get => string.IsNullOrEmpty(CommentaireData)
                ? new List<string>()
                : CommentaireData.Split('|').ToList();
            set => CommentaireData = string.Join("|", value);
        }

        // Champ réel stocké en bd
        public string CommentaireData { get; set; }

        public string DateAvis { get; set; }

        public Avis() { }

        [JsonConstructor]
        public Avis(int id, string numeroCommande, string produitName, string userName, int? note, List<string> commentaire, string dateAvis)
        {
            Id = id;
            NumeroCommande = numeroCommande;
            ProduitName = produitName;
            UserName = userName;
            Note = note;
            Commentaire = commentaire;
            DateAvis = dateAvis;
        }
    }
}
