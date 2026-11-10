# FreelanceHub AI

FreelanceHub AI est une plateforme SaaS de mise en relation entre porteurs de projets et freelances informatiques, intégrant des outils d'assistance par intelligence artificielle, un mécanisme de séquestre financier (Escrow) et un espace de travail collaboratif.

---

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Architecture technique](#architecture-technique)
- [Prérequis](#prérequis)
- [Installation et démarrage](#installation-et-démarrage)
  - [1. Base de données](#1-base-de-données)
  - [2. Backend (Spring Boot)](#2-backend-spring-boot)
  - [3. Frontend (Angular)](#3-frontend-angular)
- [API REST et Documentation](#api-rest-et-documentation)
- [Sécurité et Rôles](#sécurité-et-rôles)
- [Licence](#licence)

---

## Vue d'ensemble

FreelanceHub AI structure et sécurise l'intégralité du cycle de vie d'une mission IT :
1. **Publication et cadrage** : Rédaction assistée par IA du cahier des charges et estimation budgétaire.
2. **Candidature et matching** : Analyse sémantique des compétences et recommandation ciblée.
3. **Séquestre financier** : Consignation des fonds par le client avant démarrage.
4. **Livraison et inspection** : Dépôt des livrables (dépôts Git, environnements cloud) et revue technique.
5. **Déblocage et facturation** : Transfert automatique de la rémunération et génération de reçus officiels.
6. **Évaluation certifiée** : Notation 5 étoiles et retour d'expérience rattachés au contrat validé.

---

## Fonctionnalités principales

### 1. Module d'Intelligence Artificielle
- **Générateur de spécifications** : Structuration automatique d'une idée métier en spécifications techniques complètes.
- **Générateur de propositions** : Rédaction de lettres de motivation personnalisées selon le cahier des charges.
- **Optimisation de profil** : Amélioration sémantique des descriptions professionnelles et valorisation des stacks techniques.
- **Smart Matching** : Calcul d'un score d'adéquation entre l'expertise du freelance et les exigences du projet.

### 2. Gestion Financière & Séquestre (Escrow)
- **Consignation sécurisée** : Verrouillage du budget de la mission sous séquestre lors de la sélection du prestataire.
- **Vérification des livrables** : Soumission d'URLs de dépôts de code et notes explicatives par le freelance.
- **Paiement et commissions** : Déblocage de 90% du montant net au freelance et 10% de frais de plateforme lors de la validation.
- **Procédure de litige** : Gel des fonds et arbitrage en cas de non-conformité au cahier des charges initial.
- **Reçus et factures** : Génération de justificatifs certifiés téléchargeables et imprimables en PDF.

### 3. Marketplace & Annuaire
- **Marketplace de missions** : Recherche multi-critères, filtres par technologies (Java, Angular, Python, Docker, etc.) et statuts.
- **Annuaire des talents** : Consultation des profils publics, portfolios de réalisations et historiques de missions validées.
- **Messagerie interne** : Discussion bilatérale chiffrée entre clients et prestataires retenus.

---

## Architecture technique

### Frontend
- **Framework** : Angular 17 / 21 (Composants autonomes / Standalone)
- **Langage** : TypeScript 5
- **Feuilles de styles** : SCSS modulaire, Glassmorphism, Thème sombre
- **Composants d'interface** : Bootstrap 5 et Bootstrap Icons
- **Gestion des flux** : RxJS

### Backend
- **Framework** : Spring Boot 3.4 (Java 21 LTS)
- **Sécurité** : Spring Security 6, Authentification Stateless JWT (io.jsonwebtoken)
- **Accès aux données** : Spring Data JPA, Hibernate 7
- **Base de données relationnelle** : MySQL 8.0+
- **Documentation API** : OpenAPI 3.0 / Swagger UI

---

## Prérequis

Pour installer et exécuter le projet localement, assurez-vous de disposer des éléments suivants :
- **Java Development Kit (JDK)** : Version 21 ou supérieure
- **Node.js** : Version 18.x ou supérieure, avec npm
- **MySQL Server** : Version 8.0 ou supérieure
- **Git**

---

## Installation et démarrage

### 1. Base de données

Connectez-vous à votre serveur MySQL et créez la base de données :

```sql
CREATE DATABASE freelancehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Spring Boot)

Naviguez dans le dossier du backend et démarrez le service :

```bash
cd freelancehub-backend

# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

Le serveur backend écoute sur `http://localhost:8080`.

### 3. Frontend (Angular)

Dans un nouveau terminal, naviguez dans le dossier du frontend et démarrez le serveur de développement :

```bash
cd freelancehub-frontend

# Installation des dépendances
npm install

# Démarrage
npm start
```

L'application web est accessible sur `http://localhost:4200`.

---

## API REST et Documentation

La documentation interactive Swagger OpenAPI est accessible à l'adresse suivante une fois le backend démarré :
`http://localhost:8080/swagger-ui/index.html`

### Endpoints principaux

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur | Public |
| `POST` | `/api/auth/login` | Authentification et émission du token JWT | Public |
| `POST` | `/api/auth/forgot-password` | Demande de réinitialisation de mot de passe | Public |
| `POST` | `/api/auth/reset-password` | Réinitialisation par jeton sécurisé | Public |
| `GET` | `/api/projects` | Liste des missions disponibles | Authentifié |
| `POST` | `/api/projects` | Création d'une nouvelle mission | Client |
| `POST` | `/api/projects/{id}/deliver` | Remise des livrables de projet | Freelance assigné |
| `GET` | `/api/users/freelances` | Annuaire des talents disponibles | Public |
| `POST` | `/api/payments/deposit` | Consignation des fonds sous séquestre | Client |
| `POST` | `/api/payments/release` | Déblocage et versement des fonds | Client |
| `POST` | `/api/payments/dispute` | Déclaration d'un litige | Client |
| `POST` | `/api/reviews` | Enregistrement d'un avis et note 5 étoiles | Client |
| `GET` | `/api/chat/{userId}` | Historique des échanges privés | Authentifié |

---

## Sécurité et Rôles

Le contrôle d'accès s'appuie sur le mécanisme RBAC (Role-Based Access Control) :
- `ROLE_CLIENT` : Publication de projets, sélection des candidatures, consignation et validation des paiements.
- `ROLE_FREELANCE` : Consultation des offres, envoi de candidatures, soumission des livrables et encaissement.
- `ROLE_ADMIN` : Supervision générale, modération des comptes et arbitrage des litiges.

Les mots de passe sont hachés avec l'algorithme BCrypt. Les sessions sont gérées de façon sans état (stateless) via des jetons JWT validés à chaque requête HTTP par un filtre dédié.

---

## Licence

Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus de détails.
