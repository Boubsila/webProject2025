using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Produit
    {

        public Produit(int id,string nom, string description , double prix, string categorie,string image,int quantite,string artisanName,string statut)
        {
            Id = id;
            Nom = nom;
            Description = description;
            Prix=prix;
            Categorie = categorie;
            Image = image;
            Quantite = quantite;
            ArtisanName = artisanName;
            Statut = statut;

            
        }
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public double Prix { get; set; }
        public string Categorie { get; set; }
        public string Image { get; set; }
        public int Quantite { get; set; }

        public string ArtisanName { get; set; }
        public string Statut { get; set; }

        //// Relation avec Artisan
        //public int ArtisanId { get; set; }
        //public Artisan Artisan { get; set; }

        //// Relation avec CommandesProduits
        //public ICollection<CommandeProduit> CommandesProduits { get; set; } = new List<CommandeProduit>();

        //// Relation avec Avis
        //public ICollection<Avis> Avis { get; set; } = new List<Avis>();
    }
}
