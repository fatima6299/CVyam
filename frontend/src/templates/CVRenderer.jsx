import React from 'react'

const dot = (color) => <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: color, margin: '0 6px', verticalAlign: 'middle' }} />

const EXTRA_FIELDS = [
  { key: 'linkedin', icon: '🔗' },
  { key: 'website', icon: '🌐' },
  { key: 'nationalite', icon: '🌍' },
  { key: 'permis', icon: '🚗' },
  { key: 'visa', icon: '🛂' },
  { key: 'piece', icon: '🪪' },
  { key: 'disponibilite', icon: '📅' },
]
function extraItems(data) {
  return EXTRA_FIELDS.filter(f => data.extras?.[f.key]).map(f => ({ icon: f.icon, text: data.extras[f.key] }))
}

function Avatar({ src, size = 54, style = {} }) {
  if (!src) return null
  return <img src={src} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', ...style }} />
}

function SectionTitle({ text, color, style = {} }) {
  return (
    <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color, marginBottom: 5, marginTop: 10, ...style }}>
      {text}
    </div>
  )
}

function titled(item, kind, order) {
  if (kind === 'formation') {
    return order === 'inverse' ? { title: item.etablissement, sub: item.diplome } : { title: item.diplome, sub: item.etablissement }
  }
  return order === 'inverse' ? { title: item.lieu, sub: item.poste } : { title: item.poste, sub: item.lieu }
}

function ExpBlock({ item, titleColor, subColor, dotColor, order }) {
  const { title, sub } = titled(item, 'experience', order)
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: 7.5, color: dotColor || subColor, fontWeight: 700, minWidth: 50 }}>{item.periode}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: titleColor }}>{title}</span>
      </div>
      <div style={{ fontSize: 8, color: subColor, fontStyle: 'italic', marginLeft: 55 }}>{sub}</div>
      {item.taches && item.taches.split('\n').filter(Boolean).map((t, i) => (
        <div key={i} style={{ fontSize: 8, color: subColor, paddingLeft: 58, marginTop: 1 }}>• {t}</div>
      ))}
    </div>
  )
}

function CompetencesBlock({ items, mode = 'bubble', color, textColor = '#444' }) {
  if (!items?.length) return null
  if (mode === 'liste') return items.map((s, i) => <div key={i} style={{ fontSize: 8, color: textColor, marginBottom: 2 }}>• {s}</div>)
  if (mode === 'points') return items.map((s, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 8, color: textColor }}>{s}</span>
    </div>
  ))
  if (mode === 'compact') return <div style={{ fontSize: 8, color: textColor, lineHeight: 1.6, marginBottom: 4 }}>{items.join(' · ')}</div>
  if (mode === 'grille') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px', marginBottom: 4 }}>
      {items.map((s, i) => <div key={i} style={{ fontSize: 8, color: textColor }}>▪ {s}</div>)}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
      {items.map((s, i) => <span key={i} style={{ background: color + '15', border: `0.5px solid ${color}44`, borderRadius: 99, padding: '2px 8px', fontSize: 8, color }}>{s}</span>)}
    </div>
  )
}

function ExtraSections({ data, color, titleColor = '#111', textColor = '#444', subColor = '#666' }) {
  const sections = data.extraSections || []
  if (!sections.length) return null
  return sections.map(sec => (
    <React.Fragment key={sec.key}>
      <SectionTitle text={sec.title} color={color} style={{ borderBottom: `0.5px solid ${color}55`, paddingBottom: 3 }} />
      {sec.mode === 'text' && sec.text && <p style={{ fontSize: 8.5, color: textColor, lineHeight: 1.6 }}>{sec.text}</p>}
      {sec.mode === 'tags' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {(sec.tags || []).map((t, i) => (
            <span key={i} style={{ background: color + '15', border: `0.5px solid ${color}44`, borderRadius: 99, padding: '2px 8px', fontSize: 8, color }}>{t}</span>
          ))}
        </div>
      )}
      {sec.mode === 'list' && (sec.items || []).map((it, i) => (
        (it.titre || it.sous || it.desc) && <div key={i} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: titleColor }}>
            {it.titre}{it.date && <span style={{ fontWeight: 400, color: subColor, fontSize: 8 }}> — {it.date}</span>}
          </div>
          {it.sous && <div style={{ fontSize: 8, color: subColor, fontStyle: 'italic' }}>{it.sous}</div>}
          {it.desc && <div style={{ fontSize: 8, color: textColor, marginTop: 1 }}>{it.desc}</div>}
        </div>
      ))}
    </React.Fragment>
  ))
}

