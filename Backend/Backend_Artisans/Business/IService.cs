using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Business
{
    public interface IService
    {
        //IEnumerable<livraisonTest> GetLivraisons();
        public void DeleteUser(int Id);
        void AddUser(User user);
        //migration test
        List<User> GetUsers();

        List<Produit> getAllProducts();
        List<Produit> GetProductsByArtisanName(string artisanName);
        void changeProductStatus(int id);
        void deleteProduct(int id);
        void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut);
        void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite);

        // Orders
        public void AddCommande(Commande commande);
        public List<Commande> GetCommandeList();
        void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, string? adresseLivraison=null , string? dateLivraison=null );
        void DeleteCommande(int id);

        // récupère les commandes d'un artisan
        List<Commande> GetCommandesByArtisanName(string artisanName);

        //update order status

        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut);

        // update commande multi artisan
        void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut);


    }
}
