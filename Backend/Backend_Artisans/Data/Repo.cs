using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Domain;



namespace Data
{
    public class Repo : IRepo
    {
        private static List<livraisonTest> livraisons = new List<livraisonTest>
        {
            new livraisonTest {id = 1345, numeroDeCommande = 11345, statut = "En attente", dateDenlevement = "2021-04-01"},
            new livraisonTest {id = 22367, numeroDeCommande = 223672, statut = "Livrée", dateDenlevement = "2021-03-01"},
            new livraisonTest {id = 3987, numeroDeCommande = 33987, statut = "En attente", dateDenlevement = "2021-06-01"},
            new livraisonTest {id = 49009, numeroDeCommande = 490094, statut = "En attente", dateDenlevement = "2021-08-01"},
            new livraisonTest {id = 554675, numeroDeCommande = 5546755, statut = "En attente", dateDenlevement = "2021-02-01"},
            new livraisonTest {id = 34226, numeroDeCommande = 634226, statut = "En attente", dateDenlevement = "2021-01-01"},
            new livraisonTest {id = 768895, numeroDeCommande = 7688957, statut = "En attente", dateDenlevement = "2021-11-01"},
            new livraisonTest {id = 098865, numeroDeCommande = 0988658, statut = "En attente", dateDenlevement = "2021-1-01"},
            new livraisonTest {id = 23534, numeroDeCommande = 923534, statut = "En attente", dateDenlevement = "2021-08-01"},
            new livraisonTest {id = 4345667, numeroDeCommande = 143456670, statut = "En attente", dateDenlevement = "2021-09-01"}
            
        };

        //migration test
        //user list 
        private static List<User> users = new List<User>
        {
           // new User ( 1,  "admin@artisans.be",  "admin", Guid.NewGuid().ToString(), "Admin",  true ),
            new User ( 1,"su@artisans.be","4326FACBD8C1467C6FC7","f6893125-485c-4439-a443-d4600865f788","Admin",true),
            new User(  2,"client","BD605BE48F3DDE7AEE95","399f10b0-f976-4079-b0a0-1461f45fa58e","client",false)

        };

        //product list
        private static List<Produit> produits = new List<Produit>
{
    new Produit(1, "Vase en Céramique Tourné à la Main", "Vase unique en céramique, tourné et décoré à la main avec des motifs traditionnels.", 85.00, "Poterie et Céramique", "images/1.jpg", 50, "Artisan A", "pending"),
    new Produit(2, "Tapis Berbère en Laine Naturelle", "Tapis berbère authentique, tissé à la main avec de la laine naturelle et des motifs géométriques.", 2500.00, "Tissage et Tapis", "images/2.jpg", 30, "Artisan B", "pending"),
    new Produit(3, "Sac à Main en Cuir Véritable", "Sac à main élégant en cuir véritable, tanné et cousu à la main par des artisans locaux.", 120.00, "Travail du Cuir (Tanneries)", "images/3.jpg", 100, "Artisan C", "approved"),
    new Produit(4, "Table Basse en Bois de Cèdre Sculpté", "Table basse unique en bois de cèdre, sculptée à la main avec des motifs floraux et géométriques.", 350.00, "Travail du Bois (Menuiserie et Marqueterie)", "images/4.jpg", 25, "Artisan D", "pending"),
    new Produit(5, "Lanterne en Fer Forgé", "Lanterne artisanale en fer forgé, réalisée à la main avec des motifs traditionnels.", 180.00, "Métallurgie et Ferronnerie", "images/5.jpg", 75, "Artisan E", "approved"),
    new Produit(6, "Collier en Argent et Pierres Précieuses", "Collier artisanal en argent, orné de pierres précieuses et réalisé avec des techniques traditionnelles.", 220.00, "Bijouterie et Orfèvrerie", "images/6.jpg", 10, "Artisan F", "pending"),
    new Produit(7, "Écharpe Brodée à la Main", "Écharpe en laine douce, brodée à la main avec des motifs colorés et traditionnels.", 60.00, "Autres", "images/7.jpg", 20, "", "pending"),
    new Produit(8, "Panier en Osier Tressé", "Panier artisanal en osier, tressé à la main avec des techniques traditionnelles.", 45.00, "Autres", "images/8.jpg", 30, "", "pending"),
    new Produit(9, "Panneau Mural en Zellige", "Panneau mural décoratif en zellige, réalisé à la main avec des motifs géométriques complexes.", 300.00, "Autres", "images/9.jpg", 0, "", "pending"),
    new Produit(10, "Lampe en Tadelakt", "Lampe artisanale en tadelakt, réalisée à la main avec des techniques traditionnelles.", 150.00, "Poterie et Céramique", "images/10.jpg", 0, "", "pending")
};
        public IEnumerable<livraisonTest> GetLivraisons() => livraisons;

    //migration test
        public List<User> GetUsers()
        {
            return users;
        }
        //migration test
        public void AddUser (User user)
        {
            users.Add(user);
        }

        //migration test 
        public void DeleteUser(int Id)
        {
            var user = users.FirstOrDefault(x => x.Id == Id);
            if (user != null)
            {
                users.Remove(user);
            }
        }

        public List<Produit> getAllProducts()
        {
            return produits;
        }

        public void changeProductStatus(int id)
        {
            var produit = produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Statut = "approved";
            }
        }

        public void deleteProduct(int id)
        {
            var produit = produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produits.Remove(produit);
            }
        }




    }
}
