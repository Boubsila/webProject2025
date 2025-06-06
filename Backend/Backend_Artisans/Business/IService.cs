﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Business
{
    public interface IService
    {
        //user
        public void DeleteUser(int Id);
        void AddUser(User user);
        List<User> GetUsers();
        void SetUserStatus(int id, bool status);



        //Produit

        List<Produit> getAllProducts();
        List<Produit> GetProductsByArtisanName(string artisanName);
        void changeProductStatus(int id);
        void deleteProduct(int id);
        void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut);
        void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite);
        void UpdateProductQuantity(int id, int nouvelleQuantite);
       
        // commande
        public void AddCommande(Commande commande);
        public List<Commande> GetCommandeList();
        void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, int quantite, string? adresseLivraison=null , string? dateLivraison=null );
        void DeleteCommande(string orderNumber);
        void DeleteCommandeCart(int id);
        void addPickupAdres(string nmOrder, string adresse, string livreur);

        // récupère les commandes d'un artisan
        List<Commande> GetCommandesByArtisanName(string artisanName);

        //update order status

        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut);

        // update commande multi artisan
        void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut);



        //**************************************************** AVIS ****************************************************//

        // Avis
        void AjouterAvis(Avis avis);
        List<string> GetComent(string ORD, string produitName);
        int GetNote(string ORD, string produitName);
        void ajouterCommentaire(string ORD, string produitName, string commentaire);
    }
}
