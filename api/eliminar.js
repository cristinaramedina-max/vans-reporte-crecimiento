/*
 * Biblioteca de Reportes — endpoint de eliminación
 *
 * POST /api/eliminar
 * Body JSON: { key, href }
 *
 * - Entrada de archivo: borra el archivo del repo Y la entrada de library-nav.js (un solo commit).
 *   Si otra entrada usa el mismo archivo, solo se quita la entrada y el archivo se conserva.
 * - Entrada externa (externo: true): solo quita la entrada de library-nav.js.
 */
const N = require('./_nav');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return N.send(res, 405, { ok: false, error: 'Usá POST.' });
  if (!process.env.GITHUB_TOKEN || !process.env.UPLOAD_KEY) {
    return N.send(res, 500, { ok: false, error: 'Faltan variables de entorno.' });
  }

  let body;
  try { body = await N.readJson(req); }
  catch (e) { return N.send(res, 400, { ok: false, error: 'No pude leer el pedido.' }); }

  if (!N.safeEqual(body.key, process.env.UPLOAD_KEY)) return N.send(res, 401, { ok: false, error: 'Clave incorrecta.' });

  const href = String(body.href || '').trim();
  if (!href) return N.send(res, 400, { ok: false, error: 'Falta el href.' });

  try {
    const ref        = await N.gh('/git/ref/heads/' + N.BRANCH);
    const headSha    = ref.object.sha;
    const headCommit = await N.gh('/git/commits/' + headSha);
    const navFile    = await N.gh('/contents/' + N.NAV_PATH + '?ref=' + headSha);
    const navSrc     = Buffer.from(navFile.content, 'base64').toString('utf8');

    const entries = N.parseEntries(navSrc);
    const entry   = entries.find(e => e.href === href);
    if (!entry) return N.send(res, 404, { ok: false, error: 'No encontré la entrada con ese href en library-nav.js.' });

    const extra = [];
    let archivoEliminado = false;
    let aviso = '';

    if (!entry.externo) {
      if (N.PROTECTED_FILES.test(href) || /\.(js|mjs|cjs)$/i.test(href) || /[\\/]/.test(href)) {
        return N.send(res, 400, { ok: false, error: 'Ese archivo no se puede eliminar desde la Biblioteca.' });
      }
      const otraEntrada = entries.some(e => e !== entry && !e.externo && e.href === href);
      if (otraEntrada) {
        aviso = 'El archivo se conservó porque otra entrada lo usa.';
      } else if (await N.fileInfo(href, headSha)) {
        extra.push({ path: href, mode: '100644', type: 'blob', sha: null });   // sha:null = borrar
        archivoEliminado = true;
      } else {
        aviso = 'El archivo ya no estaba en el repo; se quitó solo la entrada.';
      }
    }

    const newNav = navSrc.slice(0, entry.start) + navSrc.slice(entry.end);
    const commit = await N.commitTree(headSha, headCommit.tree.sha, extra, newNav,
      'Biblioteca: eliminar "' + N.cleanText(entry.href, 100) + '"');

    return N.send(res, 200, { ok: true, href, externo: entry.externo, archivoEliminado, aviso, commit: commit.sha });
  } catch (e) {
    return N.send(res, 502, { ok: false, error: 'Error al eliminar: ' + e.message });
  }
};
