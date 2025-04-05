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
        IEnumerable<livraisonTest> GetLivraisons();
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




    }
}
