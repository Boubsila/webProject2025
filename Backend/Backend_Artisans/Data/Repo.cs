using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Domain;



namespace Data
{
    public class Repo : IRepo
    {

        private readonly AppDbContext _context;

        public Repo(AppDbContext context)
        {
            _context = context;
        }

        //user list 
        //private static List<User> users = new List<User>
        //{

        //    new User ( 1,"su@artisans.be","4326FACBD8C1467C6FC7","f6893125-485c-4439-a443-d4600865f788","Admin",true),
        //    new User ( 2,"client","BD605BE48F3DDE7AEE95","399f10b0-f976-4079-b0a0-1461f45fa58e","client",true),
        //    new User ( 3,"artisan","C32665DFD1F098F185D4","d264db82-396a-4ffa-9671-f3cc7fee2489","artisan",true),
        //    new User ( 4,"client2","C530C1D1A88CAD432ED0","e90be96d-2702-4d77-877d-c0e01ede0203","client",true),
        //    new User ( 5,"artisan2","3E58AFA6264EF7CBEABA","8b3259fa-956f-488f-ab4e-c6c7505eaa24","artisan",true),
        //    new User ( 6,"livreur","F13CF38BDAEF1226A615","b8379950-1121-49de-97e6-32e4efa39227","livreur",true),
        //    new User ( 7,"livreur2","A490A041B03D2F38BA9F","1ac810de-3657-4346-a3dd-ff401988214b","livreur",true)



        //};

