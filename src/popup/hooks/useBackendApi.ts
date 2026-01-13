import { useState } from 'react';
import { apiClient } from '../../shared/services/api-service';

export const useBackendApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async <T>(apiFunc: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc();
      return result;
    } catch (err: any) {
      setError(err.message || 'API call failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, call };
};
