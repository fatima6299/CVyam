import React, { useState, useEffect, useCallback, useRef } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import * as api from './api.js'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [cvData, setCvData] = useState(null)
  const [orders, setOrders] = useState([])
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [userOrder, setUserOrder] = useState(null)
  // Use browser history so back button stays inside the app
  const goBack = useCallback(() => {
    window.history.back()
  }, [])

  const navigate = useCallback((newPage) => {
    try { window.history.pushState({ appPage: newPage }, '', '') } catch (e) {}
    setPage(newPage)
  }, [])
  const [showExitToast, setShowExitToast] = useState(false)
  const allowExitRef = useRef(false)

  const refreshOrders = () => api.fetchOrders().then(setOrders).catch(() => setOrders([]))
  const refreshUsers = () => api.fetchUsers().then(setRegisteredUsers).catch(() => setRegisteredUsers([]))
  const refreshUserOrder = (email) => api.fetchPaidOrder(email).then(setUserOrder).catch(() => setUserOrder(null))

  useEffect(() => {
    if (page === 'builder' && user?.email) refreshUserOrder(user.email)
  }, [page, user?.email])

  const login = (name, email, mode) => {
    setUser({ name, email, mode, id: Date.now() })
    navigate('builder')
  }

  const onAuthSuccess = (u) => {
    setUser(u)
    navigate('builder')
  }

  const loginAdmin = async (code) => {
    const ok = await api.loginAdmin(code)
    if (ok) {
      setUser({ admin: true })
      refreshOrders()
      refreshUsers()
      navigate('admin')
    } else alert('Code incorrect')
  }

  const goPayment = (data) => { setCvData(data); navigate('payment') }

  const confirmPayment = async (method) => {
    const amount = user?.mode === 'auto' ? 500 : 2000
    const { id } = await api.createOrder({ client: user, method, amount, cvData })
    navigate('builder')
    return id
  }

  const validatePayment = async (id) => {
    await api.validateOrder(id)
    refreshOrders()
  }

  useEffect(() => {
    // keep an initial app state so the browser back button doesn't immediately leave the app
    try { window.history.pushState({ appPage: page }, '', '') } catch (e) {}
    const currentPageRef = { current: page }

    const onPop = (e) => {
      const next = e.state?.appPage
      if (next) {
        setPage(next)
        currentPageRef.current = next
        return
      }
      if (allowExitRef.current) {
        return
      }
      try { window.history.pushState({ appPage: currentPageRef.current }, '', '') } catch (err) {}
      setShowExitToast(true)
    }

    const onBeforeUnload = (ev) => {
      ev.preventDefault()
      ev.returnValue = ''
    }

    window.addEventListener('popstate', onPop)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  // keep a ref of the current page so popstate restore can use it
  useEffect(() => {
    // update history state when the page changes
    try { window.history.replaceState({ appPage: page }, '', '') } catch (e) {}
  }, [page])

  let pageContent = null
  if (page === 'landing') pageContent = <LandingPage onStart={() => navigate('auth')} onAdmin={() => navigate('auth-admin')} />
  else if (page === 'auth') pageContent = <AuthPage onLogin={login} onBack={goBack} onShowLogin={() => navigate('login')} />
  else if (page === 'login') pageContent = <LoginPage onAuthSuccess={onAuthSuccess} onBack={goBack} />
  else if (page === 'auth-admin') pageContent = <AuthPage admin onLoginAdmin={loginAdmin} onBack={goBack} />
  else if (page === 'admin') pageContent = <AdminPage users={registeredUsers} orders={orders} onValidate={validatePayment} onRefresh={() => { refreshOrders(); refreshUsers() }} onBack={goBack} onLogout={() => { setUser(null); navigate('landing') }} />
  else if (page === 'payment') pageContent = <PaymentPage user={user} cvData={cvData} onConfirm={confirmPayment} onBack={goBack} />
  else if (page === 'builder') pageContent = (
    <BuilderPage
      user={user}
      isPaid={user?.mode === 'free' || !!userOrder}
      order={userOrder}
      onPay={goPayment}
      onBack={goBack}
      onLogout={() => { setUser(null); navigate('landing') }}
    />
  )

  return (
    <>
      {pageContent}
      {showExitToast && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', zIndex: 9999 }}>
          <div style={{ width: 360, background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Quitter l'application ?</div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>Si vous quittez, vous risquez de perdre votre progression. Confirmez‑vous la sortie ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowExitToast(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Rester</button>
              <button onClick={() => { allowExitRef.current = true; setShowExitToast(false); window.history.back() }} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#d9534f', color: '#fff', cursor: 'pointer' }}>Quitter</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
