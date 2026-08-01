import fs from 'fs'
import crypto from 'crypto'
import { execSync } from 'child_process'

// 1) Read backend/.env
let env = 'NO_ENV_FILE'
try {
  env = fs.readFileSync(new URL('./backend/.env', import.meta.url), 'utf8')
} catch (e) {
  env = 'ERR: ' + e.message
}

const hash = (env.match(/ADMIN_CODE_HASH\s*=\s*(.+)/) || [])[1] || '(non défini)'

const out = ['=== backend/.env ===', env, '', '=== ADMIN_CODE_HASH ===', hash.trim()]

// 2) Try to find the plaintext code in git history
out.push('', '=== git search for admin code ===')
try {
  const gitOut = execSync('git log -p --all -- backend/.env backend/routes/auth.js backend/server.js render.yaml', { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })
  const lines = gitOut.split('\n').filter(l => /ADMIN_CODE|admin.*code|code\s*=\s*['"]/.test(l))
  out.push(lines.slice(0, 40).join('\n') || '(aucune correspondance)')
} catch (e) {
  out.push('(git non disponible: ' + e.message + ')')
}

// 3) Compute hash of some likely default codes to help verify
out.push('', '=== hashes of common codes (to verify) ===')
const stored = hash.trim().toLowerCase()
for (const code of ['1234', '0000', 'admin', 'admin123', 'admin2024', 'admin2025', 'admin2026', 'FTD', 'ftd', 'ftd2024', 'bds', 'BDS', 'bds123', 'cvyam', 'CVYAM', '123456', 'password', 'root', '12345']) {
  const h = crypto.createHash('sha256').update(code, 'utf8').digest('hex')
  const match = stored === h ? '  <-- MATCH' : ''
  out.push(`${code.padEnd(12)} ${h}${match}`)
}

fs.writeFileSync('admin_info.txt', out.join('\n'), 'utf8')
console.log('done')

