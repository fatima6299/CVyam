import React, { useState } from 'react'

const STATUS = { pending: { label: 'En attente', color: '#d68910', bg: '#fef9e7' }, paid: { label: 'Validé', color: '#1e8449', bg: '#d5f5e3' } }

export default function AdminPage({ orders, onValidate, onLogout }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const totalPaid = orders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.amount || 0), 0)
  const pending = orders.filter(o => o.status === 'pending').length

  const S = {
    wrap: { minHeight: '100vh', background: '#f7f7f6', fontFamily: "'Inter', sans-serif" },
    nav: { background: '#0a1628', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff' },
    main: { padding: '24px', maxWidth: 960, margin: '0 auto' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 },
    statCard: { background: '#fff', border: '0.5px solid #e2e2de', borderRadius: 12, padding: '16px' },
    statVal: { fontSize: 26, fontWeight: 700, color: '#0a1628', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 3 },
    statLabel: { fontSize: 12, color: '#888' },
    tableWrap: { background: '#fff', border: '0.5px solid #e2e2de', borderRadius: 14, overflow: 'hidden' },
    tableHead: { background: '#f7f7f6', borderBottom: '0.5px solid #e2e2de', padding: '10px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 100px 100px', gap: 8, fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' },
    tableRow: { padding: '12px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 100px 100px', gap: 8, borderBottom: '0.5px solid #f0f0f0', alignItems: 'center', fontSize: 13 },
    badge: (s) => ({ display: 'inline-block', padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: STATUS[s]?.bg || '#eee', color: STATUS[s]?.color || '#666' }),
    validateBtn: { background: '#0a1628', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  }

  return (
    <div style={S.wrap}>
      <div style={S.nav}>
        <div style={S.logo}><span style={{ color: '#4fc3f7' }}>CV</span>Builder · Admin</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{orders.length} commande{orders.length > 1 ? 's' : ''} au total</span>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer' }}>Déconnexion</button>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.statsRow}>
          <div style={S.statCard}>
            <div style={S.statVal}>{orders.length}</div>
            <div style={S.statLabel}>Commandes totales</div>
          </div>
          <div style={S.statCard}>
            <div style={{ ...S.statVal, color: '#d68910' }}>{pending}</div>
            <div style={S.statLabel}>En attente de validation</div>
          </div>
          <div style={S.statCard}>
            <div style={{ ...S.statVal, color: '#1e8449' }}>{totalPaid.toLocaleString('fr-FR')}</div>
            <div style={S.statLabel}>FCFA encaissés</div>
          </div>
          <div style={S.statCard}>
            <div style={{ ...S.statVal }}>{orders.filter(o => o.status === 'paid').length}</div>
            <div style={S.statLabel}>CV téléchargés</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['all', 'pending', 'paid'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid #ccc', background: filter === f ? '#0a1628' : '#fff', color: filter === f ? '#fff' : '#555' }}>
              {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : 'Validées'}
            </button>
          ))}
        </div>

        <div style={S.tableWrap}>
          <div style={S.tableHead}>
            <div>Client</div><div>Email</div><div>Montant</div><div>Mode</div><div>Statut</div><div>Action</div>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>Aucune commande pour l'instant</div>
          )}
          {filtered.map(o => (
            <div key={o.id} style={S.tableRow}>
              <div>
                <div style={{ fontWeight: 600, color: '#111' }}>{o.client?.name}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{o.id}</div>
              </div>
              <div style={{ fontSize: 12, color: '#555', wordBreak: 'break-all' }}>{o.client?.email}</div>
              <div style={{ fontWeight: 600 }}>{(o.amount || 0).toLocaleString('fr-FR')} F</div>
              <div style={{ fontSize: 12, color: '#888' }}>{METHODS_LABEL[o.method] || o.method}</div>
              <div><span style={S.badge(o.status)}>{STATUS[o.status]?.label}</span></div>
              <div>
                {o.status === 'pending' && (
                  <button style={S.validateBtn} onClick={() => onValidate(o.id)}>✓ Valider</button>
                )}
                {o.status === 'paid' && <span style={{ fontSize: 12, color: '#1e8449' }}>✓ Payé</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const METHODS_LABEL = { wave: 'Wave', orange: 'Orange Money', especes: 'Espèces' }
