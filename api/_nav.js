/*
 * Helpers compartidos por api/editar.js y api/eliminar.js
 * (el prefijo "_" hace que Vercel NO lo exponga como endpoint).
 */
const crypto = require('crypto');

const REPO     = process.env.GITHUB_REPO   || 'cristinaramedina-max/vans-reporte-crecimiento';
const BRANCH   = process.env.GITHUB_BRANCH || 'main';
const NAV_PATH = 'library-nav.js';
const PROTECTED_FILES = /^(index\.html|cargar\.html|vercel\.json|library-nav\.js)$/i;

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function cleanText(s, max) {
  return String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function sanitizeFilename(name) {
  const base = String(name || '').split(/[\\/]/).pop();
  const noAccents = base.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const clean = noAccents.replace(/\s+/g, '_').replace(/[^A-Za-z0-9._-]/g, '').replace(/_+/g, '_');
  if (!clean || clean.startsWith('.')) return '';
  return clean.slice(0, 120);
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function readJson(req) {
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on('data', c => chunks.push(c));
    req.on('end', resolve);
    req.on('error', reject);
  });
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function gh(path, opts = {}, ua = 'uke-biblioteca-grimoldi') {
  const r = await fetch('https://api.github.com/repos/' + REPO + path, {
    ...opts,
    headers: {
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': ua,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
  if (!r.ok) {
    const err = new Error('GitHub ' + r.status + ': ' + ((data && data.message) || text).slice(0, 200));
    err.status = r.status;
    throw err;
  }
  return data;
}

/* ---- library-nav.js: entradas del array UKE_LIBRARY_REPORTS ---- */

function unquote(lit) {
  if (lit[0] === '"') return JSON.parse(lit);
  return lit.slice(1, -1).replace(/\\(.)/g, '$1');            // 'comillas simples'
}

// Devuelve [{ start, end, text, href, externo }] — start/end incluyen la coma y el salto de línea finales.
function parseEntries(navSrc) {
  const a = navSrc.indexOf('UKE_LIBRARY_REPORTS = [');
  if (a === -1) throw new Error('No encontré UKE_LIBRARY_REPORTS en library-nav.js');
  const b = navSrc.indexOf('];', a);
  const out = [];
  const re = /[ \t]*\{[^{}]*\}[ \t]*,?[ \t]*\r?\n?/g;
  re.lastIndex = a;
  let m;
  while ((m = re.exec(navSrc)) && m.index < b) {
    const h = /href:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/.exec(m[0]);
    if (!h) continue;
    out.push({ start: m.index, end: m.index + m[0].length, text: m[0], href: unquote(h[1]), externo: /externo:\s*true/.test(m[0]) });
  }
  return out;
}

function setField(text, name, value) {
  const re = new RegExp(name + ':\\s*("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')');
  return text.replace(re, () => name + ': ' + JSON.stringify(value));
}

// Un solo commit atómico: arma el árbol (library-nav.js + extras) y mueve la rama.
async function commitTree(headSha, baseTree, extra, navSrc, message) {
  const navBlob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: Buffer.from(navSrc, 'utf8').toString('base64'), encoding: 'base64' }) });
  const tree = extra.concat([{ path: NAV_PATH, mode: '100644', type: 'blob', sha: navBlob.sha }]);
  const newTree = await gh('/git/trees',   { method: 'POST', body: JSON.stringify({ base_tree: baseTree, tree }) });
  const commit  = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }) });
  await gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  return commit;
}

async function fileInfo(path, ref) {          // { sha } o null si no existe
  try { return await gh('/contents/' + encodeURIComponent(path) + '?ref=' + ref); }
  catch (e) { if (e.status === 404) return null; throw e; }
}

module.exports = { REPO, BRANCH, NAV_PATH, PROTECTED_FILES, send, cleanText, sanitizeFilename, safeEqual, readJson, gh, parseEntries, setField, commitTree, fileInfo };
