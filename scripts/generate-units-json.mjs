/**
 * Gera src/data/units.json a partir do PageSeeder.php do Laravel.
 * Rodar: node scripts/generate-units-json.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import slugify from 'slugify'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seederPath = join(__dirname, '../../database/seeders/PageSeeder.php')
const outputPath = join(__dirname, '../src/data/units.json')

const content = readFileSync(seederPath, 'utf8')

// Extrai blocos de unidade do array PHP
const blockRegex = /\[\s*"name"\s*=>\s*"([^"]*)"(.*?)\],/gs
const units = []

let match
while ((match = blockRegex.exec(content)) !== null) {
  const block = match[0]
  const get = (key) => {
    const m = block.match(new RegExp(`"${key}"\\s*=>\\s*"((?:[^"\\\\]|\\\\.)*)"`))
    return m ? m[1].replace(/\\\//g, '/') : ''
  }

  const urlPageRaw = get('url_page')
  const comoChegar = get('como_chegar')

  let logradouro = comoChegar
  let numero = ''
  const addrMatch = comoChegar.match(/(.*),\s*(\d+.*)/)
  if (addrMatch) {
    logradouro = addrMatch[1].trim()
    numero = addrMatch[2].trim()
  }

  const telefoneRaw = get('telefone')
  const telefone = telefoneRaw.replace(/[^0-9]/g, '').slice(0, 20)

  units.push({
    name: urlPageRaw.trim(),
    razao_social: get('name').trim(),
    url_page: slugify(urlPageRaw, { lower: true, strict: true, locale: 'pt' }),
    cidade: get('cidade').trim(),
    estado: get('estado').trim().toUpperCase(),
    nome_dono: get('nome_dono').trim(),
    telefone: telefoneRaw.trim(),
    telefone_numerico: telefone,
    whatsapp: telefone,
    email: get('email').trim(),
    como_chegar: comoChegar.trim(),
    logradouro: logradouro.trim(),
    numero,
    cep: get('cep').trim(),
    is_public: true,
    status: true,
  })
}

writeFileSync(outputPath, JSON.stringify(units, null, 2) + '\n', 'utf8')
console.log(`Gerado ${units.length} unidades em ${outputPath}`)
