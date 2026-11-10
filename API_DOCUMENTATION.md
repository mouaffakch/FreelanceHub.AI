# API Documentation - FreelanceHub Backend

Endpoints attendus du backend Spring Boot (http://localhost:8080/api)

## Authentication Endpoints

### POST /auth/login
Login utilisateur

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "roleName": "CLIENT"
  }
}
```

### POST /auth/register
Créer un compte

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "roleName": "CLIENT"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "roleName": "CLIENT"
  }
}
```

## Projects Endpoints

### GET /projects
Récupérer tous les projets

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Développement Application Mobile",
    "description": "Créer une application mobile pour iOS et Android",
    "budget": 5000,
    "deadline": "2024-12-31",
    "status": "OPEN",
    "clientId": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### GET /projects/my-projects
Récupérer les projets de l'utilisateur actuel

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Développement Application Mobile",
    "description": "Créer une application mobile pour iOS et Android",
    "budget": 5000,
    "deadline": "2024-12-31",
    "status": "IN_PROGRESS",
    "clientId": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
]
```

### GET /projects/{id}
Récupérer un projet par ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Développement Application Mobile",
  "description": "Créer une application mobile pour iOS et Android",
  "budget": 5000,
  "deadline": "2024-12-31",
  "status": "OPEN",
  "clientId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### POST /projects
Créer un nouveau projet

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Développement Application Mobile",
  "description": "Créer une application mobile pour iOS et Android",
  "budget": 5000,
  "deadline": "2024-12-31"
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "Développement Application Mobile",
  "description": "Créer une application mobile pour iOS et Android",
  "budget": 5000,
  "deadline": "2024-12-31",
  "status": "OPEN",
  "clientId": 1,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

### PUT /projects/{id}
Modifier un projet

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Développement Application Mobile - Modifié",
  "description": "Créer une application mobile pour iOS et Android avec backend",
  "budget": 7000,
  "deadline": "2025-01-31"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Développement Application Mobile - Modifié",
  "description": "Créer une application mobile pour iOS et Android avec backend",
  "budget": 7000,
  "deadline": "2025-01-31",
  "status": "OPEN",
  "clientId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T16:00:00Z"
}
```

### DELETE /projects/{id}
Supprimer un projet

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
```
No Content
```

## Headers Requis

Tous les endpoints protégés nécessitent:
```
Authorization: Bearer <jwt_token>
```

## Codes de Réponse

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 204 | No Content - Suppression réussie |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token invalide/manquant |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource introuvable |
| 500 | Internal Server Error - Erreur serveur |

## Rôles Disponibles

- `ADMIN` : Administrateur du système
- `CLIENT` : Client qui crée les projets
- `FREELANCE` : Freelancer qui accepte les projets

## Statuts de Projet

- `OPEN` : Projet ouvert, en attente de freelancers
- `IN_PROGRESS` : Projet en cours de réalisation
- `COMPLETED` : Projet terminé
- `CANCELLED` : Projet annulé

## Notes d'Implémentation

1. Le token JWT doit être stocké dans `localStorage` avec la clé `token`
2. L'utilisateur doit être stocké dans `localStorage` avec la clé `user`
3. Tous les endpoints retournent JSON
4. Les dates doivent être en format ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
5. Les erreurs doivent retourner un objet avec `message` et potentiellement `errors`

## Exemple d'Erreur

```json
{
  "message": "Email already exists",
  "errors": {
    "email": "Email is already registered"
  }
}
```

## CORS Configuration

Le backend doit permettre les requêtes CORS depuis `http://localhost:4200`

**Spring Boot Configuration:**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Authentication Flow

1. Utilisateur remplit le formulaire de login/register
2. Frontend envoie POST à `/auth/login` ou `/auth/register`
3. Backend valide les credentials et retourne JWT + user
4. Frontend stocke le JWT dans localStorage
5. Pour chaque requête suivante, le JWT est envoyé dans l'header Authorization
6. Backend valide le JWT et traite la requête
7. Si JWT expiré, frontend redirige vers /login

## Rate Limiting (Recommandé)

Implémenter un rate limiting sur le backend pour:
- Login/Register : 5 tentatives par 15 minutes par IP
- API générale : 100 requêtes par minute par utilisateur