function FormBlock({ item, titleColor, subColor, accentColor, order }) {
  const { title, sub } = titled(item, 'formation', order)
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontSize: 7.5, fontWeight: 700, color: accentColor }}>{item.annee} </span>
      <span style={{ fontSize: 9, fontWeight: 700, color: titleColor }}>{title}</span>
      <div style={{ fontSize: 8, color: subColor, fontStyle: 'italic', paddingLeft: 2 }}>{sub}</div>
    </div>
  )
}

// ── SIDEBAR-LEFT (5 modern + tropical) ──────────────────────────────────────
function SidebarLeft({ data, tpl }) {
  const c = tpl.colors
  const LEFT = 155
  return (
    <div style={{ display: 'flex', fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780 }}>
      {/* Left */}
      <div style={{ width: LEFT, background: c.bg, color: c.text, padding: '0 12px 16px', flexShrink: 0 }}>
        <div style={{ background: c.primary, margin: '0 -12px', padding: '18px 14px 14px' }}>
          {data.photo && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Avatar src={data.photo} size={56} style={{ border: `2px solid ${c.accent}` }} /></div>}
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, lineHeight: 1.2 }}>{data.nom || 'VOTRE NOM'}</div>
          <div style={{ fontSize: 8.5, color: c.accent, marginBottom: 8 }}>{data.titre || 'Titre professionnel'}</div>
          <div style={{ fontSize: 7.5, opacity: 0.85, lineHeight: 1.8 }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.tel && <div>✆ {data.tel}</div>}
            {data.adresse && <div>📍 {data.adresse}</div>}
            {data.ddn && <div>🎂 {data.ddn}</div>}
            {extraItems(data).map((it, i) => <div key={i}>{it.icon} {it.text}</div>)}
          </div>
        </div>
        {data.profil && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.accent, margin: '12px 0 5px' }}>Profil</div>
          <div style={{ fontSize: 8, opacity: 0.85, lineHeight: 1.6 }}>{data.profil}</div>
        </>}
        {data.competences?.length > 0 && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.accent, margin: '10px 0 5px' }}>Compétences</div>
          <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'liste'} color={c.accent} textColor="rgba(255,255,255,0.85)" />
        </>}
        {data.langues?.length > 0 && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.accent, margin: '10px 0 5px' }}>Langues</div>
          {data.langues.map((l, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600 }}>{l.langue}</div>
              <div style={{ fontSize: 7.5, opacity: 0.7 }}>{l.niveau}</div>
            </div>
          ))}
        </>}
      </div>
      {/* Right */}
      <div style={{ flex: 1, padding: '16px 16px 16px 14px', background: '#fff' }}>
        {data.formations?.length > 0 && <>
          <SectionTitle text="Formation" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
          {data.formations.map((f, i) => <FormBlock key={i} item={f} titleColor="#111" subColor="#666" accentColor={c.primary} order={data.customStyle?.titleOrder} />)}
        </>}
        {data.experiences?.length > 0 && <>
          <SectionTitle text="Expériences Professionnelles" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
          {data.experiences.map((e, i) => <ExpBlock key={i} item={e} titleColor="#111" subColor="#555" dotColor={c.primary} order={data.customStyle?.titleOrder} />)}
        </>}
        {data.autresInfos && <>
          <SectionTitle text="Informations complémentaires" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
          <div style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6 }}>{data.autresInfos}</div>
        </>}
        <ExtraSections data={data} color={c.primary} />
      </div>
    </div>
  )
}

