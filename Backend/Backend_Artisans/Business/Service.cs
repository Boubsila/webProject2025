using Domain;
using Data;

namespace Business
{
    public class Service : IService
    {
        private readonly IRepo _repository;
        public Service(IRepo repository)
        {
            _repository = repository;
        }
        
        //user
        public void DeleteUser(int Id)
        {
            _repository.DeleteUser(Id);
        }

        public void AddUser(User user)
        {
            _repository.AddUser(user);
        }

        public List<User> GetUsers()
        {
            return _repository.GetUsers();
        }

        public void SetUserStatus(int id, bool status)
        {
            _repository.UpdateUserStatus(id, status);
        }



        //produit

        public List<Produit> getAllProducts()
        {
            return _repository.getAllProducts();
        }



        public void changeProductStatus(int id)
        {
            _repository.changeProductStatus(id);
        }

        public void deleteProduct(int id)
        {
            _repository.deleteProduct(id);
        }

        public void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            _repository.addProduct(nom, description, prix, categorie, image, quantite, artisan, statut);
        }

        public List<Produit> GetProductsByArtisanName(string artisanName)
        {
            return _repository.GetProductsByArtisanName(artisanName);
        }

        public void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite)
        {
            _repository.updateProduct(id, nom, description, prix, categorie, image, quantite);
        }

        public void AddCommande(Commande commande)
        {
            _repository.AddCommande(commande);
        }

        public List<Commande> GetCommandeList()
        {

            return _repository.GetCommandeList();
        }

        public void addPickupAdres(string nmOrder, string adresse, string livreur)
        {
            _repository.addPickupAdres(nmOrder, adresse,livreur);
        }

        public void UpdateCommande(int id, string statut, bool isOrdered,string numeroCommande, string? adresseLivraison = null, string? dateLivraison = null)
        {
            _repository.UpdateCommande(id, statut, isOrdered, numeroCommande, adresseLivraison, dateLivraison);
        }

        public void DeleteCommande(int id)
        {
            _repository.DeleteCommande(id);
        }

        // Récupère les commandes d'un artisan spécifique
        public List<Commande> GetCommandesByArtisanName(string artisanName)
        {
            
            return _repository.GetCommandeList().Where(c => c.artisanName.Equals(artisanName, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            _repository.ChangeOrderStatus(numeroCommande,nouveauStatut);
        }

        //update statut commande multi artisan 
        public void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut)
        {
            _repository.ChangeCommandeStatusByProductAndArtisan(numeroCommande,artisanName,nouveauStatut);
        }


        //**************************************************** AVIS ****************************************************//

        // Avis

        public void AjouterAvis(Avis avis)
        {
            _repository.AjouterAvis(avis);
        }
       public List<string> GetComent(string ORD, string produitName)
        {
            return _repository.GetComent(ORD,produitName);
        }

       public int GetNote(string ORD, string produitName)
        {
            return _repository.GetNote(ORD, produitName);
        }

        public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            _repository.ajouterCommentaire(ORD,produitName,commentaire);
        }

        public void UpdateProductQuantity(int id, int nouvelleQuantite)
        {
            _repository.UpdateProductQuantity(id,nouvelleQuantite);
        }
    }
}