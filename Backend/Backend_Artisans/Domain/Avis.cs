using System.Text.Json.Serialization;

namespace Domain
{
    public class Avis
    {
        public int Id { get; set; }
        public string NumeroCommande { get; set; }
        public string ProduitName { get; set; }
        public string UserName { get; set; }
        public int? Note { get; set; }              // De 1 à 5
        public List<string> Commentaire { get; set; }
        public string DateAvis { get; set; }

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
