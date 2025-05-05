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
        public string? numeroCommande { get; set; }
        public int produitId { get; set; }
        public string produitName { get; set; }
        public string artisanName { get; set; }
        public string clientName { get; set; }
        public string? livreurName { get; set; }
        public string dateCommande { get; set; }
        public string statut { get; set; }

        public bool isOrderd { get; set; } = false;
        public int quantite { get; set; } = 1;
        public double prix { get; set; }
        public string? adresseLivraison { get; set; }
        public string? dateLivraison { get; set; }

        public string? adresseDenlevement { get; set; }


        public Commande(int id, string numeroCommande, int produitId, string produitName, string artisanName, string clientName, string livreurName, string dateCommande, string statut, bool isOrderd, int quantite, double prix, string adresseLivraison, string dateLivraison,string adresseDenlevement)
        {
            this.Id = id;
            this.numeroCommande = numeroCommande;
            this.produitId = produitId;
            this.produitName = produitName;
            this.artisanName = artisanName;
            this.clientName = clientName;
            this.livreurName = livreurName;
            this.dateCommande = dateCommande;
            this.statut = statut;
            this.isOrderd = isOrderd;
            this.quantite = quantite;
            this.prix = prix;
            this.adresseLivraison = adresseLivraison;
            this.dateLivraison = dateLivraison;
            this.adresseDenlevement = adresseDenlevement;
        }

    }



}