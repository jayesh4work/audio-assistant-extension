export * from './audio';
export * from './providers';
export * from './settings';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
