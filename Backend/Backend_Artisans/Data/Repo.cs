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
        //private static List<livraisonTest> livraisons = new List<livraisonTest>
        //{
        //    new livraisonTest {id = 1345, numeroDeCommande = 11345, statut = "En attente", dateDenlevement = "2021-04-01"},
        //    new livraisonTest {id = 22367, numeroDeCommande = 223672, statut = "Livrée", dateDenlevement = "2021-03-01"},
        //    new livraisonTest {id = 3987, numeroDeCommande = 33987, statut = "En attente", dateDenlevement = "2021-06-01"},
        //    new livraisonTest {id = 49009, numeroDeCommande = 490094, statut = "En attente", dateDenlevement = "2021-08-01"},
        //    new livraisonTest {id = 554675, numeroDeCommande = 5546755, statut = "En attente", dateDenlevement = "2021-02-01"},
        //    new livraisonTest {id = 34226, numeroDeCommande = 634226, statut = "En attente", dateDenlevement = "2021-01-01"},
        //    new livraisonTest {id = 768895, numeroDeCommande = 7688957, statut = "En attente", dateDenlevement = "2021-11-01"},
        //    new livraisonTest {id = 098865, numeroDeCommande = 0988658, statut = "En attente", dateDenlevement = "2021-1-01"},
        //    new livraisonTest {id = 23534, numeroDeCommande = 923534, statut = "En attente", dateDenlevement = "2021-08-01"},
        //    new livraisonTest {id = 4345667, numeroDeCommande = 143456670, statut = "En attente", dateDenlevement = "2021-09-01"}

        //};


        //user list 
        private static List<User> users = new List<User>
        {
           
            new User ( 1,"su@artisans.be","4326FACBD8C1467C6FC7","f6893125-485c-4439-a443-d4600865f788","Admin",true),
            new User ( 2,"client","BD605BE48F3DDE7AEE95","399f10b0-f976-4079-b0a0-1461f45fa58e","client",true),
            new User ( 3,"artisan","C32665DFD1F098F185D4","d264db82-396a-4ffa-9671-f3cc7fee2489","artisan",true),
            new User ( 4,"client2","C530C1D1A88CAD432ED0","e90be96d-2702-4d77-877d-c0e01ede0203","client",true),
            new User ( 5,"artisan2","3E58AFA6264EF7CBEABA","8b3259fa-956f-488f-ab4e-c6c7505eaa24","artisan",true),
            new User ( 6,"livreur","F13CF38BDAEF1226A615","b8379950-1121-49de-97e6-32e4efa39227","livreur",true),
            new User ( 7,"livreur2","A490A041B03D2F38BA9F","1ac810de-3657-4346-a3dd-ff401988214b","livreur",true)
         
           

        };

        //product list
        private static List<Produit> produits = new List<Produit>
        {
            new Produit(1, "Vase en Céramique Tourné à la Main", "Vase unique en céramique, tourné et décoré à la main avec des motifs traditionnels.", 85.00, "Poterie et Céramique", "images/1.jpg", 50, "artisan", "approved"),
            new Produit(2, "Tapis Berbère en Laine Naturelle", "Tapis berbère authentique, tissé à la main avec de la laine naturelle et des motifs géométriques.", 2500.00, "Tissage et Tapis", "images/2.jpg", 30, "artisan2", "approved"),
            new Produit(3, "Sac à Main en Cuir Véritable", "Sac à main élégant en cuir véritable, tanné et cousu à la main par des artisans locaux.", 120.00, "Travail du Cuir (Tanneries)", "images/3.jpg", 100, "artisan", "approved"),
            new Produit(4, "Table Basse en Bois de Cèdre Sculpté", "Table basse unique en bois de cèdre, sculptée à la main avec des motifs floraux et géométriques.", 350.00, "Travail du Bois (Menuiserie et Marqueterie)", "images/4.jpg", 25, "artisan2", "approved"),
            new Produit(5, "Lanterne en Fer Forgé", "Lanterne artisanale en fer forgé, réalisée à la main avec des motifs traditionnels.", 180.00, "Métallurgie et Ferronnerie", "images/5.jpg", 75, "artisan", "approved"),
            new Produit(6, "Collier en Argent et Pierres Précieuses", "Collier artisanal en argent, orné de pierres précieuses et réalisé avec des techniques traditionnelles.", 220.00, "Bijouterie et Orfèvrerie", "images/6.jpg", 10, "artisan2", "approved"),
            new Produit(7, "Écharpe Brodée à la Main", "Écharpe en laine douce, brodée à la main avec des motifs colorés et traditionnels.", 60.00, "Autres", "images/7.jpg", 20, "artisan", "approved"),
            new Produit(8, "Panier en Osier Tressé", "Panier artisanal en osier, tressé à la main avec des techniques traditionnelles.", 45.00, "Autres", "images/8.jpg", 30, "artisan2", "approved"),
            new Produit(9, "Panneau Mural en Zellige", "Panneau mural décoratif en zellige, réalisé à la main avec des motifs géométriques complexes.", 300.00, "Autres", "images/9.jpg", 0, "artisan", "approved"),
            new Produit(10, "Lampe en Tadelakt", "Lampe artisanale en tadelakt, réalisée à la main avec des techniques traditionnelles.", 150.00, "Poterie et Céramique", "images/10.jpg", 0, "artisan2", "approved")
        };


        //Order liste

        private static List<Commande> commandes = new List<Commande>
        {

            new Commande(0,"ORD_test_Order",1,"test","artisan","client","","12/04/25","Expédiée",false,10,20,"","",""),


        };

        // Avis liste 

        private static List<Avis> avisList = new List<Avis>
        {
            new Avis (0,"ORD1","product1", "client",5,new List<string> { "Top product"}, "16/06/2025"),
            new Avis (1,"ORD2","product1", "client2",5,new List<string> { "Merci"}, "17/06/2025")

        };


        //public IEnumerable<livraisonTest> GetLivraisons() => livraisons;

        //******************* USERS *************************

        
        public List<User> GetUsers()
        {
            return users;
        }
        
        public void AddUser(User user)
        {
            users.Add(user);
        }

        
        public void DeleteUser(int Id)
        {
            var user = users.FirstOrDefault(x => x.Id == Id);
            if (user != null)
            {
                users.Remove(user);
            }
        }

        //******************* Products *************************
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


        public void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            // Générer un nouvel ID unique
            int nouvelId = produits.Count > 0 ? produits.Max(p => p.Id) + 1 : 1;

            // Créer un nouvel objet Produit avec les informations fournies
            Produit nouveauProduit = new Produit(
                nouvelId,
                nom,
                description,
                prix,
                categorie,
                image,
                quantite,
                artisan,
                statut
            );

            // Ajouter le produit à la liste
            produits.Add(nouveauProduit);
        }

        //Get product by artisan name  
        public List<Produit> GetProductsByArtisanName(string artisanName)
        {
            return produits.Where(p => p.ArtisanName.Equals(artisanName, StringComparison.OrdinalIgnoreCase)).ToList();
        }


        //update product 
        public void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite)
        {

            var produit = produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Nom = nom;
                produit.Description = description;
                produit.Prix = prix;
                produit.Categorie = categorie;
                produit.Image = image;
                produit.Quantite = quantite;

            }
        }

        // update quantity of product
        public void UpdateProductQuantity(int id, int nouvelleQuantite)
        {
            var produit = produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Quantite = produit.Quantite - nouvelleQuantite;
            }
        }


        //******************* Order *************************

        //get commande
        public List<Commande> GetCommandeList()
        {
            return commandes;

        }

        //add commande (panier)
        public void AddCommande(Commande commande)
        {
            // Générer un nouvel ID unique
            int nouvelId = commandes.Count > 0 ? commandes.Max(c => c.Id) + 1 : 1;
            commande.Id = nouvelId;

            commandes.Add(commande);
        }


        //update commande (commander)
        public void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, string? adresseLivraison = null, string? dateLivraison = null)
        {
            var commande = commandes.FirstOrDefault(c => c.Id == id);

            if (commande != null)
            {
                if(statut != null)
                    commande.statut = statut;
                if(isOrdered != false)
                    commande.isOrderd = isOrdered;

                if (adresseLivraison != null)
                    commande.adresseLivraison = adresseLivraison;

                if (dateLivraison != null)
                    commande.dateLivraison = dateLivraison;
                if(numeroCommande != null)
                    commande.numeroCommande = numeroCommande;
            }
        }

        // Delete order

        public void DeleteCommande(int id)
        {
            var commande = commandes.FirstOrDefault(c => c.Id == id);

            if (commande != null)
            {
                commandes.Remove(commande);
            }


        }

        // recuperer les commandes par nom d'artisan
        public List<Commande> GetCommandesByArtisanName(string artisanName)
        {
            return commandes.Where(c => c.artisanName.Equals(artisanName, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        // change le statut de la commande 
        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            var commande = commandes.FirstOrDefault(c => c.numeroCommande == numeroCommande);
            if (commande != null)
            {
                commande.statut = nouveauStatut;
            }
        }

        //ajouter l'adresse d'enlevment 

        public void addPickupAdres(string nmOrder, string adresse)
        {
            var commande = commandes.FirstOrDefault(c => c.numeroCommande == nmOrder);
            if (commande != null)
            {
                commande.adresseDenlevement = adresse;
            }
        }

        //Change le statut de la commande multi artisan 

        public void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut)
        {
            var commandesAModifier = commandes.Where(c =>
                c.numeroCommande == numeroCommande &&
                c.artisanName.Equals(artisanName, StringComparison.OrdinalIgnoreCase)).ToList();

            foreach (var commande in commandesAModifier)
            {
                commande.statut = nouveauStatut;
            }
        }

        
        //+++++++************** AVIS ********************//

        public void AjouterAvis(Avis avis)
        {
            // Vérifier si l'avis existe déjà pour la même commande et le même produit  
            var avisExistant = avisList.FirstOrDefault(a =>
                a.NumeroCommande == avis.NumeroCommande &&
                a.ProduitName == avis.ProduitName);

            if (avisExistant != null )
            {
                throw new ArgumentException("Vous avez déjà soumis un avis pour ce produit.");
            }
                // Ajouter un ID unique à l'avis  
                avis.Id = avisList.Count > 0 ? avisList.Max(a => a.Id) + 1 : 1;

                // Formater le commentaire initial et l'ajouter à la liste des commentaires  
                string commentaireFormate = $"{avis.Commentaire.FirstOrDefault()}, {DateTime.Now:dd-MM-yy, HH:mm:ss}";
                avis.Commentaire = new List<string> { commentaireFormate };

                // Ajouter l'avis à la liste  
                avisList.Add(avis);
            

        }

        public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            // Trouver l'avis correspondant à la commande et au produit
            var avis = avisList.FirstOrDefault(a =>
                a.NumeroCommande == ORD &&
                a.ProduitName == produitName);

            if (avis != null)
            {
                // Formater le nouveau commentaire avec la date/heure actuelle
                string commentaireFormate = $"{commentaire} , {DateTime.Now:dd-MM-yy, HH:mm:ss}";

                // Ajouter le commentaire formaté à la liste des commentaires de l'avis
                avis.Commentaire.Add(commentaireFormate);
            }
            else
            {
               
                throw new InvalidOperationException($"Avis non trouvé pour la commande {ORD} et le produit {produitName}");
            }
        }

        public List<string> GetComent(string ORD, string produitName)
        {
            return avisList
                .Where(a => a.NumeroCommande == ORD && a.ProduitName == produitName)
                .SelectMany(a => a.Commentaire) 
                .ToList();
        }


        public int GetNote(string ORD, string produitName)
        {
            // Recherche de l'avis correspondant à la commande et au produit
            var avis = avisList
                .FirstOrDefault(a => a.NumeroCommande == ORD && a.ProduitName == produitName);

            // Si un avis a été trouvé, retourner la note, sinon retourner une valeur par défaut (par exemple, 0)
            return avis?.Note ?? 0; // Si avis est null, retourne 0
        }


    }
}