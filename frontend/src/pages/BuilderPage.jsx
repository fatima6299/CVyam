import React, { useState, useRef } from 'react'
import { TEMPLATES } from '../templates/templateList.js'
import CVRenderer from '../templates/CVRenderer.jsx'

const STEPS = ['Template', 'Identité', 'Formation', 'Expériences', 'Compétences', 'Langues', 'Autres sections', 'Télécharger']

const SECTION_CATALOG = [
  { type: 'certificats', label: 'Certificats', icon: '🎖️', mode: 'list', itemLabels: { titre: 'Nom du certificat', sous: 'Organisme', date: 'Date', desc: '' } },
  { type: 'interets', label: 'Centres d\'intérêt', icon: '🎯', mode: 'tags' },
  { type: 'projets', label: 'Projets', icon: '📁', mode: 'list', itemLabels: { titre: 'Titre du projet', sous: '', date: 'Période', desc: 'Description' } },
  { type: 'cours', label: 'Cours', icon: '📚', mode: 'list', itemLabels: { titre: 'Nom du cours', sous: 'Institution', date: 'Date', desc: '' } },
  { type: 'distinctions', label: 'Distinctions', icon: '🏆', mode: 'list', itemLabels: { titre: 'Titre', sous: 'Décerné par', date: 'Date', desc: '' } },
  { type: 'organisations', label: 'Organisations / Bénévolat', icon: '🏠', mode: 'list', itemLabels: { titre: 'Organisation', sous: 'Rôle', date: 'Période', desc: '' } },
  { type: 'publications', label: 'Publications', icon: '📖', mode: 'list', itemLabels: { titre: 'Titre', sous: 'Publié dans', date: 'Date', desc: '' } },
  { type: 'references', label: 'Références', icon: '🔗', mode: 'list', itemLabels: { titre: 'Nom', sous: 'Contact', date: '', desc: 'Relation professionnelle' } },
  { type: 'declaration', label: 'Déclaration', icon: '✍️', mode: 'text' },
  { type: 'custom', label: 'Section personnalisée', icon: '🧩', mode: 'list', itemLabels: { titre: 'Titre', sous: '', date: '', desc: 'Description' } },
]

const EXTRA_DETAILS = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/votre-profil' },
  { key: 'website', label: 'Site web', placeholder: 'votresite.com' },
  { key: 'nationalite', label: 'Nationalité', placeholder: 'Sénégalaise' },
  { key: 'permis', label: 'Permis de conduire', placeholder: 'Catégorie B' },
  { key: 'visa', label: 'Visa', placeholder: 'Schengen valide jusqu\'en 2027' },
  { key: 'piece', label: 'Passeport / CNI', placeholder: 'Numéro ou statut' },
  { key: 'disponibilite', label: 'Disponibilité', placeholder: 'Immédiate' },
]

const categories = [...new Set(TEMPLATES.map(t => t.category))]

