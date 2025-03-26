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
    }
}
