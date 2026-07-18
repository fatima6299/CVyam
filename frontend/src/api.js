const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Erreur ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

export const loginAdmin = (code) =>
  request('/auth/admin', { method: 'POST', body: JSON.stringify({ code }) })
    .then(() => true)
    .catch(() => false)

export const fetchOrders = () => request('/orders')

export const fetchPaidOrder = (email) => request(`/orders/paid?email=${encodeURIComponent(email)}`)

export const createOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) })

export const validateOrder = (id) =>
  request(`/orders/${id}/validate`, { method: 'PATCH' })
