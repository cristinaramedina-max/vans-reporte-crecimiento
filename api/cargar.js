/*
 * Biblioteca de Reportes — endpoint de carga (Vercel Serverless Function)
 *
 * POST /api/cargar
 *   Archivo:  Content-Type: application/octet-stream, body = bytes del archivo,
 *             headers x-uke-meta = encodeURIComponent(JSON.stringify(meta))
 *   Link:     Content-Type: application/json, body = { ...meta, url }
 *
 * meta = { key, cliente, titulo?, descripcion?, filename?, reemplazar? }
 *
 * Hace UN commit en GitHub con:
 *   - el archivo subido (en la raíz del repo, nombre saneado), si es archivo
 *   - library-nav.js con la nueva entrada agregada al array
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 *   GITHUB_TOKEN   token fine-grained con "Contents: Read and write" sobre el repo
 *   UPLOAD_KEY     clave para poder cargar (distinta de la contraseña del portal)
 *   GITHUB_REPO    opcional, default "cristinaramedina-max/vans-reporte-crecimiento"
 *   GITHUB_BRANCH  opcional, default "main"
 */

const REPO = process.env.GITHUB_REPO || 'cristinaramedina-max/vans-reporte-crecimiento';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const NAV_PATH = 'library-nav.js';
const MARKER = '// @@UKE_NUEVOS_REPORTES@@';
const MAX_BYTES = 4 * 1024 * 1024; // Vercel corta los requests en ~4.5 MB

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BYTES + 1024 * 64) { reject(Object.assign(new Error('too_big'), { code: 'too_big' })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function gh(path, opts = {}) {
  const r = await fetch('https://api.github.com/repos/' + REPO + path, {
    ...opts,
    headers: {
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'uke-biblioteca-cargar',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
  if (!r.ok) {
    const err = new Error('GitHub ' + r.status + ' en ' + path + ': ' + ((data && data.message) || text).slice(0, 200));
    err.status = r.status;
    throw err;
  }
  return data;
}

function sanitizeFilename(name) {
  const base = String(name || '').split(/[\\/]/).pop();
  const noAccents = base.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const clean = noAccents.replace(/\s+/g, '_').replace(/[^A-Za-z0-9._-]/g, '').replace(/_+/g, '_');
  if (!clean || clean.startsWith('.')) return '';
  return clean.slice(0, 120);
}

function cleanText(s, max) {
  return String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function entryCode(e) {
  const lines = [
    '      cliente: ' + JSON.stringify(e.cliente),
    '      titulo: ' + JSON.stringify(e.titulo),
    '      descripcion: ' + JSON.stringify(e.descripcion),
    '      href: ' + JSON.stringify(e.href),
  ];
  if (e.externo) lines.push('      externo: true');
  lines.push('      cargado: ' + JSON.stringify(e.cargado));
  return '    {\n' + lines.join(',\n') + '\n    },\n';
}

function insertEntry(navSrc, code) {
  if (navSrc.indexOf(MARKER) === -1) throw new Error('No encontré el marcador de carga en library-nav.js');
  return navSrc.replace(MARKER, code.trimStart() + '    ' + MARKER);
}

async function commitOnce(files, message) {
  const ref = await gh('/git/ref/heads/' + BRANCH);
  const headSha = ref.object.sha;
  const headCommit = await gh('/git/commits/' + headSha);

  // library-nav.js actual en esa cabeza
  const navFile = await gh('/contents/' + NAV_PATH + '?ref=' + headSha);
  const navSrc = Buffer.from(navFile.content, 'base64').toString('utf8');

  const tree = [];
  for (const f of files.binaries) {
    if (!f.reemplazar) {
      try {
        await gh('/contents/' + encodeURIComponent(f.path) + '?ref=' + headSha);
        const err = new Error('Ya existe un archivo llamado "' + f.path + '" en la Biblioteca. Marcá "Reemplazar si ya existe" o cambiale el nombre al archivo.');
        err.status = 409; err.userFacing = true; throw err;
      } catch (e) { if (e.status !== 404) throw e; }
    }
    const blob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: f.content.toString('base64'), encoding: 'base64' }) });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newNav = files.navEntry ? insertEntry(navSrc, files.navEntry) : navSrc;
  const navBlob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: Buffer.from(newNav, 'utf8').toString('base64'), encoding: 'base64' }) });
  tree.push({ path: NAV_PATH, mode: '100644', type: 'blob', sha: navBlob.sha });

  const newTree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }) });
  const commit = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }) });
  await gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  return commit;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Usá POST.' });
  if (!process.env.GITHUB_TOKEN || !process.env.UPLOAD_KEY) {
    return send(res, 500, { ok: false, error: 'Falta configurar GITHUB_TOKEN y/o UPLOAD_KEY en Vercel.' });
  }

  let meta, fileBuf = null;
  try {
    const ctype = String(req.headers['content-type'] || '');
    const body = await readBody(req);
    if (ctype.startsWith('application/json')) {
      meta = JSON.parse(body.toString('utf8') || '{}');
    } else {
      meta = JSON.parse(decodeURIComponent(String(req.headers['x-uke-meta'] || '%7B%7D')));
      fileBuf = body;
    }
  } catch (e) {
    if (e.code === 'too_big') return send(res, 413, { ok: false, error: 'El archivo supera los 4 MB que acepta la carga directa.' });
    return send(res, 400, { ok: false, error: 'No pude leer el pedido.' });
  }

  if (meta.key !== process.env.UPLOAD_KEY) return send(res, 401, { ok: false, error: 'Clave de carga incorrecta.' });

  const cliente = cleanText(meta.cliente, 60);
  if (!cliente) return send(res, 400, { ok: false, error: 'Elegí la marca o segmento.' });
  const descripcion = cleanText(meta.descripcion, 300);
  const hoy = new Date().toISOString().slice(0, 10);

  const files = { binaries: [], navEntry: null };
  let titulo, href, externo = false;

  if (fileBuf) {
    if (!fileBuf.length) return send(res, 400, { ok: false, error: 'El archivo vino vacío.' });
    if (fileBuf.length > MAX_BYTES) return send(res, 413, { ok: false, error: 'El archivo supera los 4 MB que acepta la carga directa.' });
    const fname = sanitizeFilename(meta.filename);
    if (!fname || fname === NAV_PATH || /^(index\.html|vercel\.json|cargar\.html)$/i.test(fname) || /\.(js|mjs|cjs)$/i.test(fname)) {
      return send(res, 400, { ok: false, error: 'Ese nombre de archivo no se puede usar en la Biblioteca.' });
    }
    titulo = cleanText(meta.titulo, 120) || cleanText(String(meta.filename).replace(/\.[^.]+$/, ''), 120);
    href = fname;
    files.binaries.push({ path: fname, content: fileBuf, reemplazar: !!meta.reemplazar });
  } else {
    const url = String(meta.url || '').trim();
    if (!/^https?:\/\/[^\s"'<>]+$/i.test(url)) return send(res, 400, { ok: false, error: 'El link tiene que empezar con http:// o https://' });
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
    titulo = cleanText(meta.titulo, 120) || ('Link — ' + host);
    href = url;
    externo = true;
  }

  files.navEntry = entryCode({ cliente, titulo, descripcion, href, externo, cargado: hoy });
  const message = 'Biblioteca: carga "' + titulo + '" (' + cliente + ')';

  try {
    let commit;
    try { commit = await commitOnce(files, message); }
    catch (e) {
      // Si alguien commiteó en el medio (no fast-forward), reintento una vez
      if (!e.userFacing && (e.status === 422 || e.status === 409)) commit = await commitOnce(files, message);
      else throw e;
    }
    return send(res, 200, {
      ok: true,
      entrada: { cliente, titulo, href, externo },
      commit: commit.sha,
      commitUrl: 'https://github.com/' + REPO + '/commit/' + commit.sha,
    });
  } catch (e) {
    return send(res, e.userFacing ? e.status : 502, { ok: false, error: e.userFacing ? e.message : ('No pude guardar en GitHub. ' + e.message) });
  }
};
