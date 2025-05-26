using Domain;
using Data;

namespace Business
{
    public class Service : IService
    {
        private readonly IRepo _repository;

        public Service(IRepo repository)
        {
            _repository = repository; // Injection du dépôt (accès aux données)
        }

        // ****************************************** UTILISATEUR ****************************************** //

        // Supprime un utilisateur par ID
        public void DeleteUser(int Id)
        {
            _repository.DeleteUser(Id);
        }

        // Ajoute un nouvel utilisateur
        public void AddUser(User user)
        {
            _repository.AddUser(user);
        }

        // Récupère la liste de tous les utilisateurs
        public List<User> GetUsers()
        {
            return _repository.GetUsers();
        }

        // Met à jour le statut actif/inactif d’un utilisateur
        public void SetUserStatus(int id, bool status)
        {
            _repository.UpdateUserStatus(id, status);
        }


        // ****************************************** PRODUIT ****************************************** //

        // Récupère tous les produits
        public List<Produit> getAllProducts()
        {
            return _repository.getAllProducts();
        }

        // Change le statut d’un produit (actif/inactif)
        public void changeProductStatus(int id)
        {
            _repository.changeProductStatus(id);
        }

        // Supprime un produit par ID
        public void deleteProduct(int id)
        {
            _repository.deleteProduct(id);
        }

        // Ajoute un nouveau produit
        public void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            _repository.addProduct(nom, description, prix, categorie, image, quantite, artisan, statut);
        }

        // Récupère les produits selon le nom de l’artisan
        public List<Produit> GetProductsByArtisanName(string artisanName)
        {
            return _repository.GetProductsByArtisanName(artisanName);
        }

        // Met à jour les informations d’un produit
        public void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite)
        {
            _repository.updateProduct(id, nom, description, prix, categorie, image, quantite);
        }

        // Met à jour uniquement la quantité d’un produit
        public void UpdateProductQuantity(int id, int nouvelleQuantite)
        {
            _repository.UpdateProductQuantity(id, nouvelleQuantite);
        }

        // ****************************************** COMMANDE ****************************************** //

        // Ajoute une commande
        public void AddCommande(Commande commande)
        {
            _repository.AddCommande(commande);
        }

        // Récupère la liste de toutes les commandes
        public List<Commande> GetCommandeList()
        {
            return _repository.GetCommandeList();
        }

        // Ajoute une adresse de ramassage pour une commande
        public void addPickupAdres(string nmOrder, string adresse, string livreur)
        {
            _repository.addPickupAdres(nmOrder, adresse, livreur);
        }

        // Met à jour les données principales d'une commande
        public void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, string? adresseLivraison = null, string? dateLivraison = null)
        {
            _repository.UpdateCommande(id, statut, isOrdered, numeroCommande, adresseLivraison, dateLivraison);
        }

        // Supprime une commande
        public void DeleteCommande(int id)
        {
            _repository.DeleteCommande(id);
        }

        // Récupère les commandes d’un artisan spécifique
        public List<Commande> GetCommandesByArtisanName(string artisanName)
        {
            return _repository.GetCommandeList().Where(c => c.artisanName.Equals(artisanName, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        // Change le statut global d'une commande via son numéro
        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            _repository.ChangeOrderStatus(numeroCommande, nouveauStatut);
        }

        // Change le statut d'une commande pour un produit spécifique lié à un artisan
        public void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut)
        {
            _repository.ChangeCommandeStatusByProductAndArtisan(numeroCommande, artisanName, nouveauStatut);
        }


        // ****************************************** AVIS ****************************************** //

        // Ajoute un avis
        public void AjouterAvis(Avis avis)
        {
            _repository.AjouterAvis(avis);
        }

        // Récupère les commentaires associés à une commande et un produit
        public List<string> GetComent(string ORD, string produitName)
        {
            return _repository.GetComent(ORD, produitName);
        }

        // Récupère la note associée à une commande et un produit
        public int GetNote(string ORD, string produitName)
        {
            return _repository.GetNote(ORD, produitName);
        }

        // Ajoute un commentaire à une commande pour un produit
        public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            _repository.ajouterCommentaire(ORD, produitName, commentaire);
        }
    }
}
