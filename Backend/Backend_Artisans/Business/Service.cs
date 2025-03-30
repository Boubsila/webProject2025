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
    }
}
