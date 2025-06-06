using System;
using System.Collections.Generic;
using System.Data;
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

        private readonly AppDbContext _context;

        public Repo(AppDbContext context)
        {
            _context = context;
        }

      



        //******************* USERS *************************

        // Récupère tous les utilisateurs de la base de données
        public List<User> GetUsers()
        {
            return _context.User.ToList(); // Retourne la liste complète des utilisateurs
        }

        // Ajoute un nouvel utilisateur à la base de données
        public void AddUser(User user)
        {
            try
            {
                _context.User.Add(user);    // Ajoute l'utilisateur au contexte
                _context.SaveChanges();     // Enregistre les changements en base
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur lors de l'ajout du user : " + ex.Message); // Affiche l'erreur si problème
            }
        }

        // Supprime un utilisateur existant via son Id
        public void DeleteUser(int Id)
        {
            var user = _context.User.Find(Id);  // Cherche l'utilisateur en base par sa clé primaire (Id)
            if (user != null)
            {
                _context.User.Remove(user);      // Supprime l'utilisateur du contexte
                _context.SaveChanges();          // Enregistre la suppression en base
            }
        }

        // Met à jour le statut (Statut) d'un utilisateur
        public void UpdateUserStatus(int userId, bool newStatus)
        {
            var user = _context.User.Find(userId);  // Cherche l'utilisateur par Id
            if (user != null)
            {
                user.Statut = newStatus;              // Change le statut de l'utilisateur
                _context.SaveChanges();               // Enregistre la modification en base
            }
        }



        //******************* Products *************************

        // Récupère tous les produits de la base de données
        public List<Produit> getAllProducts()
        {
            return _context.Produits.ToList(); // Retourne la liste complète des produits
        }

        // Change le statut d'un produit donné (ici, met "approved")
        public void changeProductStatus(int id)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id); // Trouve le produit par son Id

            if (produit != null)
            {
                produit.Statut = "approved";   // Modifie le statut du produit
                _context.SaveChanges();         // Enregistre la modification en base
            }
        }

        // Supprime un produit par son Id
        public void deleteProduct(int id)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id); // Trouve le produit par Id

            if (produit != null)
            {
                _context.Produits.Remove(produit); // Supprime le produit du contexte
                _context.SaveChanges();            // Enregistre la suppression en base
            }
        }

        // Ajoute un nouveau produit avec les informations fournies
        public void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            // Génère un nouvel Id unique : max Id existant + 1, ou 1 si pas de produit
            int nouvelId = _context.Produits.ToList().Count > 0 ? _context.Produits.Max(p => p.Id) + 1 : 1;

            // Crée un nouvel objet Produit avec les données reçues
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

            // Ajoute ce nouveau produit au contexte
            _context.Produits.Add(nouveauProduit);
            _context.SaveChanges(); // Enregistre en base
        }

        // Récupère tous les produits d'un artisan donné, en comparant sans tenir compte de la casse
        public List<Produit> GetProductsByArtisanName(string artisanName)
        {
            return _context.Produits
                .Where(p => p.ArtisanName != null &&
                            p.ArtisanName.ToLower() == artisanName.ToLower()) // filtre par nom d'artisan insensible à la casse
                .ToList();
        }



        //**************************************Produit**********************************************

        // Met à jour les informations d'un produit donné par son Id
        public void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id); // Cherche le produit par Id

            if (produit != null)
            {
                // Met à jour les propriétés du produit
                produit.Nom = nom;
                produit.Description = description;
                produit.Prix = prix;
                produit.Categorie = categorie;
                produit.Image = image;
                produit.Quantite = quantite;
            }
            _context.SaveChanges(); // Sauvegarde les modifications en base
        }

        // Met à jour la quantité d'un produit (réduit la quantité existante)
        public void UpdateProductQuantity(int id, int nouvelleQuantite)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id); // Cherche le produit par Id

            if (produit != null)
            {
                produit.Quantite = produit.Quantite - nouvelleQuantite; // Soustrait la nouvelle quantité
                _context.SaveChanges(); // Sauvegarde en base
            }
        }

        //******************* Order *************************

        // Récupère la liste complète des commandes
        public List<Commande> GetCommandeList()
        {
            return _context.Commandes.ToList(); // Retourne toutes les commandes
        }

        // Ajoute une nouvelle commande (ex: panier)
        public void AddCommande(Commande commande)
        {
            // Génère un nouvel Id unique pour la commande
            int nouvelId = _context.Commandes.ToList().Count > 0 ? _context.Commandes.Max(c => c.Id) + 1 : 1;
            commande.Id = nouvelId;

            _context.Commandes.Add(commande); // Ajoute la commande au contexte
            _context.SaveChanges(); // Enregistre en base
        }

        // Met à jour les détails d'une commande existante
        public void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, int quantite, string? adresseLivraison = null, string? dateLivraison = null)
        {
            var commande = _context.Commandes.FirstOrDefault(c => c.Id == id); // Trouve la commande par Id

            if (commande != null)
            {
                if (statut != null)
                    commande.statut = statut; // Met à jour le statut

                if (isOrdered != false)
                    commande.isOrderd = isOrdered; // Met à jour le flag de commande

                if (adresseLivraison != null)
                    commande.adresseLivraison = adresseLivraison; // Met à jour l'adresse de livraison

                if (dateLivraison != null)
                    commande.dateLivraison = dateLivraison; // Met à jour la date de livraison

                if (numeroCommande != null)
                    commande.numeroCommande = numeroCommande; // Met à jour le numéro de commande
                if (quantite != 0)
                    commande.quantite = quantite; // Met à jour la quantité de la commande 
            }
            _context.SaveChanges(); // Sauvegarde les changements
        }

        // Supprime une commande par son order number
        public void DeleteCommande(string orderNumber)
        {
          
                var commande = _context.Commandes.FirstOrDefault(c => c.numeroCommande == orderNumber); // Cherche la commande par order number

            

            if (commande != null)
            {
                _context.Commandes.Remove(commande); // Supprime la commande du contexte
            }

            _context.SaveChanges(); // Sauvegarde la suppression en base
        }


        public void DeleteCommandeCart(int id)
        {

            var commande = _context.Commandes.FirstOrDefault(c => c.Id == id); 



            if (commande != null)
            {
                _context.Commandes.Remove(commande); // Supprime la commande du contexte
            }

            _context.SaveChanges(); // Sauvegarde la suppression en base
        }






        // Récupère toutes les commandes pour un artisan donné (insensible à la casse)
        public List<Commande> GetCommandesByArtisanName(string artisanName)
        {
            return _context.Commandes
                    .Where(c => c.artisanName != null && c.artisanName.ToLower() == artisanName.ToLower()) // Filtre par nom artisan
                    .ToList();
        }

        // Change le statut d'une commande selon son numéro de commande (insensible à la casse)
        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            var commande = _context.Commandes
                .FirstOrDefault(c => c.numeroCommande != null && c.numeroCommande.ToLower() == numeroCommande.ToLower());

            if (commande != null)
            {
                commande.statut = nouveauStatut; // Modifie le statut
                _context.SaveChanges(); // Sauvegarde en base
            }
        }

        // Ajoute une adresse d'enlèvement et nom du livreur à une commande donnée
        public void addPickupAdres(string nmOrder, string adresse, string livreur)
        {
            var commande = _context.Commandes
                .FirstOrDefault(c => c.numeroCommande != null && c.numeroCommande.ToLower() == nmOrder.ToLower());

            if (commande != null)
            {
                commande.adresseDenlevement = adresse; // Met à jour l'adresse d'enlèvement
                commande.livreurName = livreur;        // Met à jour le nom du livreur
                _context.SaveChanges();                 // Sauvegarde en base
            }
        }

        // Change le statut d'une commande spécifique pour un artisan donné dans une commande multi-artisans
        public void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut)
        {
            var commandesAModifier = _context.Commandes
                .Where(c =>
                    c.numeroCommande != null &&
                    c.artisanName != null &&
                    c.numeroCommande.ToLower() == numeroCommande.ToLower() &&
                    c.artisanName.ToLower() == artisanName.ToLower())
                .ToList();

            foreach (var commande in commandesAModifier)
            {
                commande.statut = nouveauStatut; // Modifie le statut de chaque commande correspondante
            }

            _context.SaveChanges(); // Sauvegarde en base
        }


        //+++++++************** AVIS ********************//

        // Ajoute un nouvel avis pour un produit et une commande donnés
        public void AjouterAvis(Avis avis)
        {
            // Vérifie si un avis existe déjà pour cette commande et ce produit
            var avisExistant = _context.Avis.FirstOrDefault(a =>
                a.NumeroCommande == avis.NumeroCommande &&
                a.ProduitName == avis.ProduitName);

            if (avisExistant != null)
            {
                // Si oui, lance une erreur pour empêcher doublon
                throw new ArgumentException("Vous avez déjà soumis un avis pour ce produit.");
            }

            // Génère un nouvel Id unique pour l'avis
            int maxId = _context.Avis.Any() ? _context.Avis.Max(a => a.Id) + 1 : 1;
            avis.Id = maxId;

            // Formate le commentaire avec la date et heure actuelle et crée une liste avec ce commentaire
            string commentaireFormate = $"{avis.Commentaire.FirstOrDefault()}, {DateTime.Now:dd-MM-yy, HH:mm:ss}";
            avis.Commentaire = new List<string> { commentaireFormate };

            // Ajoute l'avis au contexte et sauvegarde en base
            _context.Avis.Add(avis);
            _context.SaveChanges();
        }

        // Ajoute un commentaire supplémentaire à un avis existant selon numéro de commande et produit
        public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            var avis = _context.Avis.FirstOrDefault(a =>
                a.NumeroCommande == ORD &&
                a.ProduitName == produitName);

            if (avis != null)
            {
                // Formate le commentaire avec la date/heure actuelle
                string commentaireFormate = $"{commentaire} , {DateTime.Now:dd-MM-yy, HH:mm:ss}";

                // Ajoute ce commentaire à la liste existante
                var commentaires = avis.Commentaire;
                commentaires.Add(commentaireFormate);
                avis.Commentaire = commentaires;

                // Met à jour l'avis en base
                _context.Avis.Update(avis);
                _context.SaveChanges();
            }
            else
            {
                // Erreur si l'avis n'existe pas pour cette commande et produit
                throw new InvalidOperationException($"Avis non trouvé pour la commande {ORD} et le produit {produitName}");
            }
        }

        // Récupère la liste de tous les commentaires d'un avis donné (commande + produit)
        public List<string> GetComent(string ORD, string produitName)
        {
            return _context.Avis
                .Where(a => a.NumeroCommande == ORD && a.ProduitName == produitName)
                .AsEnumerable()  // force l’évaluation en mémoire pour manipuler la liste des commentaires
                .SelectMany(a => a.Commentaire) // récupère tous les commentaires contenus dans la liste
                .ToList();
        }

        // Récupère la note attribuée à un avis donné (commande + produit)
        // Retourne 0 si aucun avis trouvé
        public int GetNote(string ORD, string produitName)
        {
            var avis = _context.Avis
                .FirstOrDefault(a => a.NumeroCommande == ORD && a.ProduitName == produitName);

            return avis?.Note ?? 0;  // opérateur null-coalescent pour retourner 0 si avis est null
        }
    }
}