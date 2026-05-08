const { generateLocalesCode } = require('../codegen');
const assert = require('assert');

console.log('Testing codegen...');

const syncCode = generateLocalesCode(['zh-hans', 'en'], false);
console.log('Sync code:', syncCode);
assert(syncCode.includes("'zh-hans': () => require('./locales/zh-hans.json')"));
assert(syncCode.includes("'en': () => require('./locales/en.json')"));
assert(!syncCode.includes("'ja'"));

const asyncCode = generateLocalesCode(['zh-hans', 'ja'], true);
console.log('Async code:', asyncCode);
assert(asyncCode.includes("'zh-hans': () => import('./locales/zh-hans.json')"));
assert(asyncCode.includes("'ja': () => import('./locales/ja.json')"));
assert(!asyncCode.includes("'en'"));

console.log('Codegen test passed!');

// Mock index.js content
const indexContent = `
function init(locale) {
  const targetLocale = locale || 'zh-hans';
  const data = require(\`./locales/\${targetLocale}.json\`)
  return data;
}
async function initAsync(locale) {
  const targetLocale = locale || 'zh-hans';
  const module = await import(/* webpackChunkName: "nls-[request]" */ \`./locales/\${targetLocale}.json\`)
  return module;
}
`;

console.log('Testing regex replacement...');
const languages = ['zh-hans'];
const newSyncCode = generateLocalesCode(languages, false);
const newAsyncCode = generateLocalesCode(languages, true);

let transformed = indexContent.replace(/require\(\`\.\/locales\/\$\{targetLocale\}\.json\`\)/g, newSyncCode);
transformed = transformed.replace(/import\(.*?\`\.\/locales\/\$\{targetLocale\}\.json\`\)/g, newAsyncCode);

console.log('Transformed content:', transformed);
assert(transformed.includes("'zh-hans': () => require('./locales/zh-hans.json')"));
assert(transformed.includes("'zh-hans': () => import('./locales/zh-hans.json')"));
assert(!transformed.includes('targetLocale}.json'));

console.log('Regex replacement test passed!');
