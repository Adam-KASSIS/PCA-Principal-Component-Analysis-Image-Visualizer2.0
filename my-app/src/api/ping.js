import { API_BASE_URL } from '../hooks/usePCA';

export const pingServer = () =>
  fetch(`${API_BASE_URL}/api/datasets`, {
    signal: AbortSignal.timeout(8000)
  });
