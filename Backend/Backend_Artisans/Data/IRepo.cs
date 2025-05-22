using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public interface IRepo
    {
        //IEnumerable<livraisonTest> GetLivraisons();

        //***************************************user************************************
        List<User> GetUsers();

        void AddUser(User user);

        void DeleteUser(int Id);

        void UpdateUserStatus(int userId, bool newStatus);

        //*****************************************Produit*******************************
        List<Produit> getAllProducts();
        List<Produit> GetProductsByArtisanName(string artisanName);
        void changeProductStatus(int id);
        void deleteProduct(int id);
        void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut);

        void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite);

        void UpdateProductQuantity(int id, int nouvelleQuantite);


        //commandes
        public void AddCommande(Commande commande);
        public List<Commande> GetCommandeList();
        void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, string? adresseLivraison = null, string? dateLivraison = null);
        void DeleteCommande(int id);
        void addPickupAdres(string nmOrder, string adresse, string livreur);

        // recuperer les commandes par nom d'artisan
        List<Commande> GetCommandesByArtisanName(string artisanName);

        // update le statut de la commande  ,

        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut);

        // update le statut de la commande multi artisan

        void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut);

        //**************************************************** AVIS ****************************************************//

        // Avis
        void AjouterAvis(Avis avis);
        List<string> GetComent(string ORD, string produitName);
        int GetNote(string ORD, string produitName);
        void ajouterCommentaire(string ORD, string produitName, string commentaire);

    }
}
