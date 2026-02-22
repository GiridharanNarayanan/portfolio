/**
 * Embeds JetBrains Mono as a base64 @font-face into all SVGs that reference it.
 * This makes the SVGs self-contained so fonts render correctly when loaded via <img>.
 *
 * Usage: node scripts/embed-font-in-svgs.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, join } from 'path'

const ROOT = resolve(import.meta.dirname, '..')

function findFiles(dir, ext, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      findFiles(full, ext, results)
    } else if (entry.endsWith(ext)) {
      results.push(full)
    }
  }
  return results
}
const regularFont = readFileSync(resolve(ROOT, 'public/fonts/JetBrainsMono-Regular.woff2'))
const boldFont = readFileSync(resolve(ROOT, 'public/fonts/JetBrainsMono-Bold.woff2'))

const regularB64 = regularFont.toString('base64')
const boldB64 = boldFont.toString('base64')

const FONT_FACE_BLOCK = `
  <style>
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('data:font/woff2;base64,${regularB64}') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('data:font/woff2;base64,${boldB64}') format('woff2');
      font-weight: 700;
      font-style: normal;
    }`

const svgFiles = findFiles(resolve(ROOT, 'public'), '.svg')

let updated = 0

for (const file of svgFiles) {
  const original = readFileSync(file, 'utf8')

  // Skip SVGs that don't use JetBrains Mono
  if (!original.includes('JetBrains Mono')) continue

  // Skip if already embedded
  if (original.includes('data:font/woff2')) {
    console.log(`⏭  already embedded: ${file.replace(ROOT + '\\', '')}`)
    continue
  }

  let result

  if (original.includes('<style>')) {
    // Merge into existing <style> block
    result = original.replace('<style>', FONT_FACE_BLOCK)
  } else {
    // Inject right after opening <svg ...> tag
    result = original.replace(/(<svg[^>]*>)/, `$1\n${FONT_FACE_BLOCK}\n  </style>`)
  }

  writeFileSync(file, result, 'utf8')
  console.log(`✓  embedded: ${file.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`)
  updated++
}

console.log(`\nDone. ${updated} SVG(s) updated.`)