// ── SIDEBAR-RIGHT (corporate) ────────────────────────────────────────────────
function SidebarRight({ data, tpl }) {
  const c = tpl.colors
  const RIGHT = 155
  return (
    <div style={{ display: 'flex', fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780 }}>
      <div style={{ flex: 1, padding: '16px 14px 16px 16px', background: '#fff' }}>
        <div style={{ borderBottom: `2px solid ${c.primary}`, marginBottom: 12, paddingBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>{data.nom || 'VOTRE NOM'}</div>
          <div style={{ fontSize: 9, color: c.accent }}>{data.titre || 'Titre professionnel'}</div>
        </div>
        {data.profil && <>
          <SectionTitle text="Profil" color={c.primary} style={{ borderBottom: `1px solid ${c.primary}`, paddingBottom: 2 }} />
          <div style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6, marginBottom: 6 }}>{data.profil}</div>
        </>}
        {data.formations?.length > 0 && <>
          <SectionTitle text="Formation" color={c.primary} style={{ borderBottom: `1px solid ${c.primary}`, paddingBottom: 2 }} />
          {data.formations.map((f, i) => <FormBlock key={i} item={f} titleColor="#111" subColor="#666" accentColor={c.accent} order={data.customStyle?.titleOrder} />)}
        </>}
        {data.experiences?.length > 0 && <>
          <SectionTitle text="Expériences" color={c.primary} style={{ borderBottom: `1px solid ${c.primary}`, paddingBottom: 2 }} />
          {data.experiences.map((e, i) => <ExpBlock key={i} item={e} titleColor="#111" subColor="#555" dotColor={c.accent} order={data.customStyle?.titleOrder} />)}
        </>}
        <ExtraSections data={data} color={c.primary} />
      </div>
      <div style={{ width: RIGHT, background: c.bg, color: c.text, padding: '20px 12px 16px', flexShrink: 0 }}>
        {data.photo ? <Avatar src={data.photo} size={50} style={{ marginBottom: 10 }} /> : (
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
            {(data.nom || 'N')[0]}
          </div>
        )}
        <div style={{ fontSize: 7.5, lineHeight: 2, opacity: 0.85, marginBottom: 12 }}>
          {data.email && <div>✉ {data.email}</div>}
          {data.tel && <div>✆ {data.tel}</div>}
          {data.adresse && <div>📍 {data.adresse}</div>}
          {data.ddn && <div>🎂 {data.ddn}</div>}
          {extraItems(data).map((it, i) => <div key={i}>{it.icon} {it.text}</div>)}
        </div>
        {data.competences?.length > 0 && <>
          <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.accent, marginBottom: 5 }}>Compétences</div>
          <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'liste'} color={c.accent} textColor="rgba(255,255,255,0.85)" />
        </>}
        {data.langues?.length > 0 && <>
          <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.accent, margin: '10px 0 5px' }}>Langues</div>
          {data.langues.map((l, i) => <div key={i} style={{ fontSize: 7.5, opacity: 0.85, marginBottom: 3 }}>{l.langue} — {l.niveau}</div>)}
        </>}
      </div>
    </div>
  )
}

