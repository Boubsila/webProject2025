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

    }
}