function TemplateThumb({ tpl, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      border: selected ? '2px solid #4fc3f7' : '1.5px solid var(--border)',
      borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
      boxShadow: selected ? '0 0 0 3px rgba(79,195,247,0.2)' : 'none',
      transition: 'all 0.15s', background: '#fff'
    }}>
      <div style={{ height: 72, display: 'flex', overflow: 'hidden' }}>
        {tpl.layout === 'sidebar-right' ? (
          <>
            <div style={{ flex: 1, background: '#f0f0f0' }} />
            <div style={{ width: 36, background: tpl.colors.bg }} />
          </>
        ) : tpl.layout === 'classic' || tpl.layout === 'minimal' || tpl.layout === 'timeline' ? (
          <div style={{ flex: 1, background: '#fff', borderTop: `4px solid ${tpl.colors.primary}`, padding: 6 }}>
            <div style={{ height: 6, background: '#111', borderRadius: 2, marginBottom: 4, width: '50%' }} />
            <div style={{ height: 3, background: '#ccc', borderRadius: 2, marginBottom: 3, width: '70%' }} />
            <div style={{ height: 3, background: '#eee', borderRadius: 2, width: '40%' }} />
          </div>
        ) : tpl.layout === 'elegant' ? (
          <div style={{ flex: 1, background: tpl.colors.bg, padding: 6 }}>
            <div style={{ height: 6, background: tpl.colors.accent + '88', borderRadius: 2, marginBottom: 4, width: '55%' }} />
            <div style={{ height: 3, background: tpl.colors.accent + '44', borderRadius: 2, width: '40%' }} />
          </div>
        ) : tpl.layout === 'double-band' ? (
          <div style={{ flex: 1 }}>
            <div style={{ height: 28, background: tpl.colors.bg }} />
            <div style={{ height: 10, background: tpl.colors.accent }} />
            <div style={{ height: 34, background: '#f8f8f8' }} />
          </div>
        ) : (
          <>
            <div style={{ width: 36, background: tpl.colors.bg }} />
            <div style={{ flex: 1, background: '#f8f8f8', padding: 5 }}>
              <div style={{ height: 4, background: '#ddd', borderRadius: 2, marginBottom: 3 }} />
              <div style={{ height: 3, background: '#eee', borderRadius: 2, width: '70%' }} />
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '5px 8px', background: selected ? 'rgba(79,195,247,0.08)' : 'var(--surface1)', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: selected ? '#0277bd' : 'var(--ink2)' }}>{tpl.name}</div>
        <div style={{ fontSize: 10, color: 'var(--ink4)' }}>{tpl.category}</div>
      </div>
    </div>
  )
}

