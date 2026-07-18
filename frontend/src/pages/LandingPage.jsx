import React from 'react'

const features = [
  { icon: '🎨', title: '20 templates professionnels', desc: 'Modernes, classiques, créatifs — pour tous les profils' },
  { icon: '⚡', title: 'Prévisualisation en direct', desc: 'Votre CV se construit sous vos yeux en temps réel' },
  { icon: '📄', title: 'Export PDF haute qualité', desc: 'Téléchargement après validation du paiement' },
  { icon: '🔒', title: 'Accès sécurisé', desc: 'Votre CV est privé et accessible uniquement par vous' },
]

const plans = [
  { name: 'Autonome', price: '2 000', unit: 'FCFA', desc: 'Vous remplissez vous-même', features: ['Accès aux 20 templates', 'Formulaire guidé étape par étape', 'Prévisualisation en direct', 'Téléchargement PDF'], color: '#1a5276' },
  { name: 'Assisté', price: '3 000', unit: 'FCFA', desc: 'BDS s\'occupe de tout pour vous', features: ['Tout le plan Autonome', 'Rédaction professionnelle', 'Optimisation du contenu', 'Support WhatsApp'], color: '#117a65', badge: 'Recommandé' },
]

export default function LandingPage({ onStart, onAdmin }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', color: '#fff' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20 }}>
          <span style={{ color: '#4fc3f7' }}>CV</span>Yam
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 8, fontWeight: 400 }}>by BDS Services</span>
        </div>
        <button onClick={onAdmin} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 6, fontSize: 12 }}>
          Admin
        </button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(79,195,247,0.12)', border: '1px solid rgba(79,195,247,0.25)', borderRadius: 99, padding: '5px 16px', fontSize: 12, color: '#4fc3f7', marginBottom: '1.5rem' }}>
          ✦ Créez votre CV professionnel en quelques minutes
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.2rem', maxWidth: 700, margin: '0 auto 1.2rem' }}>
          Un CV qui <span style={{ color: '#4fc3f7' }}>fait la différence</span>,<br/>en moins de 10 minutes
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Choisissez parmi 20 templates professionnels, remplissez vos informations et téléchargez votre CV au format PDF.
        </p>
        <button onClick={onStart} style={{ background: '#4fc3f7', color: '#0a1628', border: 'none', padding: '14px 36px', borderRadius: 99, fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.3, transition: 'opacity 0.2s' }}
          onMouseOver={e => e.target.style.opacity = 0.88}
          onMouseOut={e => e.target.style.opacity = 1}>
          Créer mon CV →
        </button>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 12 }}>À partir de 2 000 FCFA · Paiement après création</div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto 4rem', padding: '0 2rem' }}>
        {features.map(f => (
          <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: 640, margin: '0 auto 5rem', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Tarifs simples et transparents</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Payez uniquement quand votre CV est prêt</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${p.badge ? 'rgba(79,195,247,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: '1.5rem', position: 'relative' }}>
              {p.badge && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#4fc3f7', color: '#0a1628', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99 }}>{p.badge}</div>}
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 2 }}>{p.price} <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{p.unit}</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>{p.desc}</div>
              {p.features.map(f => <div key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 5 }}>✓ {f}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={onStart} style={{ background: 'none', border: '1px solid rgba(79,195,247,0.4)', color: '#4fc3f7', padding: '11px 28px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
            Commencer maintenant →
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
        © 2025 BDS Services · Dakar, Sénégal · WhatsApp : +221 XX XXX XX XX
      </div>
    </div>
  )
}
