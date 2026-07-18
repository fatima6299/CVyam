import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'

// Simple in-memory store (replace with backend/localStorage for prod)
const ADMIN_CODE = 'BDS2024'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [cvData, setCvData] = useState(null)
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bds_orders') || '[]') } catch { return [] }
  })

  const saveOrders = (o) => {
    setOrders(o)
    localStorage.setItem('bds_orders', JSON.stringify(o))
  }

  const login = (name, email, mode) => {
    const u = { name, email, mode, id: Date.now() }
    setUser(u)
    setPage('builder')
  }

  const loginAdmin = (code) => {
    if (code === ADMIN_CODE) { setUser({ admin: true }); setPage('admin') }
    else alert('Code incorrect')
  }

  const goPayment = (data) => { setCvData(data); setPage('payment') }

  const confirmPayment = (method) => {
    const order = {
      id: 'ORD-' + Date.now(),
      client: user,
      method,
      amount: user?.mode === 'auto' ? 2000 : 3000,
      date: new Date().toISOString(),
      status: 'pending',
      cvData
    }
    saveOrders([...orders, order])
    setPage('builder')
    return order.id
  }

  const validatePayment = (id) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status: 'paid' } : o))
  }

  const userOrder = user ? orders.find(o => o.client?.email === user.email && o.status === 'paid') : null

  if (page === 'landing') return <LandingPage onStart={() => setPage('auth')} onAdmin={() => setPage('auth-admin')} />
  if (page === 'auth') return <AuthPage onLogin={login} onBack={() => setPage('landing')} />
  if (page === 'auth-admin') return <AuthPage admin onLoginAdmin={loginAdmin} onBack={() => setPage('landing')} />
  if (page === 'admin') return <AdminPage orders={orders} onValidate={validatePayment} onLogout={() => { setUser(null); setPage('landing') }} />
  if (page === 'payment') return <PaymentPage user={user} cvData={cvData} onConfirm={confirmPayment} onBack={() => setPage('builder')} />
  if (page === 'builder') return (
    <BuilderPage
      user={user}
      isPaid={!!userOrder}
      onPay={goPayment}
      onLogout={() => { setUser(null); setPage('landing') }}
    />
  )
  return null
}
