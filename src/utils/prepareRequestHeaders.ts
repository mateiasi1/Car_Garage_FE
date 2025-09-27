export function prepareRequestHeaders(headers: Headers) {
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const token = localStorage.getItem('access_token');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
