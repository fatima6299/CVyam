import React, { useState } from 'react'

const STATUS = { pending: { label: 'En attente', color: '#d68910', bg: '#fef9e7' }, paid: { label: 'Validé', color: '#1e8449', bg: '#d5f5e3' } }

export default function AdminPage({ orders, users, onValidate, onRefresh, onBack, onLogout }) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('overview')

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const totalPaid = orders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.amount || 0), 0)
  const pending = orders.filter(o => o.status === 'pending').length

  const S = {
    wrap: { minHeight: '100vh', background: '#f4f7fb', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    nav: { background: '#0a1628', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff' },
    main: { padding: '24px', maxWidth: 1300, margin: '0 auto', width: '100%' },
    shell: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 18, alignItems: 'start' },
    sidebar: { background: '#fff', borderRadius: 18, padding: '18px 14px', boxShadow: '0 8px 24px rgba(10,22,40,0.08)', position: 'sticky', top: 18 },
    sidebarTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9aa4b2', marginBottom: 12, padding: '0 8px' },
    sidebarBtn: (active) => ({ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 12, background: active ? '#eef6ff' : 'transparent', color: active ? '#0a1628' : '#5c6b7a', border: 'none', fontWeight: active ? 700 : 600, cursor: 'pointer', marginBottom: 6, fontSize: 13 }),
    content: { display: 'flex', flexDirection: 'column', gap: 16 },
    hero: { background: 'linear-gradient(135deg, #0a1628 0%, #16304b 100%)', borderRadius: 18, padding: '22px 24px', color: '#fff', boxShadow: '0 12px 30px rgba(10,22,40,0.16)' },
    heroTitle: { fontSize: 24, fontWeight: 800, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" },
    heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 },
    statCard: { background: '#fff', border: '0.5px solid #e2e2de', borderRadius: 14, padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' },
    statVal: { fontSize: 26, fontWeight: 700, color: '#0a1628', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 3 },
    statLabel: { fontSize: 12, color: '#888' },
    menu: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    menuBtn: (active) => ({ padding: '8px 14px', borderRadius: 999, border: '0.5px solid #d7d7d2', background: active ? '#0a1628' : '#fff', color: active ? '#fff' : '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: active ? '0 4px 12px rgba(10,22,40,0.12)' : 'none' }),
    tableWrap: { background: '#fff', border: '0.5px solid #e2e2de', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' },
    section: { marginBottom: 24 },
    tableHead: { background: '#f7f7f6', borderBottom: '0.5px solid #e2e2de', padding: '10px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 100px 100px', gap: 8, fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' },
    tableRow: { padding: '12px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 100px 100px', gap: 8, borderBottom: '0.5px solid #f0f0f0', alignItems: 'center', fontSize: 13 },
    badge: (s) => ({ display: 'inline-block', padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: STATUS[s]?.bg || '#eee', color: STATUS[s]?.color || '#666' }),
    validateBtn: { background: '#0a1628', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
    pill: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, fontWeight: 600, marginRight: 8 },
    helperCard: { background: '#fff', border: '0.5px solid #e2e2de', borderRadius: 14, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' },
  }

  return (
    <div style={S.wrap}>
      <div style={S.nav}>
        <div style={S.logo}><span style={{ color: '#4fc3f7' }}>CV</span>Yam · Admin</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer' }}>← Retour</button>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{orders.length} commande{orders.length > 1 ? 's' : ''} au total</span>
          <button onClick={onRefresh} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer' }}>↻ Actualiser</button>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 99, fontSize: 12, cursor: 'pointer' }}>Déconnexion</button>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.shell}>
          <aside style={S.sidebar}>
            <div style={S.sidebarTitle}>Navigation</div>
            {[
              { key: 'overview', label: 'Vue d’ensemble' },
              { key: 'users', label: 'Utilisateurs' },
              { key: 'orders', label: 'Commandes CV' },
              { key: 'settings', label: 'Paramètres' }
            ].map(item => (
              <button key={item.key} onClick={() => setView(item.key)} style={S.sidebarBtn(view === item.key)}>
                {item.label}
              </button>
            ))}
          </aside>

          <div style={S.content}>
            <div style={S.hero}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={S.heroSub}>Tableau de bord · Administration</div>
                  <div style={S.heroTitle}>Gestion CVYam</div>
                  <div style={S.heroSub}>Surveillez les commandes, les utilisateurs inscrits et l’activité globale depuis un seul endroit.</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={S.pill}>⚡ {orders.length} commandes</span>
                  <span style={S.pill}>👤 {users?.length || 0} utilisateurs</span>
                </div>
              </div>
            </div>

            {view === 'overview' && (
          <>
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
          </>
        )}

        {view === 'users' && (
          <div style={S.section}>
            <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 700, color: '#0a1628' }}>Utilisateurs inscrits</div>
            <div style={S.tableWrap}>
              <div style={{ ...S.tableHead, gridTemplateColumns: '1.2fr 1.4fr 0.8fr 1fr' }}>
                <div>Nom</div><div>Email</div><div>Type</div><div>Date d'inscription</div>
              </div>
              {(!users || users.length === 0) && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>Aucun utilisateur inscrit pour l'instant</div>
              )}
              {users && users.map(u => (
                <div key={u.id} style={{ ...S.tableRow, gridTemplateColumns: '1.2fr 1.4fr 0.8fr 1fr' }}>
                  <div style={{ fontWeight: 600, color: '#111' }}>{u.name || '—'}</div>
                  <div style={{ fontSize: 12, color: '#555', wordBreak: 'break-all' }}>{u.email}</div>
                  <div style={{ fontSize: 12, color: '#444', fontWeight: 700 }}>{u.mode === 'auto' ? 'Autonome' : u.mode === 'assist' ? 'Assisté' : 'Gratuit'}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'orders' && (
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
        )}

            {view === 'settings' && (
              <div style={S.helperCard}>
                <div style={{ fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>Paramètres admin</div>
                <div style={{ color: '#666', fontSize: 13, lineHeight: 1.7 }}>Les prochaines options de configuration seront ajoutées ici : gestion des offres, paramètres du site, règles de validation et alertes.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const METHODS_LABEL = { wave: 'Wave', orange: 'Orange Money', especes: 'Espèces' }