        //product list
        //private static List<Produit> produits = new List<Produit>
        //{
        //    new Produit(1, "Vase en Céramique Tourné à la Main", "Vase unique en céramique, tourné et décoré à la main avec des motifs traditionnels.", 85.00, "Poterie et Céramique", "images/1.jpg", 50, "artisan", "approved"),
        //    new Produit(2, "Tapis Berbère en Laine Naturelle", "Tapis berbère authentique, tissé à la main avec de la laine naturelle et des motifs géométriques.", 2500.00, "Tissage et Tapis", "images/2.jpg", 30, "artisan2", "approved"),
        //    new Produit(3, "Sac à Main en Cuir Véritable", "Sac à main élégant en cuir véritable, tanné et cousu à la main par des artisans locaux.", 120.00, "Travail du Cuir (Tanneries)", "images/3.jpg", 100, "artisan", "approved"),
        //    new Produit(4, "Table Basse en Bois de Cèdre Sculpté", "Table basse unique en bois de cèdre, sculptée à la main avec des motifs floraux et géométriques.", 350.00, "Travail du Bois (Menuiserie et Marqueterie)", "images/4.jpg", 25, "artisan2", "approved"),
        //    new Produit(5, "Lanterne en Fer Forgé", "Lanterne artisanale en fer forgé, réalisée à la main avec des motifs traditionnels.", 180.00, "Métallurgie et Ferronnerie", "images/5.jpg", 75, "artisan", "approved"),
        //    new Produit(6, "Collier en Argent et Pierres Précieuses", "Collier artisanal en argent, orné de pierres précieuses et réalisé avec des techniques traditionnelles.", 220.00, "Bijouterie et Orfèvrerie", "images/6.jpg", 10, "artisan2", "approved"),
        //    new Produit(7, "Écharpe Brodée à la Main", "Écharpe en laine douce, brodée à la main avec des motifs colorés et traditionnels.", 60.00, "Autres", "images/7.jpg", 20, "artisan", "approved"),
        //    new Produit(8, "Panier en Osier Tressé", "Panier artisanal en osier, tressé à la main avec des techniques traditionnelles.", 45.00, "Autres", "images/8.jpg", 30, "artisan2", "approved"),
        //    new Produit(9, "Panneau Mural en Zellige", "Panneau mural décoratif en zellige, réalisé à la main avec des motifs géométriques complexes.", 300.00, "Autres", "images/9.jpg", 0, "artisan", "approved"),
        //    new Produit(10, "Lampe en Tadelakt", "Lampe artisanale en tadelakt, réalisée à la main avec des techniques traditionnelles.", 150.00, "Poterie et Céramique", "images/10.jpg", 0, "artisan2", "approved")
        //};
//        [
//  { "nom": "Vase traditionnel", "description": "Vase décoratif au style intemporel, parfait pour embellir tout espace de vie.", "prix": 75.00 },
//  { "nom": "Vase élégant", "description": "Création artisanale au design raffiné, idéale comme pièce centrale ou décorative.", "prix": 80.00 },
//  { "nom": "Vase artistique", "description": "Un objet décoratif unique qui apporte une touche de charme à votre intérieur.", "prix": 70.00 },
//  { "nom": "Vase unique", "description": "Vase de caractère au style soigné, adapté à différents styles de décoration.", "prix": 85.00 },

//  { "nom": "Tapis classique", "description": "Tapis décoratif apportant chaleur et authenticité à votre intérieur.", "prix": 2400.00 },
//  { "nom": "Tapis décoratif", "description": "Accessoire élégant pour habiller le sol et renforcer l'ambiance d'une pièce.", "prix": 2300.00 },
//  { "nom": "Tapis design", "description": "Pièce textile à motifs soignés, idéale pour compléter votre décoration.", "prix": 2200.00 },
//  { "nom": "Tapis élégant", "description": "Tapis aux lignes équilibrées, qui crée une atmosphère chaleureuse.", "prix": 2500.00 },

//  { "nom": "Sac chic", "description": "Accessoire pratique et esthétique à porter au quotidien.", "prix": 110.00 },
//  { "nom": "Sac moderne", "description": "Un sac raffiné qui allie élégance et fonctionnalité.", "prix": 100.00 },
//  { "nom": "Sac tendance", "description": "Sac polyvalent pour accompagner toutes vos sorties avec style.", "prix": 115.00 },
//  { "nom": "Sac artisanal", "description": "Pièce de caractère pour compléter votre tenue avec une touche unique.", "prix": 125.00 },

//  { "nom": "Table raffinée", "description": "Table basse qui s’intègre harmonieusement à tout style de décoration.", "prix": 340.00 },
//  { "nom": "Table décorative", "description": "Meuble décoratif parfait pour agrémenter votre salon ou entrée.", "prix": 330.00 },
//  { "nom": "Table originale", "description": "Table avec finitions soignées qui attire le regard et suscite l’intérêt.", "prix": 320.00 },
//  { "nom": "Table élégante", "description": "Mobilier élégant et pratique, idéal pour les espaces de détente.", "prix": 350.00 },

//  { "nom": "Collier précieux", "description": "Bijou délicat qui apporte une note d'élégance à votre look.", "prix": 200.00 },
//  { "nom": "Collier raffiné", "description": "Accessoire de charme pour accompagner vos tenues préférées.", "prix": 180.00 },
//  { "nom": "Collier classique", "description": "Bijou au style sobre, idéal pour toutes les occasions.", "prix": 190.00 },
//  { "nom": "Collier artisanal", "description": "Collier original avec une touche authentique et unique.", "prix": 210.00 },

//  { "nom": "Écharpe fine", "description": "Accessoire textile léger et coloré pour sublimer votre style.", "prix": 55.00 },
//  { "nom": "Écharpe tendance", "description": "Écharpe douce et confortable, parfaite en toute saison.", "prix": 50.00 },
//  { "nom": "Écharpe chic", "description": "Élément vestimentaire élégant, adapté à de nombreuses tenues.", "prix": 60.00 },
//  { "nom": "Écharpe originale", "description": "Pièce textile unique à l’allure authentique et moderne.", "prix": 65.00 },

//  { "nom": "Panier déco", "description": "Panier décoratif pratique pour organiser ou embellir un coin de la maison.", "prix": 45.00 },
//  { "nom": "Panier élégant", "description": "Accessoire de rangement esthétique qui complète votre intérieur.", "prix": 42.00 },
//  { "nom": "Panier traditionnel", "description": "Objet utile et charmant qui évoque le savoir-faire artisanal.", "prix": 48.00 },
//  { "nom": "Panier pratique", "description": "Panier au design simple et fonctionnel pour un usage quotidien.", "prix": 50.00 },

//  { "nom": "Panneau décoratif", "description": "Panneau mural inspiré d’un design classique pour habiller vos murs.", "prix": 280.00 },
//  { "nom": "Panneau mural", "description": "Élément artistique pour apporter de la personnalité à une pièce.", "prix": 290.00 },
//  { "nom": "Panneau artistique", "description": "Panneau ornemental idéal pour valoriser un espace vide.", "prix": 300.00 },

//  { "nom": "Lanterne classique", "description": "Source lumineuse douce et élégante pour créer une ambiance chaleureuse.", "prix": 175.00 },
//  { "nom": "Lanterne décorative", "description": "Objet lumineux au charme artisanal, parfait pour un intérieur apaisant.", "prix": 180.00 },
//  { "nom": "Lanterne élégante", "description": "Lanterne au design équilibré qui diffuse une lumière agréable.", "prix": 185.00 },
//  { "nom": "Lanterne charmante", "description": "Lanterne d’ambiance qui enrichit votre décoration avec subtilité.", "prix": 170.00 },

//  { "nom": "Lampe traditionnelle", "description": "Lampe décorative qui s’adapte à tout espace pour une ambiance douce.", "prix": 150.00 },
//  { "nom": "Lampe magnifique", "description": "Source de lumière élégante pour illuminer avec style vos pièces.", "prix": 160.00 },
//  { "nom": "Lampe classique", "description": "Lampe polyvalente, parfaite pour une déco sobre et soignée.", "prix": 155.00 },
//  { "nom": "Lampe design", "description": "Lampe au style affirmé qui complète harmonieusement tout décor.", "prix": 165.00 }
//]