// ── CLASSIC ──────────────────────────────────────────────────────────────────
function Classic({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780, padding: '0 0 16px' }}>
      <div style={{ textAlign: 'center', padding: '20px 24px 14px', borderBottom: `2px solid ${c.primary}` }}>
        {data.photo && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Avatar src={data.photo} size={60} style={{ border: `2px solid ${c.primary}` }} /></div>}
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.03em', color: '#111', marginBottom: 3 }}>{data.nom || 'VOTRE NOM'}</div>
        <div style={{ fontSize: 9.5, color: c.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{data.titre || 'Titre professionnel'}</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, fontSize: 8.5, color: '#666' }}>
          {data.email && <span>{data.email}</span>}
          {data.tel && <>{dot(c.primary)}<span>{data.tel}</span></>}
          {data.adresse && <>{dot(c.primary)}<span>{data.adresse}</span></>}
          {data.ddn && <>{dot(c.primary)}<span>{data.ddn}</span></>}
          {extraItems(data).map((it, i) => <React.Fragment key={i}>{dot(c.primary)}<span>{it.text}</span></React.Fragment>)}
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        {data.profil && <>
          <SectionTitle text="Profil" color={c.primary} style={{ borderBottom: `0.5px solid #ccc`, paddingBottom: 3 }} />
          <p style={{ fontSize: 9, color: '#444', lineHeight: 1.6, marginBottom: 6 }}>{data.profil}</p>
        </>}
        {data.formations?.length > 0 && <>
          <SectionTitle text="Formation" color={c.primary} style={{ borderBottom: `0.5px solid #ccc`, paddingBottom: 3 }} />
          {data.formations.map((f, i) => {
            const { title, sub } = titled(f, 'formation', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <div style={{ minWidth: 60, fontSize: 8, color: '#999', paddingTop: 1 }}>{f.annee}</div>
                <div><div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title}</div><div style={{ fontSize: 8.5, color: '#666', fontStyle: 'italic' }}>{sub}</div></div>
              </div>
            )
          })}
        </>}
        {data.experiences?.length > 0 && <>
          <SectionTitle text="Expériences Professionnelles" color={c.primary} style={{ borderBottom: `0.5px solid #ccc`, paddingBottom: 3 }} />
          {data.experiences.map((e, i) => {
            const { title, sub } = titled(e, 'experience', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <div style={{ minWidth: 60, fontSize: 8, color: '#999', paddingTop: 1 }}>{e.periode}</div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title}</div>
                  <div style={{ fontSize: 8.5, color: '#666', fontStyle: 'italic' }}>{sub}</div>
                  {e.taches && e.taches.split('\n').filter(Boolean).map((t, j) => <div key={j} style={{ fontSize: 8, color: '#444', paddingLeft: 8, marginTop: 1 }}>• {t}</div>)}
                </div>
              </div>
            )
          })}
        </>}
        {(data.competences?.length > 0 || data.langues?.length > 0) && <>
          <SectionTitle text="Compétences & Langues" color={c.primary} style={{ borderBottom: `0.5px solid #ccc`, paddingBottom: 3 }} />
          <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'bubble'} color={c.primary} textColor="#444" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {data.langues?.map((l, i) => <span key={i} style={{ background: c.accent + '33', border: `0.5px solid ${c.primary}44`, borderRadius: 99, padding: '2px 8px', fontSize: 8, color: c.primary }}>{l.langue} — {l.niveau}</span>)}
          </div>
        </>}
        <ExtraSections data={data} color={c.primary} />
      </div>
    </div>
  )
}

