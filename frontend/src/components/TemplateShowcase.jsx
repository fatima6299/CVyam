import React from 'react'
import CVRenderer from '../templates/CVRenderer.jsx'
import { TEMPLATES } from '../templates/templateList.js'

const BASE_WIDTH = 480
const BASE_HEIGHT = 780

function sample(nom, titre, extra = {}) {
  return {
    nom, titre,
    email: nom.toLowerCase().replace(/[^a-z]+/g, '.') + '@email.com',
    tel: '+221 77 123 45 67',
    adresse: 'Dakar, Sénégal',
    ddn: '',
    profil: "Professionnel(le) motivé(e), rigoureux(se) et orienté(e) résultats, avec une solide expérience de terrain.",
    formations: [{ annee: '2019', diplome: 'Licence Professionnelle', etablissement: 'Université Cheikh Anta Diop' }],
    experiences: [{ periode: '2021 – 2025', poste: titre, lieu: 'Entreprise SARL', taches: 'Gestion des dossiers\nSuivi client\nReporting mensuel' }],
    competences: ['Organisation', 'Excel', 'Communication'],
    langues: [{ langue: 'Français', niveau: 'Langue maternelle' }, { langue: 'Anglais', niveau: 'Bon niveau (B2)' }],
    autresInfos: '',
    ...extra
  }
}

const SHOWCASE = [
  { tplId: 'moderne-bleu', data: sample('Aminata Diallo', 'Comptable') },
  { tplId: 'elegant-or', data: sample('Cheikh Diop', 'Directeur Commercial') },
  { tplId: 'creatif-sunset', data: sample('Khadija Ba', 'Designer Graphique') },
  { tplId: 'classique-marine', data: sample('Mamadou Fall', 'Juriste') },
  { tplId: 'minimaliste-noir', data: sample('Fatou Ndiaye', 'Développeuse Web') },
  { tplId: 'corporate-teal', data: sample('Ibrahima Sarr', 'Chargé de Projet') },
  { tplId: 'timeline', data: sample('Awa Sow', 'Ingénieure') },
  { tplId: 'tropical', data: sample('Ousmane Kane', 'Chef de Projet Événementiel') },
]

function tplById(id) { return TEMPLATES.find(t => t.id === id) }

export function TemplateCard({ tplId, data, width = 150, rotate = 0, style = {} }) {
  const tpl = tplById(tplId)
  const scale = width / BASE_WIDTH
  const height = BASE_HEIGHT * scale
  return (
    <div style={{
      width, height, overflow: 'hidden', borderRadius: 6, background: '#fff',
      boxShadow: '0 12px 28px rgba(0,0,0,0.35)', transform: `rotate(${rotate}deg)`,
      flexShrink: 0, ...style
    }}>
      <div style={{ width: BASE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <CVRenderer data={data} tpl={tpl} />
      </div>
    </div>
  )
}

export function HeroFan() {
  const items = [SHOWCASE[0], SHOWCASE[1], SHOWCASE[2]]
  return (
    <div style={{ position: 'relative', width: 260, height: 300, margin: '0 auto' }}>
      <TemplateCard {...items[0]} tplId={items[0].tplId} width={150} rotate={-9}
        style={{ position: 'absolute', left: 0, top: 30 }} />
      <TemplateCard {...items[1]} tplId={items[1].tplId} width={160} rotate={0}
        style={{ position: 'absolute', left: 55, top: 0, zIndex: 2 }} />
      <TemplateCard {...items[2]} tplId={items[2].tplId} width={150} rotate={9}
        style={{ position: 'absolute', left: 115, top: 30 }} />
    </div>
  )
}

function GalleryCard({ tplId, data, onSelect }) {
  const [hover, setHover] = React.useState(false)
  const tpl = tplById(tplId)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '16px 14px', textAlign: 'center',
        transform: hover ? 'translateY(-4px)' : 'none', transition: 'transform 0.15s'
      }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <TemplateCard tplId={tplId} data={data} width={140} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{tpl.name}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{tpl.category}</div>
      <button onClick={onSelect} style={{
        background: 'none', border: 'none', color: '#4fc3f7', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', padding: 0
      }}>
        Utiliser ce modèle →
      </button>
    </div>
  )
}

export default function TemplateShowcase({ onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, padding: '4px 2px 18px' }}>
      {SHOWCASE.map(({ tplId, data }) => (
        <GalleryCard key={tplId} tplId={tplId} data={data} onSelect={onSelect} />
      ))}
    </div>
  )
}
