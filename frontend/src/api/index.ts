let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
// Ensure the base URL is absolute if it looks like a domain
if (baseUrl && !baseUrl.startsWith('http') && !baseUrl.startsWith('/')) {
  baseUrl = `https://${baseUrl}`
}
// Remove trailing slash if present
const BASE_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

export async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('swiftpay_token')

  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Network error: Could not reach the server.');
  }

  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    throw new Error(`Server Error: Received unexpected response format (Status: ${response.status})`);
  }

  if (response.status === 401 && !path.includes('/auth/')) {
    localStorage.removeItem('swiftpay_token');
    window.location.href = '/login';
  }

  if (response.status === 403 && data.status === 'blocked') {
    const storedUser = localStorage.getItem('swiftpay_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.status = 'blocked';
      localStorage.setItem('swiftpay_user', JSON.stringify(user));
    }
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
}
