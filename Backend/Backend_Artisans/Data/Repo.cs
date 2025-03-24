using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;



namespace Data
{
    public class Repo : IRepo
    {
        private static List<livraisonTest> livraisons = new List<livraisonTest>
        {
            new livraisonTest {id = 1345, numeroDeCommande = 11345, statut = "En attente", dateDenlevement = "2021-04-01"},
            new livraisonTest {id = 22367, numeroDeCommande = 223672, statut = "Livrée", dateDenlevement = "2021-03-01"},
            new livraisonTest {id = 3987, numeroDeCommande = 33987, statut = "En attente", dateDenlevement = "2021-06-01"},
            new livraisonTest {id = 49009, numeroDeCommande = 490094, statut = "En attente", dateDenlevement = "2021-08-01"},
            new livraisonTest {id = 554675, numeroDeCommande = 5546755, statut = "En attente", dateDenlevement = "2021-02-01"},
            new livraisonTest {id = 34226, numeroDeCommande = 634226, statut = "En attente", dateDenlevement = "2021-01-01"},
            new livraisonTest {id = 768895, numeroDeCommande = 7688957, statut = "En attente", dateDenlevement = "2021-11-01"},
            new livraisonTest {id = 098865, numeroDeCommande = 0988658, statut = "En attente", dateDenlevement = "2021-1-01"},
            new livraisonTest {id = 23534, numeroDeCommande = 923534, statut = "En attente", dateDenlevement = "2021-08-01"},
            new livraisonTest {id = 4345667, numeroDeCommande = 143456670, statut = "En attente", dateDenlevement = "2021-09-01"}
            
        };

        //migration test
        private static List<User> users = new List<User>
        {
            new User ( 1,  "admin@artisans.be",  "admin", Guid.NewGuid().ToString(), "Admin",  true ),
            new User ( 2, "artisan@artisans.be", "artisan", Guid.NewGuid().ToString(), "artisan", false ),
            new User ( 3, "c@artisans.be", "3892C265A1C4F640E7C7", Guid.NewGuid().ToString(), "client", true ),
            new User ( 4,"admin2@artisans.be","4326FACBD8C1467C6FC7","f6893125-485c-4439-a443-d4600865f788","Admin",true)
        };

        public IEnumerable<livraisonTest> GetLivraisons() => livraisons;

        //migration test
        public List<User> GetUsers()
        {
            return users;
        }
        //migration test
        public void AddUser (User user)
        {
            users.Add(user);
        }
    }
}
