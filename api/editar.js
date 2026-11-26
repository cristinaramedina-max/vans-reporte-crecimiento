/*
 * Biblioteca de Reportes — endpoint de edición
 *
 * POST /api/editar
 * Body JSON: { key, href, titulo, cliente, descripcion, nuevoHref? }
 *
 * Busca la entrada por href en library-nav.js y actualiza titulo, cliente y descripcion.
 * Si viene nuevoHref (y es distinto de href):
 *   - entrada de archivo: renombra el archivo en el repo (mismo commit) y actualiza el href
 *   - entrada externa (externo: true): solo actualiza el link
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

  const href         = String(body.href || '').trim();
  const nuevoTitulo  = N.cleanText(body.titulo, 120);
  const nuevoCliente = N.cleanText(body.cliente, 60);
  const nuevaDesc    = N.cleanText(body.descripcion, 300);
  const nuevoHrefRaw = String(body.nuevoHref || '').trim();

  if (!href) return N.send(res, 400, { ok: false, error: 'Falta el href.' });
  if (!nuevoTitulo) return N.send(res, 400, { ok: false, error: 'El título no puede estar vacío.' });
  if (!nuevoCliente) return N.send(res, 400, { ok: false, error: 'El segmento no puede estar vacío.' });

  try {
    const ref        = await N.gh('/git/ref/heads/' + N.BRANCH);
    const headSha    = ref.object.sha;
    const headCommit = await N.gh('/git/commits/' + headSha);
    const navFile    = await N.gh('/contents/' + N.NAV_PATH + '?ref=' + headSha);
    const navSrc     = Buffer.from(navFile.content, 'base64').toString('utf8');

    const entries = N.parseEntries(navSrc);
    const entry   = entries.find(e => e.href === href);
    if (!entry) return N.send(res, 404, { ok: false, error: 'No encontré la entrada con ese href en library-nav.js.' });

    // ---- href nuevo ----
    let finalHref = href;
    const extra = [];
    if (nuevoHrefRaw && nuevoHrefRaw !== href) {
      if (entry.externo) {
        if (!/^https?:\/\/[^\s"'<>]+$/i.test(nuevoHrefRaw)) {
          return N.send(res, 400, { ok: false, error: 'El link tiene que empezar con http:// o https://' });
        }
        finalHref = nuevoHrefRaw;
      } else {
        const nuevoNombre = N.sanitizeFilename(nuevoHrefRaw);
        const extOld = (href.match(/\.[^.]+$/) || [''])[0].toLowerCase();
        const extNew = (nuevoNombre.match(/\.[^.]+$/) || [''])[0].toLowerCase();
        if (!nuevoNombre || N.PROTECTED_FILES.test(nuevoNombre) || /\.(js|mjs|cjs)$/i.test(nuevoNombre)) {
          return N.send(res, 400, { ok: false, error: 'Ese nombre de archivo no se puede usar en la Biblioteca.' });
        }
        if (extNew !== extOld) {
          return N.send(res, 400, { ok: false, error: 'El nombre tiene que mantener la extensión (' + (extOld || 'sin extensión') + ').' });
        }
        if (nuevoNombre !== href) {
          if (entries.some(e => e.href === nuevoNombre) || await N.fileInfo(nuevoNombre, headSha)) {
            return N.send(res, 409, { ok: false, error: 'Ya existe un archivo llamado "' + nuevoNombre + '" en la Biblioteca.' });
          }
          const src = await N.fileInfo(href, headSha);
          if (!src) return N.send(res, 404, { ok: false, error: 'No encontré el archivo "' + href + '" en el repo.' });
          // mismo contenido (mismo blob) bajo el nombre nuevo + borrado del viejo, todo en un commit
          extra.push({ path: nuevoNombre, mode: '100644', type: 'blob', sha: src.sha });
          extra.push({ path: href,        mode: '100644', type: 'blob', sha: null });
          finalHref = nuevoNombre;
        }
      }
    }

    // ---- campos de la entrada ----
    let nuevo = entry.text;
    nuevo = N.setField(nuevo, 'cliente', nuevoCliente);
    nuevo = N.setField(nuevo, 'titulo', nuevoTitulo);
    nuevo = N.setField(nuevo, 'descripcion', nuevaDesc);
    if (finalHref !== href) nuevo = N.setField(nuevo, 'href', finalHref);

    if (nuevo === entry.text && !extra.length) {
      return N.send(res, 200, { ok: true, mensaje: 'Sin cambios (los valores son iguales).', href });
    }

    const newNav = navSrc.slice(0, entry.start) + nuevo + navSrc.slice(entry.end);
    const commit = await N.commitTree(headSha, headCommit.tree.sha, extra, newNav, 'Biblioteca: editar "' + nuevoTitulo + '"');

    return N.send(res, 200, { ok: true, href: finalHref, hrefAnterior: href, titulo: nuevoTitulo, cliente: nuevoCliente, commit: commit.sha });
  } catch (e) {
    return N.send(res, 502, { ok: false, error: 'Error al guardar: ' + e.message });
  }
};
