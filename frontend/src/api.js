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
  const headers = { 'Content-Type': 'application/json' }
  const token = getClientToken()
  if (token) {
    headers['x-client-token'] = token
  }
  const authToken = localStorage.getItem('cvyam_token')
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  const res = await fetch(`${API_URL}${path}`, {
    headers,
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

export const fetchUsers = () => request('/users')

export const fetchMe = () => request('/users/me')

export const setAuthToken = (token) => {
  if (token) localStorage.setItem('cvyam_token', token)
  else localStorage.removeItem('cvyam_token')
}

export const register = async ({ name, email, password, mode }) => {
  const res = await request('/users/register', { method: 'POST', body: JSON.stringify({ name, email, password, mode }) })
  if (res && res.token) setAuthToken(res.token)
  return res
}

export const login = async ({ email, password }) => {
  const res = await request('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  if (res && res.token) setAuthToken(res.token)
  return res
}

export const logout = () => setAuthToken(null)

export const mergeClientToken = (clientToken) => request('/users/merge', { method: 'POST', body: JSON.stringify({ client_token: clientToken }) })

export const fetchOrders = () => request('/orders')

export const fetchPaidOrder = (email) =>
  request(`/orders/paid?email=${encodeURIComponent(email)}`)

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