        //Order liste

        //private static List<Commande> commandes = new List<Commande>
        //{

        //    new Commande(0,"ORD_test_Order",1,"test","artisan","client","","12/04/25","Expédiée",false,10,20,"","",""),


        //};

        // Avis liste 

        //private static List<Avis> avisList = new List<Avis>
        //{
        //    new Avis (0,"ORD1","product1", "client",5,new List<string> { "Top product"}, "16/06/2025"),
        //    new Avis (1,"ORD2","product1", "client2",5,new List<string> { "Merci"}, "17/06/2025")

        //};




        //******************* USERS *************************


        public List<User> GetUsers()
        {
            return _context.User.ToList();
        }

        public void AddUser(User user)
        {
            try
            {
                _context.User.Add(user);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur lors de l'ajout du user : " + ex.Message);

            }
        }




        public void DeleteUser(int Id)
        {
            var user = _context.User.Find(Id);  // cherche en base par clé primaire
            if (user != null)
            {
                _context.User.Remove(user);      // supprime de la base
                _context.SaveChanges();          // sauvegarde les changements
            }
        }


        public void UpdateUserStatus(int userId, bool newStatus)
        {
            var user = _context.User.Find(userId);
            if (user != null)
            {
                user.Statut = newStatus;
                _context.SaveChanges();
            }
        }


        //******************* Products *************************

        public List<Produit> getAllProducts()
        {
            return _context.Produits.ToList();
        }

