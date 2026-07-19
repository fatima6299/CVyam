import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import * as api from './api.js'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [cvData, setCvData] = useState(null)
  const [orders, setOrders] = useState([])
  const [userOrder, setUserOrder] = useState(null)

  const refreshOrders = () => api.fetchOrders().then(setOrders).catch(() => setOrders([]))
  const refreshUserOrder = (email) => api.fetchPaidOrder(email).then(setUserOrder).catch(() => setUserOrder(null))

  useEffect(() => {
    if (page === 'builder' && user?.email) refreshUserOrder(user.email)
  }, [page, user?.email])

  const login = (name, email, mode) => {
    setUser({ name, email, mode, id: Date.now() })
    setPage('builder')
  }

  const loginAdmin = async (code) => {
    const ok = await api.loginAdmin(code)
    if (ok) { setUser({ admin: true }); refreshOrders(); setPage('admin') }
    else alert('Code incorrect')
  }

  const goPayment = (data) => { setCvData(data); setPage('payment') }

  const confirmPayment = async (method) => {
    const amount = user?.mode === 'auto' ? 500 : 3000
    const { id } = await api.createOrder({ client: user, method, amount, cvData })
    setPage('builder')
    return id
  }

  const validatePayment = async (id) => {
    await api.validateOrder(id)
    refreshOrders()
  }

  if (page === 'landing') return <LandingPage onStart={() => setPage('auth')} onAdmin={() => setPage('auth-admin')} />
  if (page === 'auth') return <AuthPage onLogin={login} onBack={() => setPage('landing')} />
  if (page === 'auth-admin') return <AuthPage admin onLoginAdmin={loginAdmin} onBack={() => setPage('landing')} />
  if (page === 'admin') return <AdminPage orders={orders} onValidate={validatePayment} onRefresh={refreshOrders} onLogout={() => { setUser(null); setPage('landing') }} />
  if (page === 'payment') return <PaymentPage user={user} cvData={cvData} onConfirm={confirmPayment} onBack={() => setPage('builder')} />
  if (page === 'builder') return (
    <BuilderPage
      user={user}
      isPaid={user?.mode === 'free' || !!userOrder}
      onPay={goPayment}
      onLogout={() => { setUser(null); setPage('landing') }}
    />
  )
  return null
}
