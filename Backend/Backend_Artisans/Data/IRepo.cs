using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public interface IRepo
    {
        IEnumerable<livraisonTest> GetLivraisons();

        //migration test
        List<User> GetUsers();

        void AddUser(User user);

        void DeleteUser(int Id);
    }
}
