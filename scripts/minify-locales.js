const fs = require('fs')
const path = require('path')

const localesDir = path.join(__dirname, '..', 'locales')

function minifyLocaleFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const parsed = JSON.parse(original)
  const minified = JSON.stringify(parsed)

  if (original !== minified) {
    fs.writeFileSync(filePath, minified)
  }
}

for (const entry of fs.readdirSync(localesDir)) {
  if (!entry.endsWith('.json')) continue
  minifyLocaleFile(path.join(localesDir, entry))
}
