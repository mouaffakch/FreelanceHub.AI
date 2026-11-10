export const APP_CONFIG = {
  APP_NAME: 'FreelanceHub',
  APP_VERSION: '1.0.0',
  
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    LANGUAGE: 'language'
  },
  
  ROLES: {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
    FREELANCE: 'FREELANCE'
  },
  
  PROJECT_STATUS: {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  },
  
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^[0-9]{10,15}$/
  },
  
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token'
    },
    PROJECTS: {
      LIST: '/projects',
      MY_PROJECTS: '/projects/my-projects',
      CREATE: '/projects',
      GET_BY_ID: '/projects/:id',
      UPDATE: '/projects/:id',
      DELETE: '/projects/:id'
    }
  },
  
  HTTP_CONFIG: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
  }
};

export const DASHBOARD_ROUTES = {
  ADMIN: '/dashboard/admin',
  CLIENT: '/dashboard/client',
  FREELANCE: '/dashboard/freelance'
};

export const PUBLIC_ROUTES = ['/login', '/register'];
