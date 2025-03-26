using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Business
{
    public interface IService
    {
        IEnumerable<livraisonTest> GetLivraisons();
        public void DeleteUser(int Id);
        void AddUser(User user);
        //migration test
        List<User> GetUsers();


    }
}