// ── ÉLÉGANT (dark bg, gold/platinum accent) ──────────────────────────────────
function Elegant({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || "'Georgia', serif", minHeight: 780, background: c.bg, color: c.text, padding: '0 0 20px' }}>
      <div style={{ padding: '22px 28px 16px', borderBottom: `1px solid ${c.primary}55`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4, color: c.text }}>{data.nom || 'VOTRE NOM'}</div>
          <div style={{ fontSize: 9, color: c.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{data.titre || 'Titre professionnel'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 8, color: c.accent + 'cc' }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.tel && <span>✆ {data.tel}</span>}
            {data.adresse && <span>📍 {data.adresse}</span>}
            {extraItems(data).map((it, i) => <span key={i}>{it.icon} {it.text}</span>)}
          </div>
        </div>
        {data.photo && <Avatar src={data.photo} size={56} style={{ border: `1px solid ${c.primary}`, flexShrink: 0 }} />}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '14px 16px 0 28px' }}>
          {data.profil && <>
            <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.accent, margin: '10px 0 5px' }}>Profil</div>
            <p style={{ fontSize: 8.5, color: c.rtext, lineHeight: 1.7, borderLeft: `2px solid ${c.primary}`, paddingLeft: 10 }}>{data.profil}</p>
          </>}
          {data.experiences?.length > 0 && <>
            <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.accent, margin: '12px 0 5px' }}>Expériences</div>
            {data.experiences.map((e, i) => {
              const { title, sub } = titled(e, 'experience', data.customStyle?.titleOrder)
              return (
                <div key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${c.primary}44` }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: c.text }}>{title}</div>
                  <div style={{ fontSize: 8, color: c.accent, marginBottom: 1 }}>{sub} · {e.periode}</div>
                  {e.taches && e.taches.split('\n').filter(Boolean).map((t, j) => <div key={j} style={{ fontSize: 8, color: c.rtext + 'cc', marginTop: 1 }}>• {t}</div>)}
                </div>
              )
            })}
          </>}
          <ExtraSections data={data} color={c.accent} titleColor={c.text} textColor={c.rtext + 'cc'} subColor={c.accent} />
        </div>
        <div style={{ width: 150, padding: '14px 16px 0 12px', borderLeft: `1px solid ${c.primary}33` }}>
          {data.formations?.length > 0 && <>
            <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.accent, marginBottom: 6 }}>Formation</div>
            {data.formations.map((f, i) => {
              const { title, sub } = titled(f, 'formation', data.customStyle?.titleOrder)
              return (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: c.text }}>{title}</div>
                  <div style={{ fontSize: 7.5, color: c.accent }}>{sub}</div>
                  <div style={{ fontSize: 7.5, color: c.primary }}>{f.annee}</div>
                </div>
              )
            })}
          </>}
          {data.competences?.length > 0 && <>
            <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.accent, margin: '10px 0 6px' }}>Compétences</div>
            <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'liste'} color={c.accent} textColor={c.rtext + 'cc'} />
          </>}
          {data.langues?.length > 0 && <>
            <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.accent, margin: '10px 0 6px' }}>Langues</div>
            {data.langues.map((l, i) => <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, color: c.text }}>{l.langue}</div>
              <div style={{ fontSize: 7.5, color: c.accent }}>{l.niveau}</div>
            </div>)}
          </>}
        </div>
      </div>
    </div>
  )
}

// ── CREATIVE GRADIENT ────────────────────────────────────────────────────────
function CreativeGradient({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780, background: '#fff' }}>
      <div style={{ background: c.bg, color: '#fff', padding: '20px 24px 28px', position: 'relative' }}>
        {data.photo && <Avatar src={data.photo} size={54} style={{ position: 'absolute', top: 20, right: 24, border: '2px solid rgba(255,255,255,0.5)' }} />}
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2, maxWidth: data.photo ? '75%' : 'none' }}>{data.nom || 'VOTRE NOM'}</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.78)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{data.titre || 'Titre professionnel'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 8, color: 'rgba(255,255,255,0.85)' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.tel && <span>✆ {data.tel}</span>}
          {data.adresse && <span>📍 {data.adresse}</span>}
          {extraItems(data).map((it, i) => <span key={i}>{it.icon} {it.text}</span>)}
        </div>
      </div>
      <div style={{ padding: '14px 24px 16px' }}>
        {data.profil && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.primary, margin: '0 0 5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: c.primary, borderRadius: 2 }} /> Profil
          </div>
          <p style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6, marginBottom: 8 }}>{data.profil}</p>
        </>}
        {data.formations?.length > 0 && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.primary, margin: '8px 0 5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: c.primary, borderRadius: 2 }} /> Formation
          </div>
          {data.formations.map((f, i) => {
            const { title, sub } = titled(f, 'formation', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title} <span style={{ color: c.primary, fontWeight: 400, fontSize: 8 }}>{f.annee}</span></div>
                <div style={{ fontSize: 8.5, color: '#666', fontStyle: 'italic' }}>{sub}</div>
              </div>
            )
          })}
        </>}
        {data.experiences?.length > 0 && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.primary, margin: '8px 0 5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: c.primary, borderRadius: 2 }} /> Expériences
          </div>
          {data.experiences.map((e, i) => {
            const { title, sub } = titled(e, 'experience', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title} — <span style={{ fontWeight: 400, color: '#555', fontSize: 8.5 }}>{e.periode}</span></div>
                <div style={{ fontSize: 8.5, color: c.primary, fontStyle: 'italic' }}>{sub}</div>
                {e.taches && e.taches.split('\n').filter(Boolean).map((t, j) => <div key={j} style={{ fontSize: 8, color: '#444', paddingLeft: 10, marginTop: 1 }}>• {t}</div>)}
              </div>
            )
          })}
        </>}
        {(data.competences?.length > 0 || data.langues?.length > 0) && <>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.primary, margin: '8px 0 5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: c.primary, borderRadius: 2 }} /> Compétences & Langues
          </div>
          <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'bubble'} color={c.primary} textColor="#444" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {data.langues?.map((l, i) => <span key={i} style={{ background: c.primary + '15', border: `0.5px solid ${c.primary}`, borderRadius: 99, padding: '2px 8px', fontSize: 8, color: c.primary }}>{l.langue} — {l.niveau}</span>)}
          </div>
        </>}
        <ExtraSections data={data} color={c.primary} />
      </div>
    </div>
  )
}

// ── MINIMAL ──────────────────────────────────────────────────────────────────
function Minimal({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780, background: c.bg, padding: '0 0 20px' }}>
      <div style={{ borderLeft: `4px solid ${c.primary}`, padding: '18px 24px 14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {data.photo && <Avatar src={data.photo} size={50} style={{ flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: c.primary, marginBottom: 2 }}>{data.nom || 'VOTRE NOM'}</div>
          <div style={{ fontSize: 9, color: c.accent, marginBottom: 8 }}>{data.titre || 'Titre professionnel'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 8, color: '#888' }}>
            {data.email && <span>{data.email}</span>}
            {data.tel && <span>{data.tel}</span>}
            {data.adresse && <span>{data.adresse}</span>}
            {data.ddn && <span>{data.ddn}</span>}
            {extraItems(data).map((it, i) => <span key={i}>{it.text}</span>)}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        {data.profil && <>
          <div style={{ fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#aaa', fontWeight: 700, margin: '12px 0 5px' }}>Profil</div>
          <p style={{ fontSize: 9, color: '#444', lineHeight: 1.7, marginBottom: 4 }}>{data.profil}</p>
        </>}
        {data.formations?.length > 0 && <>
          <div style={{ fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#aaa', fontWeight: 700, margin: '10px 0 5px' }}>Formation</div>
          {data.formations.map((f, i) => {
            const { title, sub } = titled(f, 'formation', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 8, color: '#ccc', minWidth: 55 }}>{f.annee}</div>
                <div><div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title}</div><div style={{ fontSize: 8.5, color: '#888' }}>{sub}</div></div>
              </div>
            )
          })}
        </>}
        {data.experiences?.length > 0 && <>
          <div style={{ fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#aaa', fontWeight: 700, margin: '10px 0 5px' }}>Expériences</div>
          {data.experiences.map((e, i) => {
            const { title, sub } = titled(e, 'experience', data.customStyle?.titleOrder)
            return (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 8, color: '#ccc', minWidth: 55 }}>{e.periode}</div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{title}</div>
                  <div style={{ fontSize: 8.5, color: '#888' }}>{sub}</div>
                  {e.taches && e.taches.split('\n').filter(Boolean).map((t, j) => <div key={j} style={{ fontSize: 8, color: '#555', paddingLeft: 8 }}>• {t}</div>)}
                </div>
              </div>
            )
          })}
        </>}
        {(data.competences?.length > 0 || data.langues?.length > 0) && <>
          <div style={{ fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#aaa', fontWeight: 700, margin: '10px 0 5px' }}>Compétences & Langues</div>
          <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'bubble'} color={c.primary} textColor="#444" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {data.langues?.map((l, i) => <span key={i} style={{ background: c.primary + '18', border: `0.5px solid ${c.primary}66`, borderRadius: 99, padding: '2px 8px', fontSize: 8, color: c.primary }}>{l.langue} — {l.niveau}</span>)}
          </div>
        </>}
        <ExtraSections data={data} color={c.primary} />
      </div>
    </div>
  )
}

// ── DOUBLE BAND ──────────────────────────────────────────────────────────────
function DoubleBand({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780 }}>
      <div style={{ background: c.bg, color: '#fff', padding: '16px 24px 12px', position: 'relative' }}>
        {data.photo && <Avatar src={data.photo} size={46} style={{ position: 'absolute', top: 14, right: 24 }} />}
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 1 }}>{data.nom || 'VOTRE NOM'}</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{data.titre || 'Titre professionnel'}</div>
      </div>
      <div style={{ background: c.accent, color: '#fff', padding: '7px 24px', display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 8 }}>
        {data.email && <span>✉ {data.email}</span>}
        {data.tel && <span>✆ {data.tel}</span>}
        {data.adresse && <span>📍 {data.adresse}</span>}
        {data.ddn && <span>🎂 {data.ddn}</span>}
        {extraItems(data).map((it, i) => <span key={i}>{it.icon} {it.text}</span>)}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '14px 16px 0 24px' }}>
          {data.profil && <>
            <SectionTitle text="Profil" color={c.bg} style={{ borderBottom: `1.5px solid ${c.bg}`, paddingBottom: 3 }} />
            <p style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6 }}>{data.profil}</p>
          </>}
          {data.formations?.length > 0 && <>
            <SectionTitle text="Formation" color={c.bg} style={{ borderBottom: `1.5px solid ${c.bg}`, paddingBottom: 3 }} />
            {data.formations.map((f, i) => <FormBlock key={i} item={f} titleColor="#111" subColor="#666" accentColor={c.bg} order={data.customStyle?.titleOrder} />)}
          </>}
          {data.experiences?.length > 0 && <>
            <SectionTitle text="Expériences" color={c.bg} style={{ borderBottom: `1.5px solid ${c.bg}`, paddingBottom: 3 }} />
            {data.experiences.map((e, i) => <ExpBlock key={i} item={e} titleColor="#111" subColor="#555" dotColor={c.bg} order={data.customStyle?.titleOrder} />)}
          </>}
          <ExtraSections data={data} color={c.bg} />
        </div>
        <div style={{ width: 150, padding: '14px 16px 0 12px', background: '#f8f8f8', borderLeft: `3px solid ${c.accent}` }}>
          {data.competences?.length > 0 && <>
            <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', color: c.bg, marginBottom: 5 }}>Compétences</div>
            <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'liste'} color={c.bg} textColor="#444" />
          </>}
          {data.langues?.length > 0 && <>
            <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', color: c.bg, margin: '10px 0 5px' }}>Langues</div>
            {data.langues.map((l, i) => <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, color: '#222' }}>{l.langue}</div>
              <div style={{ fontSize: 7.5, color: '#888' }}>{l.niveau}</div>
            </div>)}
          </>}
        </div>
      </div>
    </div>
  )
}

// ── TIMELINE ─────────────────────────────────────────────────────────────────
function Timeline({ data, tpl }) {
  const c = tpl.colors
  return (
    <div style={{ fontFamily: data.customStyle?.font || 'Arial, sans-serif', minHeight: 780, padding: '0 0 20px' }}>
      <div style={{ background: c.primary, color: '#fff', padding: '18px 24px 14px', position: 'relative' }}>
        {data.photo && <Avatar src={data.photo} size={50} style={{ position: 'absolute', top: 16, right: 24, border: '2px solid rgba(255,255,255,0.5)' }} />}
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2, maxWidth: data.photo ? '75%' : 'none' }}>{data.nom || 'VOTRE NOM'}</div>
        <div style={{ fontSize: 9, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{data.titre || 'Titre professionnel'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 8, color: 'rgba(255,255,255,0.75)' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.tel && <span>✆ {data.tel}</span>}
          {data.adresse && <span>📍 {data.adresse}</span>}
          {extraItems(data).map((it, i) => <span key={i}>{it.icon} {it.text}</span>)}
        </div>
      </div>
      <div style={{ display: 'flex', padding: '14px 24px 0' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>
          {data.profil && <>
            <SectionTitle text="Profil" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
            <p style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6, marginBottom: 8 }}>{data.profil}</p>
          </>}
          {data.experiences?.length > 0 && <>
            <SectionTitle text="Expériences" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
            <div style={{ position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${c.accent}` }}>
              {data.experiences.map((e, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 10 }}>
                  <div style={{ position: 'absolute', left: -20, top: 2, width: 8, height: 8, borderRadius: '50%', background: c.primary, border: `2px solid ${c.accent}` }} />
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#111' }}>{e.poste}</div>
                  <div style={{ fontSize: 8, color: c.primary, fontStyle: 'italic' }}>{e.lieu} · {e.periode}</div>
                  {e.taches && e.taches.split('\n').filter(Boolean).map((t, j) => <div key={j} style={{ fontSize: 8, color: '#555', paddingLeft: 8 }}>• {t}</div>)}
                </div>
              ))}
            </div>
          </>}
          <ExtraSections data={data} color={c.primary} />
        </div>
        <div style={{ width: 145, paddingLeft: 14, borderLeft: `1px solid #eee` }}>
          {data.formations?.length > 0 && <>
            <SectionTitle text="Formation" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
            {data.formations.map((f, i) => <div key={i} style={{ marginBottom: 7 }}>
              <div style={{ fontSize: 7.5, color: c.accent, fontWeight: 700 }}>{f.annee}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>{f.diplome}</div>
              <div style={{ fontSize: 7.5, color: '#888', fontStyle: 'italic' }}>{f.etablissement}</div>
            </div>)}
          </>}
          {data.competences?.length > 0 && <>
            <SectionTitle text="Compétences" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
            <CompetencesBlock items={data.competences} mode={data.customStyle?.competencesStyle || 'points'} color={c.accent} textColor="#444" />
          </>}
          {data.langues?.length > 0 && <>
            <SectionTitle text="Langues" color={c.primary} style={{ borderBottom: `1.5px solid ${c.primary}`, paddingBottom: 3 }} />
            {data.langues.map((l, i) => <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, color: '#222' }}>{l.langue}</div>
              <div style={{ fontSize: 7.5, color: '#888' }}>{l.niveau}</div>
            </div>)}
          </>}
        </div>
      </div>
    </div>
  )
}

