const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api'

export async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('swiftpay_token')

  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  })

  if (response.status === 401 && !path.includes('/auth/')) {
    localStorage.removeItem('swiftpay_token');
    window.location.href = '/login';
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