export default function BuilderPage({ user, isPaid, onPay, onLogout }) {
  const [step, setStep] = useState(0)
  const [tplId, setTplId] = useState(TEMPLATES[0].id)
  const [filterCat, setFilterCat] = useState('Tous')
  const [data, setData] = useState({
    nom: user?.name || '', titre: '', email: user?.email || '',
    tel: '', adresse: '', ddn: '', profil: '', photo: '',
    formations: [{ annee: '', diplome: '', etablissement: '' }],
    experiences: [{ periode: '', poste: '', lieu: '', taches: '' }],
    competences: [],
    competencesRaw: '',
    langues: [{ langue: '', niveau: '' }],
    autresInfos: '',
    extras: {},
    extraSections: []
  })
  const [visibleExtras, setVisibleExtras] = useState([])
  const [showPayWall, setShowPayWall] = useState(false)
  const printRef = useRef()

  const tpl = TEMPLATES.find(t => t.id === tplId) || TEMPLATES[0]
  const cvData = {
    ...data,
    competences: data.competencesRaw.split(',').map(s => s.trim()).filter(Boolean),
    extraSections: data.extraSections.map(s => s.mode === 'tags'
      ? { ...s, tags: (s.tagsRaw || '').split(',').map(t => t.trim()).filter(Boolean) }
      : s)
  }

  const set = (k, v) => setData(d => ({ ...d, [k]: v }))
  const setFormation = (i, k, v) => {
    const f = [...data.formations]; f[i] = { ...f[i], [k]: v }; set('formations', f)
  }
  const setExp = (i, k, v) => {
    const e = [...data.experiences]; e[i] = { ...e[i], [k]: v }; set('experiences', e)
  }
  const setLangue = (i, k, v) => {
    const l = [...data.langues]; l[i] = { ...l[i], [k]: v }; set('langues', l)
  }
  const addFormation = () => set('formations', [...data.formations, { annee: '', diplome: '', etablissement: '' }])
  const removeFormation = (i) => set('formations', data.formations.filter((_, j) => j !== i))
  const addExp = () => set('experiences', [...data.experiences, { periode: '', poste: '', lieu: '', taches: '' }])
  const removeExp = (i) => set('experiences', data.experiences.filter((_, j) => j !== i))
  const addLangue = () => set('langues', [...data.langues, { langue: '', niveau: '' }])
  const removeLangue = (i) => set('langues', data.langues.filter((_, j) => j !== i))

  const setExtra = (key, value) => setData(d => ({ ...d, extras: { ...d.extras, [key]: value } }))
  const showExtra = (key) => setVisibleExtras(v => [...v, key])
  const hideExtra = (key) => { setVisibleExtras(v => v.filter(k => k !== key)); setExtra(key, '') }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  const addSection = (catalogEntry) => {
    const section = {
      key: catalogEntry.type + '-' + Date.now(),
      type: catalogEntry.type,
      title: catalogEntry.label,
      mode: catalogEntry.mode,
      ...(catalogEntry.mode === 'list' && { items: [{ titre: '', sous: '', date: '', desc: '' }] }),
      ...(catalogEntry.mode === 'tags' && { tags: [], tagsRaw: '' }),
      ...(catalogEntry.mode === 'text' && { text: '' }),
    }
    set('extraSections', [...data.extraSections, section])
  }
  const removeSection = (key) => set('extraSections', data.extraSections.filter(s => s.key !== key))
  const updateSection = (key, patch) => set('extraSections', data.extraSections.map(s => s.key === key ? { ...s, ...patch } : s))
  const updateSectionItem = (key, i, field, value) => {
    const sec = data.extraSections.find(s => s.key === key)
    const items = [...sec.items]; items[i] = { ...items[i], [field]: value }
    updateSection(key, { items })
  }
  const addSectionItem = (key) => {
    const sec = data.extraSections.find(s => s.key === key)
    updateSection(key, { items: [...sec.items, { titre: '', sous: '', date: '', desc: '' }] })
  }
  const removeSectionItem = (key, i) => {
    const sec = data.extraSections.find(s => s.key === key)
    updateSection(key, { items: sec.items.filter((_, j) => j !== i) })
  }

  const handleDownload = () => {
    if (!isPaid) { setShowPayWall(true); return }
    const html = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html><html><head><title>CV - ${data.nom}</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif}</style>
    </head><body>${html}</body></html>`)
    win.document.close()
    setTimeout(() => win.print(), 400)
  }

  const filteredTpls = filterCat === 'Tous' ? TEMPLATES : TEMPLATES.filter(t => t.category === filterCat)

  const S = {
    wrap: { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" },
    sidebar: { width: 220, background: '#0a1628', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    sidebarTop: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    logo: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' },
    logoAccent: { color: '#4fc3f7' },
    stepList: { padding: '10px 8px', flex: 1 },
    stepItem: (active, done) => ({
      display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
      borderRadius: 7, cursor: 'pointer', marginBottom: 2,
      background: active ? 'rgba(79,195,247,0.12)' : 'transparent'
    }),
    stepDot: (active, done) => ({
      width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, flexShrink: 0,
      background: done ? '#1e8449' : active ? '#4fc3f7' : 'rgba(255,255,255,0.08)',
      color: done || active ? '#fff' : 'rgba(255,255,255,0.4)'
    }),
    stepLabel: (active, done) => ({
      fontSize: 12, color: active ? '#4fc3f7' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)',
      fontWeight: active ? 600 : 400
    }),
    userBadge: { padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: 'rgba(255,255,255,0.4)' },
    main: { flex: 1, display: 'flex', overflow: 'hidden' },
    form: { width: 320, background: 'var(--surface)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    formHeader: { padding: '14px 18px', borderBottom: '0.5px solid var(--border)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' },
    formBody: { flex: 1, overflowY: 'auto', padding: '14px 18px' },
    preview: { flex: 1, background: '#e8e8e5', overflow: 'auto', display: 'flex', flexDirection: 'column' },
    previewTop: { padding: '10px 14px', background: 'var(--surface)', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink3)' },
    previewFrame: { flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
    cvCard: { width: 480, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 2 },
    label: { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
    input: { width: '100%', padding: '8px 11px', border: '0.5px solid var(--border2)', borderRadius: 6, fontSize: 13, marginBottom: 12, background: '#fff', color: 'var(--ink)' },
    textarea: { width: '100%', padding: '8px 11px', border: '0.5px solid var(--border2)', borderRadius: 6, fontSize: 12, marginBottom: 12, background: '#fff', color: 'var(--ink)', resize: 'vertical', minHeight: 60 },
    navBtns: { padding: '10px 18px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 },
    btn: { padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, border: '0.5px solid var(--border2)', background: 'var(--surface1)', cursor: 'pointer', color: 'var(--ink)' },
    btnPrimary: { padding: '8px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, border: 'none', background: '#0a1628', color: '#fff', cursor: 'pointer' },
    blockCard: { background: 'var(--surface1)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '12px', marginBottom: 10, position: 'relative' },
    removeBtn: { position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--ink4)', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
    addBtn: { background: 'none', border: '0.5px dashed var(--border2)', borderRadius: 7, padding: '7px 12px', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', width: '100%', marginTop: 4 },
    select: { width: '100%', padding: '8px 11px', border: '0.5px solid var(--border2)', borderRadius: 6, fontSize: 13, marginBottom: 12, background: '#fff', color: 'var(--ink)' },
  }

  return (
    <div style={S.wrap}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.logo}><span style={S.logoAccent}>CV</span>Builder</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>by BDS Services</div>
        </div>
        <div style={S.stepList}>
          {STEPS.map((s, i) => (
            <div key={s} style={S.stepItem(step === i, step > i)} onClick={() => setStep(i)}>
              <div style={S.stepDot(step === i, step > i)}>{step > i ? '✓' : i + 1}</div>
              <div style={S.stepLabel(step === i, step > i)}>{s}</div>
            </div>
          ))}
        </div>
        <div style={S.userBadge}>
          <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>{user?.name}</div>
          <div style={{ fontSize: 10, marginBottom: 6 }}>{user?.mode === 'auto' ? '500 FCFA · Autonome' : '3 000 FCFA · Assisté'}</div>
          {isPaid && <div style={{ fontSize: 10, color: '#4caf50', marginBottom: 4 }}>✓ Paiement validé</div>}
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', padding: 0 }}>Déconnexion</button>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        {/* Form */}
        <div style={S.form}>
          <div style={S.formHeader}>{STEPS[step]}</div>
          <div style={S.formBody}>

            {/* STEP 0: Template */}
            {step === 0 && (
              <>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {['Tous', ...categories].map(c => (
                    <button key={c} onClick={() => setFilterCat(c)} style={{
                      padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                      border: '0.5px solid var(--border2)',
                      background: filterCat === c ? '#0a1628' : 'var(--surface1)',
                      color: filterCat === c ? '#fff' : 'var(--ink3)'
                    }}>{c}</button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {filteredTpls.map(t => (
                    <TemplateThumb key={t.id} tpl={t} selected={tplId === t.id} onClick={() => setTplId(t.id)} />
                  ))}
                </div>
              </>
            )}

            {/* STEP 1: Identité */}
            {step === 1 && (
              <>
                <label style={S.label}>Photo (facultatif)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    background: 'var(--surface1)', border: '0.5px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {data.photo ? (
                      <img src={data.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 20, color: 'var(--ink4)' }}>🙂</span>
                    )}
                  </div>
                  <label style={{ ...S.btn, display: 'inline-block' }}>
                    Choisir une photo
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                  {data.photo && (
                    <button style={{ ...S.btn, color: 'var(--danger)' }} onClick={() => set('photo', '')}>Supprimer</button>
                  )}
                </div>

                <label style={S.label}>Nom complet</label>
                <input style={S.input} placeholder="Prénom NOM" value={data.nom} onChange={e => set('nom', e.target.value)} />
                <label style={S.label}>Titre / Poste visé</label>
                <input style={S.input} placeholder="Ex: Comptable, Juriste..." value={data.titre} onChange={e => set('titre', e.target.value)} />
                <label style={S.label}>Email</label>
                <input style={S.input} placeholder="email@exemple.com" value={data.email} onChange={e => set('email', e.target.value)} />
                <label style={S.label}>Téléphone</label>
                <input style={S.input} placeholder="+221 XX XXX XX XX" value={data.tel} onChange={e => set('tel', e.target.value)} />
                <label style={S.label}>Adresse</label>
                <input style={S.input} placeholder="Dakar, Sénégal" value={data.adresse} onChange={e => set('adresse', e.target.value)} />
                <label style={S.label}>Date de naissance</label>
                <input style={S.input} placeholder="01/01/2000" value={data.ddn} onChange={e => set('ddn', e.target.value)} />
                <label style={S.label}>Profil / Résumé</label>
                <textarea style={S.textarea} placeholder="Courte présentation en 2-3 phrases..." value={data.profil} onChange={e => set('profil', e.target.value)} />

                <div style={{ marginTop: 4 }}>
                  <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--ink2)' }}>Ajouter des détails</div>
                  {visibleExtras.map(key => {
                    const field = EXTRA_DETAILS.find(f => f.key === key)
                    return (
                      <div key={key} style={S.blockCard}>
                        <button style={S.removeBtn} onClick={() => hideExtra(key)}>×</button>
                        <label style={S.label}>{field.label}</label>
                        <input style={{ ...S.input, marginBottom: 0 }} placeholder={field.placeholder}
                          value={data.extras[key] || ''} onChange={e => setExtra(key, e.target.value)} />
                      </div>
                    )
                  })}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {EXTRA_DETAILS.filter(f => !visibleExtras.includes(f.key)).map(f => (
                      <button key={f.key} onClick={() => showExtra(f.key)} style={{
                        padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                        border: '0.5px dashed var(--border2)', background: 'var(--surface1)', color: 'var(--ink3)'
                      }}>+ {f.label}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Formations */}
            {step === 2 && (
              <>
                {data.formations.map((f, i) => (
                  <div key={i} style={S.blockCard}>
                    {data.formations.length > 1 && <button style={S.removeBtn} onClick={() => removeFormation(i)}>×</button>}
                    <label style={S.label}>Diplôme</label>
                    <input style={S.input} placeholder="Licence en Gestion" value={f.diplome} onChange={e => setFormation(i, 'diplome', e.target.value)} />
                    <label style={S.label}>Établissement</label>
                    <input style={S.input} placeholder="Université / École" value={f.etablissement} onChange={e => setFormation(i, 'etablissement', e.target.value)} />
                    <label style={S.label}>Année</label>
                    <input style={S.input} placeholder="2022 / En cours" value={f.annee} onChange={e => setFormation(i, 'annee', e.target.value)} />
                  </div>
                ))}
                <button style={S.addBtn} onClick={addFormation}>+ Ajouter une formation</button>
              </>
            )}

            {/* STEP 3: Expériences */}
            {step === 3 && (
              <>
                {data.experiences.map((e, i) => (
                  <div key={i} style={S.blockCard}>
                    {data.experiences.length > 1 && <button style={S.removeBtn} onClick={() => removeExp(i)}>×</button>}
                    <label style={S.label}>Poste</label>
                    <input style={S.input} placeholder="Agent Immobilier" value={e.poste} onChange={ev => setExp(i, 'poste', ev.target.value)} />
                    <label style={S.label}>Entreprise / Structure</label>
                    <input style={S.input} placeholder="Nom de l'entreprise" value={e.lieu} onChange={ev => setExp(i, 'lieu', ev.target.value)} />
                    <label style={S.label}>Période</label>
                    <input style={S.input} placeholder="2023 – 2024" value={e.periode} onChange={ev => setExp(i, 'periode', ev.target.value)} />
                    <label style={S.label}>Tâches (une par ligne)</label>
                    <textarea style={S.textarea} placeholder="Gestion locative&#10;Recouvrement des loyers&#10;..." value={e.taches} onChange={ev => setExp(i, 'taches', ev.target.value)} />
                  </div>
                ))}
                <button style={S.addBtn} onClick={addExp}>+ Ajouter une expérience</button>
              </>
            )}

            {/* STEP 4: Compétences */}
            {step === 4 && (
              <>
                <label style={S.label}>Compétences (séparées par des virgules)</label>
                <textarea style={S.textarea} placeholder="Word, Excel, Comptabilité, Gestion..." value={data.competencesRaw} onChange={e => set('competencesRaw', e.target.value)} />
              </>
            )}

            {/* STEP 5: Langues */}
            {step === 5 && (
              <>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink2)' }}>Langues</div>
                {data.langues.map((l, i) => (
                  <div key={i} style={S.blockCard}>
                    {data.langues.length > 1 && <button style={S.removeBtn} onClick={() => removeLangue(i)}>×</button>}
                    <label style={S.label}>Langue</label>
                    <input style={S.input} placeholder="Français" value={l.langue} onChange={e => setLangue(i, 'langue', e.target.value)} />
                    <label style={S.label}>Niveau</label>
                    <select style={S.select} value={l.niveau} onChange={e => setLangue(i, 'niveau', e.target.value)}>
                      <option value="">— Sélectionner —</option>
                      <option>Langue maternelle</option>
                      <option>Courant (C2)</option>
                      <option>Avancé (C1)</option>
                      <option>Bon niveau (B2)</option>
                      <option>Intermédiaire (B1)</option>
                      <option>Notions (A2)</option>
                    </select>
                  </div>
                ))}
                <button style={S.addBtn} onClick={addLangue}>+ Ajouter une langue</button>
                <div style={{ marginTop: 12 }}>
                  <label style={S.label}>Informations complémentaires</label>
                  <textarea style={S.textarea} placeholder="Centres d'intérêt, bénévolat..." value={data.autresInfos} onChange={e => set('autresInfos', e.target.value)} />
                </div>
              </>
            )}

            {/* STEP 6: Sections additionnelles */}
            {step === 6 && (
              <>
                {data.extraSections.map(sec => {
                  const catalogEntry = SECTION_CATALOG.find(c => c.type === sec.type)
                  return (
                    <div key={sec.key} style={S.blockCard}>
                      <button style={S.removeBtn} onClick={() => removeSection(sec.key)}>×</button>
                      {sec.type === 'custom' ? (
                        <input style={{ ...S.input, fontWeight: 600 }} placeholder="Titre de la section"
                          value={sec.title} onChange={e => updateSection(sec.key, { title: e.target.value })} />
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>{catalogEntry.icon} {sec.title}</div>
                      )}

                      {sec.mode === 'text' && (
                        <textarea style={{ ...S.textarea, marginBottom: 0 }} placeholder="Votre texte..."
                          value={sec.text} onChange={e => updateSection(sec.key, { text: e.target.value })} />
                      )}

                      {sec.mode === 'tags' && (
                        <textarea style={{ ...S.textarea, marginBottom: 0 }} placeholder="Lecture, voyages, football... (séparés par des virgules)"
                          value={sec.tagsRaw} onChange={e => updateSection(sec.key, { tagsRaw: e.target.value })} />
                      )}

                      {sec.mode === 'list' && (
                        <>
                          {sec.items.map((it, i) => (
                            <div key={i} style={{ ...S.blockCard, background: 'var(--surface)' }}>
                              {sec.items.length > 1 && <button style={S.removeBtn} onClick={() => removeSectionItem(sec.key, i)}>×</button>}
                              {catalogEntry.itemLabels.titre && (
                                <input style={S.input} placeholder={catalogEntry.itemLabels.titre}
                                  value={it.titre} onChange={e => updateSectionItem(sec.key, i, 'titre', e.target.value)} />
                              )}
                              {catalogEntry.itemLabels.sous && (
                                <input style={S.input} placeholder={catalogEntry.itemLabels.sous}
                                  value={it.sous} onChange={e => updateSectionItem(sec.key, i, 'sous', e.target.value)} />
                              )}
                              {catalogEntry.itemLabels.date && (
                                <input style={S.input} placeholder={catalogEntry.itemLabels.date}
                                  value={it.date} onChange={e => updateSectionItem(sec.key, i, 'date', e.target.value)} />
                              )}
                              {catalogEntry.itemLabels.desc && (
                                <textarea style={{ ...S.textarea, marginBottom: 0 }} placeholder={catalogEntry.itemLabels.desc}
                                  value={it.desc} onChange={e => updateSectionItem(sec.key, i, 'desc', e.target.value)} />
                              )}
                            </div>
                          ))}
                          <button style={S.addBtn} onClick={() => addSectionItem(sec.key)}>+ Ajouter</button>
                        </>
                      )}
                    </div>
                  )
                })}

                <div style={{ marginTop: 4 }}>
                  <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--ink2)' }}>Ajouter une section</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {SECTION_CATALOG.filter(c => c.type === 'custom' || !data.extraSections.some(s => s.type === c.type)).map(c => (
                      <button key={c.type} onClick={() => addSection(c)} style={{
                        padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                        border: '0.5px dashed var(--border2)', background: 'var(--surface1)', color: 'var(--ink3)'
                      }}>+ {c.icon} {c.label}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* STEP 7: Télécharger */}
            {step === 7 && (
              <div>
                {isPaid ? (
                  <div style={{ background: '#d5f5e3', border: '0.5px solid #a9dfbf', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e8449', marginBottom: 3 }}>✓ Paiement validé</div>
                    <div style={{ fontSize: 12, color: '#196f3d' }}>Vous pouvez télécharger votre CV en PDF.</div>
                  </div>
                ) : (
                  <div style={{ background: '#fef9e7', border: '0.5px solid #f9ca79', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#d68910', marginBottom: 3 }}>Paiement requis</div>
                    <div style={{ fontSize: 12, color: '#9a7d0a', marginBottom: 8 }}>
                      Validez votre paiement de {user?.mode === 'auto' ? '500' : '3 000'} FCFA pour télécharger votre CV.
                    </div>
                    <button onClick={() => onPay(cvData)} style={{ background: '#d68910', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                      Procéder au paiement →
                    </button>
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 8 }}>Template sélectionné : <strong>{tpl.name}</strong></div>
                <button onClick={handleDownload} disabled={!isPaid} style={{
                  width: '100%', padding: '11px', borderRadius: 99, fontSize: 14, fontWeight: 700,
                  border: 'none', fontFamily: "'Space Grotesk', sans-serif",
                  background: isPaid ? '#0a1628' : '#ccc', color: '#fff',
                  cursor: isPaid ? 'pointer' : 'not-allowed'
                }}>
                  {isPaid ? '⬇ Télécharger le PDF' : '🔒 Paiement requis'}
                </button>
                <div style={{ display: 'none' }} ref={printRef}>
                  <CVRenderer data={cvData} tpl={tpl} forPrint />
                </div>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div style={S.navBtns}>
            {step > 0 && <button style={S.btn} onClick={() => setStep(s => s - 1)}>← Retour</button>}
            {step < 7 && <button style={{ ...S.btnPrimary, marginLeft: 'auto' }} onClick={() => setStep(s => s + 1)}>Suivant →</button>}
          </div>
        </div>

        {/* Preview */}
        <div style={S.preview}>
          <div style={S.previewTop}>
            <span>Prévisualisation en direct · {tpl.name}</span>
            <span style={{ fontSize: 11, color: '#aaa' }}>Format A4</span>
          </div>
          <div style={S.previewFrame}>
            <div style={S.cvCard}>
              <CVRenderer data={cvData} tpl={tpl} />
            </div>
          </div>
        </div>
      </div>

      {/* Paywall overlay */}
      {showPayWall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>Téléchargement verrouillé</div>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
              Votre CV est prêt ! Pour télécharger le PDF, validez votre paiement de <strong>{user?.mode === 'auto' ? '500' : '3 000'} FCFA</strong> via Wave, Orange Money ou espèces.
            </p>
            <button onClick={() => { setShowPayWall(false); onPay(cvData) }} style={{ background: '#0a1628', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 99, fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%', marginBottom: 8 }}>
              Payer maintenant →
            </button>
            <button onClick={() => setShowPayWall(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: 13, cursor: 'pointer' }}>
              Continuer à modifier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
