# FreelanceHub Frontend

Application Angular 17+ complète pour la plateforme FreelanceHub, connectée à l'API Spring Boot.

## Structure du Projet

```
src/
├── app/
│   ├── models/                 # Interfaces TypeScript
│   │   ├── user.model.ts      # User, AuthResponse, LoginRequest, RegisterRequest
│   │   └── project.model.ts   # Project, ProjectRequest
│   ├── core/
│   │   ├── services/          # Services injectables
│   │   │   ├── auth.service.ts       # Authentification avec BehaviorSubject
│   │   │   └── project.service.ts    # Gestion des projets
│   │   ├── interceptors/      # Intercepteurs HTTP
│   │   │   └── jwt.interceptor.ts    # Ajout du token Bearer
│   │   └── guards/            # Guards de protection
│   │       └── auth.guard.ts        # Vérification de connexion
│   ├── shared/
│   │   └── components/
│   │       └── navbar/         # Navigation partagée
│   │           ├── navbar.component.ts
│   │           ├── navbar.component.html
│   │           └── navbar.component.scss
│   ├── features/
│   │   ├── auth/               # Authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/          # Dashboards par rôle
│   │   │   ├── admin-dashboard/
│   │   │   ├── client-dashboard/
│   │   │   └── freelance-dashboard/
│   │   └── projects/           # Gestion des projets
│   │       ├── project-list/
│   │       └── project-form/
│   ├── app.routes.ts           # Routing principal
│   ├── app.config.ts           # Configuration de l'app
│   └── app.html                # Template principal
├── index.html                   # HTML avec Bootstrap 5
└── styles.scss                  # Styles globaux

```

## Installation et Configuration

### Prérequis
- Node.js 18+
- Angular CLI 17+
- API Spring Boot running on `http://localhost:8080/api`

### Installation

```bash
npm install
```

### Démarrage du serveur de développement

```bash
ng serve
# ou
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Configuration API

L'API de base est configurée à `http://localhost:8080/api`. 

Modifier cette URL dans :
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/project.service.ts`

## Fonctionnalités

### Authentification
- Login avec email/password
- Inscription (Client/Freelancer)
- Stockage du token JWT en localStorage
- BehaviorSubject pour l'état utilisateur courant
- Redirection automatique selon le rôle (ADMIN/CLIENT/FREELANCE)

### Sécurité
- JWT Interceptor : ajout automatique du header `Authorization: Bearer <token>`
- Auth Guard : protection des routes nécessitant une connexion
- Logout avec nettoyage du localStorage

### Dashboards Rôle-Basé
- **Admin** : `/dashboard/admin` - Statistiques globales
- **Client** : `/dashboard/client` - Gestion des projets avec bouton "New Project"
- **Freelancer** : `/dashboard/freelance` - Parcourir les projets disponibles

### Gestion des Projets
- **Lister** : `/projects` - Affichage en cartes Bootstrap avec pagination
- **Créer** : `/projects/new` - Formulaire complet avec validation
- **Filtrer** : Par statut, budget, deadline

### Navbar Partagée
- Logo "FreelanceHub AI"
- Lien "Projects" (visible si connecté)
- Boutons Login/Register (visible si déconnecté)
- Bouton Logout (visible si connecté)
- Responsive sur mobile

## Composants Standalone

Tous les composants sont standalone :
- Imports explicites de dépendances
- Pas de NgModule requis
- Lazy loading optimisé

## Formulaires Réactifs

Utilisation de `FormBuilder` et `ReactiveFormsModule` pour :
- Validation en temps réel
- Messages d'erreur détaillés
- Gestion du loading
- Affichage des erreurs d'API

## Styles Bootstrap 5

- CDN Bootstrap inclus dans `index.html`
- Bootstrap Icons pour les icônes
- Personnalisation SCSS dans chaque composant
- Responsive design (mobile-first)

## Routes Protégées

```
/login                 → Public
/register              → Public
/dashboard/admin       → Protégé (ADMIN)
/dashboard/client      → Protégé (CLIENT)
/dashboard/freelance   → Protégé (FREELANCE)
/projects              → Protégé (tous connectés)
/projects/new          → Protégé (tous connectés)
```

## Variables d'Environnement

Créer un fichier `src/environments/environment.ts` pour les configurations :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Build Production

```bash
ng build --configuration production
```

Output dans `dist/freelancehub-frontend/`

## Tests

```bash
ng test                 # Unit tests
ng e2e                  # E2E tests
```

## Dépendances Principales

- **@angular/core** : Framework Angular
- **@angular/common/http** : Client HTTP
- **@angular/forms** : Formulaires réactifs
- **bootstrap** : CSS Framework (CDN)
- **rxjs** : Programmation réactive

## Conventions de Code

- Composants standalone avec `@Component`
- Services injectables avec `providedIn: 'root'`
- Interfaces TypeScript pour les modèles
- Nommage: `*.component.ts`, `*.service.ts`, `*.guard.ts`, `*.interceptor.ts`
- Styles SCSS avec nesting

## Support

Pour toute question ou bug, contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : October 2026