        public void changeProductStatus(int id)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Statut = "approved";
                _context.SaveChanges();
            }
        }

        public void deleteProduct(int id)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                _context.Produits.Remove(produit);
                _context.SaveChanges();
            }
        }


        public void addProduct(string nom, string description, double prix, string categorie, string image, int quantite, string artisan, string statut)
        {
            // Générer un nouvel ID unique
            int nouvelId = _context.Produits.ToList().Count > 0 ? _context.Produits.Max(p => p.Id) + 1 : 1;

            // Créer un nouvel objet Produit avec les informations fournies
            Produit nouveauProduit = new Produit(
                nouvelId,
                nom,
                description,
                prix,
                categorie,
                image,
                quantite,
                artisan,
                statut
            );

            // Ajouter le produit à la liste
            _context.Produits.Add(nouveauProduit);
            _context.SaveChanges();
        }

        public List<Produit> GetProductsByArtisanName(string artisanName)
        {
            return _context.Produits
                .Where(p => p.ArtisanName != null &&
                            p.ArtisanName.ToLower() == artisanName.ToLower())
                .ToList();
        }


        //**************************************Produit**********************************************

        //update product 
        public void updateProduct(int id, string nom, string description, double prix, string categorie, string image, int quantite)
        {

            var produit = _context.Produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Nom = nom;
                produit.Description = description;
                produit.Prix = prix;
                produit.Categorie = categorie;
                produit.Image = image;
                produit.Quantite = quantite;

            }
            _context.SaveChanges();
        }

        // update quantity of product
        public void UpdateProductQuantity(int id, int nouvelleQuantite)
        {
            var produit = _context.Produits.FirstOrDefault(p => p.Id == id);

            if (produit != null)
            {
                produit.Quantite = produit.Quantite - nouvelleQuantite;
                _context.SaveChanges();
            }
        }


        //******************* Order *************************

        //get commande
        public List<Commande> GetCommandeList()
        {
            return _context.Commandes.ToList();

        }

        //add commande (panier)
        public void AddCommande(Commande commande)
        {
            // Générer un nouvel ID unique
            int nouvelId = _context.Commandes.ToList().Count > 0 ? _context.Commandes.Max(c => c.Id) + 1 : 1;
            commande.Id = nouvelId;

            _context.Commandes.Add(commande);
            _context.SaveChanges();
        }


        //update commande (commander)
        public void UpdateCommande(int id, string statut, bool isOrdered, string numeroCommande, string? adresseLivraison = null, string? dateLivraison = null)
        {
            var commande = _context.Commandes.FirstOrDefault(c => c.Id == id);

            if (commande != null)
            {
                if (statut != null)
                    commande.statut = statut;
                if (isOrdered != false)
                    commande.isOrderd = isOrdered;

                if (adresseLivraison != null)
                    commande.adresseLivraison = adresseLivraison;

                if (dateLivraison != null)
                    commande.dateLivraison = dateLivraison;
                if (numeroCommande != null)
                    commande.numeroCommande = numeroCommande;


            }
            _context.SaveChanges();
        }

        // Delete order

        public void DeleteCommande(int id)
        {
            var commande = _context.Commandes.FirstOrDefault(c => c.Id == id);

            if (commande != null)
            {
                _context.Commandes.Remove(commande);
            }

            _context.SaveChanges();
        }

        // recuperer les commandes par nom d'artisan
        public List<Commande> GetCommandesByArtisanName(string artisanName)
        {
            return _context.Commandes
                    .Where(c => c.artisanName != null && c.artisanName.ToLower() == artisanName.ToLower())
                    .ToList();
        }

        // change le statut de la commande 
        public void ChangeOrderStatus(string numeroCommande, string nouveauStatut)
        {
            var commande = _context.Commandes
                .FirstOrDefault(c => c.numeroCommande != null && c.numeroCommande.ToLower() == numeroCommande.ToLower());
            if (commande != null)
            {
                commande.statut = nouveauStatut;
                _context.SaveChanges();
            }
        }

        //ajouter l'adresse d'enlevment 

        public void addPickupAdres(string nmOrder, string adresse, string livreur)
        {
            var commande = _context.Commandes
                .FirstOrDefault(c => c.numeroCommande != null && c.numeroCommande.ToLower() == nmOrder.ToLower());
            if (commande != null)
            {
                commande.adresseDenlevement = adresse;
                commande.livreurName = livreur;
                _context.SaveChanges();
            }
        }

        //Change le statut de la commande multi artisan 

        public void ChangeCommandeStatusByProductAndArtisan(string numeroCommande, string artisanName, string nouveauStatut)
        {
            var commandesAModifier = _context.Commandes
                .Where(c =>
            c.numeroCommande != null &&
            c.artisanName != null &&
            c.numeroCommande.ToLower() == numeroCommande.ToLower() &&
            c.artisanName.ToLower() == artisanName.ToLower())
                .ToList();

            foreach (var commande in commandesAModifier)
            {
                commande.statut = nouveauStatut;
            }

            _context.SaveChanges();
        }


        //+++++++************** AVIS ********************//

        //public void AjouterAvis(Avis avis)
        //{
        //    // Vérifier si l'avis existe déjà pour la même commande et le même produit  
        //    var avisExistant = avisList.FirstOrDefault(a =>
        //        a.NumeroCommande == avis.NumeroCommande &&
        //        a.ProduitName == avis.ProduitName);

        //    if (avisExistant != null )
        //    {
        //        throw new ArgumentException("Vous avez déjà soumis un avis pour ce produit.");
        //    }
        //        // Ajouter un ID unique à l'avis  
        //        avis.Id = avisList.Count > 0 ? avisList.Max(a => a.Id) + 1 : 1;

        //        // Formater le commentaire initial et l'ajouter à la liste des commentaires  
        //        string commentaireFormate = $"{avis.Commentaire.FirstOrDefault()}, {DateTime.Now:dd-MM-yy, HH:mm:ss}";
        //        avis.Commentaire = new List<string> { commentaireFormate };

        //        // Ajouter l'avis à la liste  
        //        avisList.Add(avis);


        //}

        //public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        //{
        //    // Trouver l'avis correspondant à la commande et au produit
        //    var avis = avisList.FirstOrDefault(a =>
        //        a.NumeroCommande == ORD &&
        //        a.ProduitName == produitName);

        //    if (avis != null)
        //    {
        //        // Formater le nouveau commentaire avec la date/heure actuelle
        //        string commentaireFormate = $"{commentaire} , {DateTime.Now:dd-MM-yy, HH:mm:ss}";

        //        // Ajouter le commentaire formaté à la liste des commentaires de l'avis
        //        avis.Commentaire.Add(commentaireFormate);
        //    }
        //    else
        //    {

        //        throw new InvalidOperationException($"Avis non trouvé pour la commande {ORD} et le produit {produitName}");
        //    }
        //}

        //public List<string> GetComent(string ORD, string produitName)
        //{
        //    return avisList
        //        .Where(a => a.NumeroCommande == ORD && a.ProduitName == produitName)
        //        .SelectMany(a => a.Commentaire) 
        //        .ToList();
        //}


        //public int GetNote(string ORD, string produitName)
        //{
        //    _context.Avis
        //    // Recherche de l'avis correspondant à la commande et au produit
        //    var avis = avisList
        //        .FirstOrDefault(a => a.NumeroCommande == ORD && a.ProduitName == produitName);

        //    // Si un avis a été trouvé, retourner la note, sinon retourner une valeur par défaut (par exemple, 0)
        //    return avis?.Note ?? 0; // Si avis est null, retourne 0
        //}

        public void AjouterAvis(Avis avis)
        {
            var avisExistant = _context.Avis.FirstOrDefault(a =>
                a.NumeroCommande == avis.NumeroCommande &&
                a.ProduitName == avis.ProduitName);

            if (avisExistant != null)
            {
                throw new ArgumentException("Vous avez déjà soumis un avis pour ce produit.");
            }

            int maxId = _context.Avis.Any() ? _context.Avis.Max(a => a.Id) + 1 : 1;
            avis.Id = maxId;

            string commentaireFormate = $"{avis.Commentaire.FirstOrDefault()}, {DateTime.Now:dd-MM-yy, HH:mm:ss}";
            avis.Commentaire = new List<string> { commentaireFormate };

            _context.Avis.Add(avis);
            _context.SaveChanges();
        }

        public void ajouterCommentaire(string ORD, string produitName, string commentaire)
        {
            var avis = _context.Avis.FirstOrDefault(a =>
                a.NumeroCommande == ORD &&
                a.ProduitName == produitName);

            if (avis != null)
            {
                string commentaireFormate = $"{commentaire} , {DateTime.Now:dd-MM-yy, HH:mm:ss}";
                var commentaires = avis.Commentaire;
                commentaires.Add(commentaireFormate);
                avis.Commentaire = commentaires;

                _context.Avis.Update(avis);
                _context.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException($"Avis non trouvé pour la commande {ORD} et le produit {produitName}");
            }
        }

        public List<string> GetComent(string ORD, string produitName)
        {
            return _context.Avis
                .Where(a => a.NumeroCommande == ORD && a.ProduitName == produitName)
                .AsEnumerable() // force l’évaluation en mémoire
                .SelectMany(a => a.Commentaire)
                .ToList();
        }


        public int GetNote(string ORD, string produitName)
        {
            var avis = _context.Avis
                .FirstOrDefault(a => a.NumeroCommande == ORD && a.ProduitName == produitName);

            return avis?.Note ?? 0;
        }


    }
}