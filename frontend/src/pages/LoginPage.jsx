import React, { useState } from 'react'
import * as api from '../api.js'

export default function LoginPage({ onAuthSuccess, onBack, prefill }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState(prefill?.name || '')
  const [email, setEmail] = useState(prefill?.email || '')
  const [password, setPassword] = useState('')
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await api.register({ name, email, password, mode: plan })
        if (res?.ok) {
          try { await api.mergeClientToken(localStorage.getItem('cvyam_client_token')) } catch (e) {}
          onAuthSuccess(res.user)
        } else alert(res?.error || 'Erreur')
      } else {
        const res = await api.login({ email, password })
        if (res?.ok) {
          try { await api.mergeClientToken(localStorage.getItem('cvyam_client_token')) } catch (e) {}
          onAuthSuccess(res.user)
        } else alert(res?.error || 'Identifiants invalides')
      }
    } catch (err) { console.error(err); alert('Erreur réseau') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 460, background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Se connecter / S'inscrire</div>
          <div>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '6px 10px', borderRadius: 8 }}>
              {mode === 'login' ? 'Créer un compte' : 'Déjà inscrit ?'}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Nom complet</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 8 }} />
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Type d'inscription</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button onClick={() => setPlan('free')} style={{ padding: 8, borderRadius: 8, border: plan === 'free' ? '2px solid #4fc3f7' : '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#fff' }}>Gratuit</button>
              <button onClick={() => setPlan('auto')} style={{ padding: 8, borderRadius: 8, border: plan === 'auto' ? '2px solid #4fc3f7' : '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#fff' }}>Autonome</button>
              <button onClick={() => setPlan('assist')} style={{ padding: 8, borderRadius: 8, border: plan === 'assist' ? '2px solid #4fc3f7' : '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#fff' }}>Assisté</button>
            </div>
          </>
        )}

        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 8 }} />
        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Mot de passe</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 12 }} />
        <button onClick={submit} disabled={loading} style={{ width: '100%', padding: 12, background: '#4fc3f7', color: '#0a1628', border: 'none', borderRadius: 8, fontWeight: 700 }}>
          {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
        <button onClick={onBack} style={{ marginTop: 10, width: '100%', padding: 10, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)' }}>← Retour</button>
      </div>
    </div>
  )
}
