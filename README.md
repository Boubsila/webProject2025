# 🎨 Art Marketplace Platform  
📅 **Date de début :** 27 janvier 2025  

## 📌 Introduction  
L'**Art Marketplace Platform** est une marketplace en ligne où :  
- 🛍️ **Les artisans** exposent et vendent leurs créations.  
- 🛒 **Les clients** explorent et achètent des œuvres.  
- 🚚 **Les livreurs** gèrent la livraison des produits.  

---

## 🛠️ **Technologies utilisées**  

| Technologie  | Description |
|-------------|------------|
| 🎨 **Front-end** | Angular (avec Bootstrap ou Angular Material) |
| 🏗️ **Back-end** | ASP.NET Core (RESTful API) |
| 🗄️ **Base de données** | Entity Framework Core (ORM) |
| 🔑 **Authentification** | JWT-based token authentication |
| 🏛️ **Architecture** | N-tier, basé sur REST |

---

## 🔄 **Cas d'utilisation**  

### 👨‍🎨 Artisan  
- 📸 **Créer et vendre** des produits faits main.  
- 📦 **Gérer les commandes** et mettre à jour leur statut.  
- 📩 **Répondre aux clients** et proposer des personnalisations.  
- 💰 **Consulter les revenus** et suivre les ventes.  

### 🛍️ Client  
- 🔍 **Explorer** les produits (filtrer par catégorie, prix, artisan).  
- ⭐ **Laisser des avis** sur les articles achetés.  
- 📦 **Suivre ses commandes** et voir les détails de livraison.  

### 🚚 Partenaire de livraison  
- 🏠 **Coordonner les ramassages** avec les artisans.  
- 🚛 **Mettre à jour le statut de livraison**.  
- 📌 **Suivre les commandes en cours**.  

### 🔧 Administrateur  
- 👥 **Gérer les utilisateurs** (artisans, clients, livreurs).  
- ✅ **Modérer les contenus** et approuver les produits.  

---

## 🔗 **Interactions**  
✅ **Artisans & Livreurs** → Planification des ramassages.  
✅ **Clients & Artisans** → Discussions sur les personnalisations.  
✅ **Clients & Plateforme** → Notation et avis sur les produits.  

---

## 🔌 **API Endpoints**  (exemples)

📌 **Authentification**  
- `POST /api/auth/register` → Inscription des utilisateurs  

📌 **Artisans**  
- `GET /api/artisans/{id}/products` → Voir et gérer les produits  

📌 **Clients**  
- `GET /api/customers/{id}/orders` → Voir les commandes  

📌 **Livreurs**  
- `GET /api/delivery-partners/{id}/orders` → Suivi des livraisons  

📌 **Administrateurs**  
- `GET /api/admin/users` → Gérer les utilisateurs  

---

## 💻 **Application Frontend**  

### 📌 **Dashboard personnalisé**  
🎨 **Artisan** → Gestion des produits et commandes.  
🛒 **Client** → Suivi des achats et recommandations.  
🚚 **Livreur** → Liste des livraisons à effectuer.  
🔧 **Admin** → Gestion des utilisateurs et produits.  

### 🔍 **Catalogue produits**  
- 🖼️ Affichage des articles avec images, prix et description.  
- 📌 Filtres (catégorie, prix, popularité).  

### 🛒 **Panier & Paiement**  
- 🛍️ Ajout de produits au panier.  
- 💳 Paiement et confirmation de commande.  

### ⭐ **Avis & Notes**  
- ✅ Clients laissent des avis et notes.  
- 🔄 Artisans répondent aux feedbacks.  

### 🔎 **Recherche avancée**  
- 🔍 Recherche par mots-clés.  
- 🎯 Filtres intelligents (prix, popularité, disponibilité).  

### 🛠️ **Panel Admin**  
- 👤 Gestion des utilisateurs.  
- 🛍️ Modération des produits.  
- 📊 Suivi des ventes et tendances.  

---



