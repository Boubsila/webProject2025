# 🛠️ Projet Web : Plateforme Petits Hands

Ce projet permet de connecter plusieurs types d'utilisateurs (Admin, Artisan, Client, Livreur) avec des fonctionnalités adaptées à leurs rôles respectifs.

---

## 🌐 Fonctionnalités principales

### Page d'accueil
- Barre de navigation avec les options :
  - **S'inscrire** : créer un compte (nécessite validation par l'administrateur)
  - **Se connecter** : accès aux tableaux de bord selon le rôle de l'utilisateur

---

## 🔐 Comptes de test

| Rôle     | Email                               | Mot de passe |
|----------|-------------------------------------|--------------|
| Admin    | `su@petitshands.be`                | `admin`      |
| Artisan  | `artinou@petitshands.be`           | `artisan`    |
| Client   | `leo.martin@petitshands.be`        | `client`     |
| Livreur  | `livrapide@petitshands.be`         | `livreur`    |

---

## 👤 Compte **Admin**

### Tableau de bord Admin :
1. **Gestion des utilisateurs**
   - Rechercher par ID, Email, ou Rôle
   - Valider, refuser ou supprimer un compte

2. **Modération des produits**
   - Approuver ou supprimer les produits proposés par les artisans

3. **Statistiques**
   - Nombre d'utilisateurs inscrits (par rôle : artisan, client, livreur actifs)
   - Statistiques de commandes (total, complétées, en attente)
   - Statistiques de produits (total, en attente, approuvées)

---

## 🧑‍🎨 Compte **Artisan**

### Tableau de bord Artisan :
1. **Mes Produits**
   - Ajouter, modifier ou supprimer un produit
   - Les produits ne sont visibles qu'après validation par l'admin

2. **Commandes**
   - Recherche par numéro de commande, client, statut
   - Visualisation : total des ventes, commandes validées, moyennes, annulées
   - Suivi des mises à jour en temps réel
   - Modifier le statut des commandes
   - Accès aux détails des commandes

3. **Avis Clients**
   - Consulter les avis laissés par les clients
   - Répondre aux commentaires (uniquement sur les produits notés/commentés)

---

## 🧑‍💼 Compte **Client**

### Page Catalogue (visible uniquement pour les clients)
- Filtrage des produits par **artisan** et **catégorie**
- Ajout de produits au **panier**

### Tableau de bord Client :
1. **Historique des commandes**
   - Suivi des commandes passées
   - Détails et évolution des statuts

2. **Panier**
   - Voir les produits ajoutés
   - Passer une commande

3. **Avis**
   - Noter les produits livrés uniquement
   - Ajouter des commentaires supplémentaires

---

## 🚚 Compte **Livreur**

### Tableau de bord Livreur :
1. **Commandes assignées**
   - Voir uniquement les commandes prêtes à être ramassées
   - Recherche par numéro de commande, client, artisan
   - Consultation des détails

2. **Statut de livraison**
   - Mise à jour du statut des livraisons
   - Recherche avancée par critères

---

## 📝 Remarques supplémentaires

- La création d’un compte ne donne pas un accès immédiat : un administrateur doit l’activer.
- Les produits ajoutés par les artisans sont soumis à modération.
- Les commandes peuvent évoluer en statut (En attente → En traitement → Prêt → Prélevé → En livraison → Livré), selon les actions du vendeur et du livreur.
- Seuls les produits effectivement livrés peuvent être notés ou commentés.