const DENSITY_ZOOM = { compact: 0.92, normal: 1, spacieux: 1.1 }

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function CVRenderer({ data, tpl, forPrint = false }) {
  if (!tpl) return null
  // La densité (zoom CSS) n'est appliquée qu'à l'aperçu écran : le moteur de capture PDF (html2canvas)
  // ne prend pas en charge la propriété `zoom`, donc l'export reste toujours en densité normale.
  const zoom = forPrint ? 1 : (DENSITY_ZOOM[data.customStyle?.density] || 1)
  const style = {
    ...(forPrint ? { width: '210mm', minHeight: '297mm', background: '#fff' } : { width: '100%', background: '#fff', fontSize: 11 }),
    zoom
  }

  const effectiveTpl = data.customStyle?.color
    ? { ...tpl, colors: { ...tpl.colors, primary: data.customStyle.color } }
    : tpl

  const Component = {
    'sidebar-left': SidebarLeft,
    'sidebar-right': SidebarRight,
    'classic': Classic,
    'elegant': Elegant,
    'creative-gradient': CreativeGradient,
    'minimal': Minimal,
    'double-band': DoubleBand,
    'timeline': Timeline,
  }[tpl.layout] || SidebarLeft

  return (
    <div style={style} id={forPrint ? 'cv-print-area' : undefined}>
      <Component data={data} tpl={effectiveTpl} />
    </div>
  )
}
