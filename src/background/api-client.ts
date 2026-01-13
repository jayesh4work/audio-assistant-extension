import { apiClient } from '../shared/services/api-service';

// Background-specific API wrappers can go here
export const BackgroundAPI = {
  async reportStatus(status: string) {
    return await apiClient.post('/status', { status });
  }
};
