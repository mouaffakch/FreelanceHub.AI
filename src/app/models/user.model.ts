export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roleName: string;
  bio?: string;
  avatar?: string;
  status?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  roleName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleName: string;
}