import React, { useState } from 'react'

export default function AuthPage({ onLoginAdmin, onBack, admin, onShowLogin }) {
  const [code, setCode] = useState('')

  const S = {
    wrap: { minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '2.5rem', width: '100%', maxWidth: 420 },
    logo: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: '0.3rem' },
    logoAccent: { color: '#4fc3f7' },
    h2: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontFamily: "'Space Grotesk', sans-serif" },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: '1.8rem', lineHeight: 1.6 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 0.04 },
    input: { width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, marginBottom: '1rem' },
    btn: { width: '100%', padding: '12px', background: '#4fc3f7', color: '#0a1628', border: 'none', borderRadius: 99, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer' },
    back: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: '1.2rem', display: 'block', textAlign: 'center', width: '100%', cursor: 'pointer' },
  }

  if (admin) return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}><span style={S.logoAccent}>CV</span>Yam</div>
        <h2 style={S.h2}>Espace Admin</h2>
        <p style={S.sub}>Entrez le code administrateur FTD pour accéder au tableau de bord.</p>
        <label style={S.label}>CODE ADMIN</label>
        <input style={S.input} type="password" placeholder="••••••••" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onLoginAdmin(code)} />
        <button style={S.btn} onClick={() => onLoginAdmin(code)}>Accéder au tableau de bord</button>
        <button style={S.back} onClick={onBack}>← Retour à l'accueil</button>
      </div>
    </div>
  )

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}><span style={S.logoAccent}>CV</span>Builder</div>
        <h2 style={S.h2}>Créer mon CV</h2>
        <p style={S.sub}>Pour continuer, connectez-vous ou créez un compte. La connexion sans mot de passe est retirée.</p>

        <button style={S.btn} onClick={onShowLogin}>Se connecter / S'inscrire</button>
        <button style={S.back} onClick={onBack}>← Retour</button>
      </div>
    </div>
  )
}
