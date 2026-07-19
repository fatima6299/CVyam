import React, { useState } from 'react'

export default function AuthPage({ onLogin, onLoginAdmin, onBack, admin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState('auto')
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
    btn: { width: '100%', padding: '12px', background: '#4fc3f7', color: '#0a1628', border: 'none', borderRadius: 99, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" },
    back: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: '1.2rem', display: 'block', textAlign: 'center', width: '100%' },
    modeBox: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.4rem' },
    modeOpt: (selected) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1px solid ${selected ? '#4fc3f7' : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, cursor: 'pointer', background: selected ? 'rgba(79,195,247,0.08)' : 'transparent', color: '#fff' }),
  }

  if (admin) return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}><span style={S.logoAccent}>CV</span>Builder</div>
        <h2 style={S.h2}>Espace Admin</h2>
        <p style={S.sub}>Entrez le code administrateur BDS pour accéder au tableau de bord.</p>
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
        <p style={S.sub}>Renseignez vos coordonnées pour commencer. Aucun mot de passe requis.</p>

        <label style={S.label}>VOTRE NOM COMPLET</label>
        <input style={S.input} placeholder="Prénom NOM" value={name} onChange={e => setName(e.target.value)} />

        <label style={S.label}>EMAIL</label>
        <input style={S.input} placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} />

        <label style={S.label}>MODE DE CRÉATION</label>
        <div style={S.modeBox}>
          <div style={S.modeOpt(mode === 'auto')} onClick={() => setMode('auto')}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${mode === 'auto' ? '#4fc3f7' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mode === 'auto' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }}/>}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Je remplis moi-même</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>500 FCFA</div>
            </div>
          </div>
          <div style={S.modeOpt(mode === 'assist')} onClick={() => setMode('assist')}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${mode === 'assist' ? '#4fc3f7' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mode === 'assist' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }}/>}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>BDS s'occupe de tout</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>3 000 FCFA</div>
            </div>
          </div>
        </div>

        <button style={S.btn} onClick={() => name && email && onLogin(name, email, mode)}>
          Commencer →
        </button>
        <button style={S.back} onClick={onBack}>← Retour</button>
      </div>
    </div>
  )
}
