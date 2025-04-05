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
        public IEnumerable<livraisonTest> GetLivraisons() => _repository.GetLivraisons();

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
            _repository.updateProduct(id,nom,description,prix,categorie,image,quantite);
        }
    }
}
