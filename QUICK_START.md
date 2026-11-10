# 🚀 Guide de Démarrage Rapide - FreelanceHub Frontend

## ⚡ Démarrage en 5 minutes

### 1. Installation des dépendances

```bash
npm install
```

### 2. Démarrer le serveur de développement

```bash
ng serve
# ou
npm start
```

L'application ouvrira automatiquement sur [http://localhost:4200](http://localhost:4200)

### 3. Vérifier que le backend est actif

Assurez-vous que votre API Spring Boot s'exécute sur `http://localhost:8080`

### 4. Créer un compte

1. Cliquez sur "Register"
2. Remplissez le formulaire avec:
   - Prénom et Nom
   - Email
   - Mot de passe (min 6 caractères)
   - Sélectionnez votre rôle (Client ou Freelancer)
3. Cliquez sur "Register"

### 5. Se connecter

1. Cliquez sur "Login"
2. Entrez vos identifiants
3. Vous serez redirigé vers votre dashboard

## 📁 Structure des Dossiers

```
src/app/
├── core/              # Services, Guards, Interceptors
├── features/          # Pages et composants métier
├── models/            # Interfaces TypeScript
└── shared/            # Composants réutilisables
```

## 🔐 Authentification

- JWT stocké dans `localStorage` sous la clé `token`
- Utilisateur stocké dans `localStorage` sous la clé `user`
- Token automatiquement ajouté aux requêtes HTTP via l'intercepteur

## 🛡️ Rôles et Accès

| Rôle | Accès |
|------|-------|
| **Admin** | Dashboard Admin |
| **Client** | Dashboard + Créer Projets |
| **Freelancer** | Dashboard + Consulter Projets |

## 📱 Composants Principaux

### Pages
- **Login** : `/login`
- **Register** : `/register`
- **Project List** : `/projects`
- **Create Project** : `/projects/new`
- **Admin Dashboard** : `/dashboard/admin`
- **Client Dashboard** : `/dashboard/client`
- **Freelancer Dashboard** : `/dashboard/freelance`

### Services
- `AuthService` : Gestion de l'authentification
- `ProjectService` : Gestion des projets
- `jwtInterceptor` : Ajout du token JWT
- `authGuard` : Protection des routes

## 🎨 Styling

- **Bootstrap 5** pour le framework CSS
- **Bootstrap Icons** pour les icônes
- SCSS personnalisé pour les styles additionnels
- Entièrement responsive

## 🔧 Configuration

### Changer l'URL de l'API

Modifiez dans les services :

```typescript
// src/app/core/services/auth.service.ts
private apiUrl = 'http://votre-api:port/api';

// src/app/core/services/project.service.ts
private apiUrl = 'http://votre-api:port/api/projects';
```

## 📦 Build Production

```bash
ng build --configuration production
```

Les fichiers compilés seront dans le dossier `dist/`

## 🧪 Tester un formulaire

### Formulaire Login
```
Email: test@example.com
Password: password123
```

### Formulaire Register
```
First Name: Jean
Last Name: Dupont
Email: jean.dupont@example.com
Password: password123
Account Type: Client
```

### Formulaire Création Projet
```
Title: Mon Application Web
Description: Développer une application web complète avec Angular et Node.js
Budget: 2500
Deadline: 2024-12-31
```

## 🐛 Dépannage Courant

### Erreur CORS
**Problème**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: Configurez CORS dans votre backend Spring Boot

### Page Blanche après Login
**Problème**: Le dashboard ne s'affiche pas

**Solution**: Vérifiez que l'API retourne bien le rôle dans la réponse

### FormControl non trouvé
**Problème**: `Error: Cannot find control with name: 'fieldName'`

**Solution**: Vérifiez que le FormGroup a tous les FormControls définis

## 📚 Ressources Utiles

- [Angular Documentation](https://angular.dev)
- [Bootstrap Documentation](https://getbootstrap.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

## 🚨 Notes Importantes

1. ✅ Le projet utilise **Angular 17/18+ avec Standalone Components**
2. ✅ Les formulaires sont **réactifs** avec validations complètes
3. ✅ L'authentification utilise **JWT** avec localStorage
4. ✅ Les routes sont **protégées** par authGuard
5. ✅ Bootstrap **5** est inclus et utilisé partout

## 📞 Support

Si vous rencontrez un problème:

1. Vérifiez la console du navigateur (F12) pour les erreurs
2. Vérifiez que le backend est actif
3. Vérifiez les logs du terminal où ng serve s'exécute

## ✨ Prochaines Étapes

- [ ] Implémenter la gestion des contrats
- [ ] Ajouter un système de notation
- [ ] Intégrer un chat en temps réel
- [ ] Ajouter les notifications
- [ ] Implémenter la pagination
- [ ] Ajouter des tests unitaires

---

**Bon développement! 🎉**
