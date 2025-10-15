export function prepareRequestHeaders(headers: Headers, arg: string | { method?: string } = {}) {
  const method = typeof arg === 'object' ? arg.method?.toUpperCase() : undefined;

  if (method !== 'DELETE') {
    headers.set('Content-Type', 'application/json');
  }

  headers.set('Accept', 'application/json');

  const token = localStorage.getItem('access_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
