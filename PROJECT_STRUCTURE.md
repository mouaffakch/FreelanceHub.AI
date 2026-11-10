# FreelanceHub Frontend

Une application Angular 17/18+ Standalone Components complète et fonctionnelle connectée à une API Spring Boot.

## Caractéristiques

- ✅ **Authentification** : Login, Register avec JWT
- ✅ **Gestion des rôles** : Admin, Client, Freelancer
- ✅ **Dashboards personnalisés** : Pour chaque rôle
- ✅ **Gestion des projets** : Liste, Création avec formulaire validé
- ✅ **UI Bootstrap 5** : Responsive et moderne
- ✅ **Sécurité** : Guards, Interceptors JWT
- ✅ **Validations** : Formulaires réactifs complets

## Structure du Projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Guard de protection des routes
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts      # Intercepteur JWT pour les requêtes HTTP
│   │   └── services/
│   │       ├── auth.service.ts         # Service d'authentification
│   │       └── project.service.ts      # Service de gestion des projets
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/                  # Composant Login
│   │   │   └── register/               # Composant Register
│   │   ├── dashboard/
│   │   │   ├── admin-dashboard/        # Dashboard Admin
│   │   │   ├── client-dashboard/       # Dashboard Client
│   │   │   └── freelance-dashboard/    # Dashboard Freelancer
│   │   └── projects/
│   │       ├── project-list/           # Liste des projets
│   │       └── project-form/           # Formulaire de création
│   ├── models/
│   │   ├── user.model.ts               # Modèles utilisateur
│   │   └── project.model.ts            # Modèles projet
│   ├── shared/
│   │   └── components/
│   │       └── navbar/                 # Composant Navbar
│   ├── app.routes.ts                   # Configuration des routes
│   ├── app.config.ts                   # Configuration Angular
│   ├── app.ts                          # Composant racine
│   ├── app.html                        # Template racine
│   └── app.scss                        # Styles racine
├── styles.scss                         # Styles globaux
└── index.html                          # HTML principal

```

## Installation et Configuration

### Prérequis

- Node.js 18+
- Angular CLI 17+

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# ou
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Configuration API

L'API Spring Boot doit être accessible sur `http://localhost:8080/api`

Modifiez l'URL dans les services si nécessaire :
- [auth.service.ts](src/app/core/services/auth.service.ts)
- [project.service.ts](src/app/core/services/project.service.ts)

## Routes Disponibles

| Route | Accès | Description |
|-------|-------|-------------|
| `/login` | Public | Page de connexion |
| `/register` | Public | Page d'inscription |
| `/dashboard/admin` | Admin | Dashboard administrateur |
| `/dashboard/client` | Client | Dashboard client |
| `/dashboard/freelance` | Freelancer | Dashboard freelancer |
| `/projects` | Authentifié | Liste des projets |
| `/projects/new` | Client | Créer un nouveau projet |

## Modèles de Données

### User
```typescript
{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: 'ADMIN' | 'CLIENT' | 'FREELANCE';
}
```

### Project
```typescript
{
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  clientId: number;
  createdAt: string;
  updatedAt: string;
}
```

## Services Principaux

### AuthService
- `login(credentials: LoginRequest)` - Connecter un utilisateur
- `register(data: RegisterRequest)` - Créer un compte
- `logout()` - Déconnexion
- `isLoggedIn()` - Vérifier la connexion
- `getToken()` - Récupérer le JWT
- `getRole()` - Récupérer le rôle
- `currentUser$` - Observable utilisateur actuel

### ProjectService
- `getAll()` - Récupérer tous les projets
- `getMyProjects()` - Récupérer mes projets
- `create(data)` - Créer un projet
- `getById(id)` - Récupérer un projet
- `update(id, data)` - Modifier un projet
- `delete(id)` - Supprimer un projet

## Sécurité

### JWT Interceptor
Ajoute automatiquement le header `Authorization: Bearer <token>` à toutes les requêtes HTTP.

### Auth Guard
Protège les routes en vérifiant que l'utilisateur est connecté. Redirige vers `/login` sinon.

## Validation des Formulaires

Les formulaires utilisent Angular Reactive Forms avec validations complètes :
- Email valide
- Mot de passe minimum 6 caractères
- Champs requis
- Feedback utilisateur en temps réel

## Styling

- **Bootstrap 5** : Framework CSS principal
- **Bootstrap Icons** : Icônes
- **Responsive** : Mobile-first design
- **SCSS** : Préprocesseur CSS

## Déploiement

### Build Production
```bash
ng build --configuration production
```

### Docker (exemple)
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/freelancehub-frontend /usr/share/nginx/html
EXPOSE 80
```

## Variables d'Environnement

Créez un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Et modifiez les services pour utiliser cette variable.

## Dépannage

### Erreur CORS
Assurez-vous que le backend Spring Boot autorise les requêtes CORS.

### Token expiré
Le token JWT doit être valide. Vérifiez la date d'expiration.

### Routes non trouvées
Assurez-vous que le backend retourne les bonnes données avec les bons noms de champs.

## Développement Futur

- [ ] Gestion des contrats
- [ ] Système de notation/avis
- [ ] Chat en temps réel
- [ ] Notifications
- [ ] Intégration paiement (Stripe/PayPal)
- [ ] Tests unitaires et E2E

## Support

Pour toute question ou problème, créez une issue.

## Licence

MIT License - Libre d'utilisation
