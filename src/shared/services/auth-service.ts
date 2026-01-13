import { storage } from '../utils/storage';
import { apiClient } from './api-service';
import { User, AuthResponse } from '../types';

export const AuthService = {
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    await storage.set('auth_token', response.token);
    await storage.set('current_user', response.user);
    return response.user;
  },

  async register(email: string, password: string): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', { email, password });
    await storage.set('auth_token', response.token);
    await storage.set('current_user', response.user);
    return response.user;
  },

  async logout(): Promise<void> {
    await storage.remove('auth_token');
    await storage.remove('current_user');
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>('current_user');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storage.get<string>('auth_token');
    return !!token;
  }
};
