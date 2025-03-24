using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string Role { get; set; }
        public Boolean Statut { get; set; }

        // Relations
       

        public Artisan? Artisan { get; set; }
        public Client? Client { get; set; }
        public PartenaireLivraison? PartenaireLivraison { get; set; }


        //migration test 

        public User(int id, string username, string password, string salt, string role, bool statut)
        {
            Id = id;
            Username = username;
            Password = password;
            Salt = salt;
            Role = role;
            Statut = statut;
        }
    }
}
