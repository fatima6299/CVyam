const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Secret propre à cet appareil/navigateur, généré une fois et jamais affiché ni demandé à l'utilisateur.
// Sert à prouver que c'est bien le même appareil qui a créé la commande avant de renvoyer un CV payé,
// et à retrouver le brouillon en cours sur ce même appareil.
function getClientToken() {
  let token = localStorage.getItem('cvyam_client_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('cvyam_client_token', token)
  }
  return token
}

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

export const fetchPaidOrder = (email) =>
  request(`/orders/paid?email=${encodeURIComponent(email)}&token=${encodeURIComponent(getClientToken())}`)

export const createOrder = (order) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify({ ...order, client: { ...order.client, token: getClientToken() } })
  })

export const validateOrder = (id) =>
  request(`/orders/${id}/validate`, { method: 'PATCH' })

export const consumeDownload = (id) =>
  request(`/orders/${id}/consume-download`, { method: 'POST' })

export const fetchDraft = () =>
  request(`/drafts/${encodeURIComponent(getClientToken())}`)

export const saveDraft = (clientName, clientEmail, tplId, data) =>
  request(`/drafts/${encodeURIComponent(getClientToken())}`, {
    method: 'PUT',
    body: JSON.stringify({ clientName, clientEmail, tplId, data })
  })
