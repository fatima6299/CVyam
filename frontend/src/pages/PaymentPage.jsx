import React, { useState } from 'react'

const METHODS = [
  { id: 'wave', label: 'Wave', icon: '🌊', color: '#1a73e8', desc: 'Envoi rapide via Wave' },
  { id: 'orange', label: 'Orange Money', icon: '🟠', color: '#ff6600', desc: 'Paiement Orange Money' },
  { id: 'especes', label: 'Espèces / Cash', icon: '💵', color: '#1e8449', desc: 'Remise en main propre' },
]

export default function PaymentPage({ user, cvData, onConfirm, onBack }) {
  const [method, setMethod] = useState('')
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')
  const amount = user?.mode === 'auto' ? 500 : 2000

  const handleConfirm = async () => {
    const id = await onConfirm(method)
    setOrderId(id)
    setDone(true)
  }

  const S = {
    wrap: { minHeight: '100vh', background: '#f7f7f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    card: { background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '2.5rem', width: '100%', maxWidth: 440 },
    h2: { fontSize: 20, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif", color: '#0a1628' },
    amt: { fontSize: 32, fontWeight: 800, color: '#0a1628', fontFamily: "'Space Grotesk', sans-serif", margin: '16px 0' },
    methodCard: (sel) => ({
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      border: `1.5px solid ${sel ? '#0a1628' : '#e2e2de'}`, borderRadius: 10,
      cursor: 'pointer', marginBottom: 8, background: sel ? '#f0f4ff' : '#fff',
      transition: 'all 0.15s'
    }),
    icon: { fontSize: 24 },
    btn: { width: '100%', padding: '13px', borderRadius: 99, fontSize: 15, fontWeight: 700, border: 'none', background: '#0a1628', color: '#fff', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", marginTop: 16 },
    back: { background: 'none', border: 'none', color: '#999', fontSize: 13, cursor: 'pointer', marginTop: 10, display: 'block', width: '100%', textAlign: 'center' },
  }

  if (done) return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ ...S.h2, textAlign: 'center', marginBottom: 10 }}>Demande de paiement envoyée !</h2>
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
            Votre commande <strong>{orderId}</strong> a été enregistrée.<br/>
            Un administrateur BDS va valider votre paiement via <strong>{METHODS.find(m => m.id === method)?.label}</strong>.<br/>
            Une fois validé, votre lien de téléchargement sera disponible.
          </div>
          <div style={{ background: '#f7f7f6', border: '0.5px solid #e2e2de', borderRadius: 10, padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#555', marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: '#222' }}>Coordonnées de paiement BDS</div>
            <div>📱 Wave / Orange Money : <strong>+221 70 103 01 64</strong></div>
            <div style={{ marginTop: 4 }}>💬 WhatsApp : <strong>+221 70 103 01 64</strong></div>
            <div style={{ marginTop: 4 }}>📝 Référence : <strong>{orderId}</strong></div>
          </div>
          <button onClick={onBack} style={S.btn}>Retour au builder →</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Paiement sécurisé · BDS Services</div>
        <h2 style={S.h2}>Finalisez votre commande</h2>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
          Mode : <strong>{user?.mode === 'auto' ? 'Autonome' : 'Assisté'}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '12px 0 20px' }}>
          <span style={S.amt}>{amount.toLocaleString('fr-FR')}</span>
          <span style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>FCFA</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          Choisir le mode de paiement
        </div>

        {METHODS.map(m => (
          <div key={m.id} style={S.methodCard(method === m.id)} onClick={() => setMethod(m.id)}>
            <div style={S.icon}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{m.desc}</div>
            </div>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === m.id ? '#0a1628' : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {method === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a1628' }} />}
            </div>
          </div>
        ))}

        <button onClick={handleConfirm} disabled={!method} style={{
          ...S.btn, background: method ? '#0a1628' : '#ddd', cursor: method ? 'pointer' : 'not-allowed'
        }}>
          Confirmer la commande →
        </button>
        <button onClick={onBack} style={S.back}>← Retour au builder</button>
      </div>
    </div>
  )
}
