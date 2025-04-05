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
        IEnumerable<livraisonTest> GetLivraisons();

        //migration test
        List<User> GetUsers();

        void AddUser(User user);

        void DeleteUser(int Id);

        List<Produit> getAllProducts();
        List<Produit> GetProductsByArtisanName(string artisanName);
        void changeProductStatus(int id);
        void deleteProduct(int id);
        void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut);

        void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite);
       
    }
}
