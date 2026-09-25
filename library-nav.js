/*
 * Biblioteca de Reportes — Ukelele Growth Company
 * Barra lateral compartida, incluida en index.html y en cada reporte.
 *
 * Para sumar un reporte nuevo: agregá un objeto al array UKE_LIBRARY_REPORTS.
 * Esa es la ÚNICA edición necesaria — todas las páginas que incluyen este
 * script (<script src="library-nav.js"></script>) muestran la lista actualizada.
 */
(function () {
  var UKE_LIBRARY_REPORTS = [
    {
      cliente: 'Vans Argentina',
      titulo: 'Resumen de Crecimiento YTD 2026',
      descripcion: 'Sesiones, pedidos, canales, RFM, recurrencia y compradores por categoría.',
      href: 'Vans_Resumen_Crecimiento_YTD2026.html'
    },
    {
      cliente: 'Grimoldi',
      titulo: 'Histórico Web Grimoldi',
      descripcion: 'Facturación y pares, objetivo vs. logrado por marca. Histórico, Cuotas y Acciones comerciales.',
      href: 'historico_web_grimoldi.html'
    },
    {
      cliente: 'Vans Argentina',
      titulo: 'Base & Comunicación',
      descripcion: 'Tamaño de base de contactos, opt-ins y canales de comunicación.',
      href: 'Base_Comunicacion_VANS_Argentina.html'
    },
    {
      cliente: 'Vans Uruguay',
      titulo: 'Dashboard Ecommerce',
      descripcion: 'Ventas, productos y BLM de Vans Uruguay. Datos en vivo desde Google Sheets (con fallback embebido).',
      href: 'BLM_Vans_UY.html'
    },
    {
      cliente: 'Hush Puppies',
      titulo: 'NPS — Presentación',
      descripcion: 'Presentación de Google Slides con los resultados de NPS. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://docs.google.com/presentation/d/137rp5JazG2pJqUKzqPnyylG9d1E-VBbnMkfQxQENhzw/edit?slide=id.p4#slide=id.p4',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'Vans Argentina',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/reporting/38ac95aa-e0ff-4fc7-8d9e-6c68613e6abd/page/eYj8F',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'Vans Uruguay',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/reporting/38ac95aa-e0ff-4fc7-8d9e-6c68613e6abd/page/p_1c5cawkc7d',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'The North Face',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/reporting/b0ae7797-fbe5-4ceb-a238-c3e665eee98f/page/p_53hi760b4d',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'Grimoldi',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/reporting/5a449d54-3669-4c74-b1bf-4412c0fee505/page/p_dr8sgfy5sd',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'Hush Puppies',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/reporting/f86ff6ed-2bc0-4a2e-86cb-1c8e04c73a30/page/p_dr8sgfy5sd',
      externo: true
    }
  ];

  window.UKE_LIBRARY_REPORTS = UKE_LIBRARY_REPORTS;

  var SIDEBAR_W = 230; // px, expandido
  var COLLAPSE_KEY = 'uke_lib_sidebar_collapsed';

  var css = ''
    + ':root{--uke-lib-w:' + SIDEBAR_W + 'px;}'
    + '#uke-lib-sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--uke-lib-w);'
    + 'background:var(--uke-azul-oscuro,#004E8A);color:#fff;z-index:9000;overflow-x:hidden;overflow-y:auto;'
    + 'box-sizing:border-box;transition:width .18s ease;'
    + 'font-family:var(--uke-font-body,\'Lato\',\'Helvetica Neue\',Arial,sans-serif);}'
    + '#uke-lib-sidebar .uke-lib-inner{width:' + SIDEBAR_W + 'px;padding:22px 16px;box-sizing:border-box;}'
    + '#uke-lib-sidebar .uke-lib-brand{font-family:var(--uke-font-display,\'Montserrat\',sans-serif);'
    + 'font-weight:900;font-size:13.5px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:3px;color:#fff;}'
    + '#uke-lib-sidebar .uke-lib-sub{font-size:10px;opacity:.7;margin-bottom:22px;line-height:1.4;}'
    + '#uke-lib-sidebar .uke-lib-home{display:block;font-size:10.5px;color:rgba(255,255,255,.6);'
    + 'text-decoration:none;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.15);}'
    + '#uke-lib-sidebar .uke-lib-home:hover{color:#fff;}'
    + '#uke-lib-sidebar a.uke-lib-link{display:block;padding:10px 10px;margin-bottom:6px;border-radius:8px;'
    + 'text-decoration:none;color:rgba(255,255,255,.85);border-left:3px solid transparent;}'
    + '#uke-lib-sidebar a.uke-lib-link:hover{background:rgba(255,255,255,.08);}'
    + '#uke-lib-sidebar a.uke-lib-link.active{background:rgba(255,255,255,.14);border-left-color:var(--uke-rojo,#E30233);color:#fff;}'
    + '#uke-lib-sidebar a.uke-lib-link .cli{display:block;font-family:var(--uke-font-display,\'Montserrat\',sans-serif);'
    + 'font-weight:800;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;opacity:.65;margin-bottom:2px;}'
    + '#uke-lib-sidebar a.uke-lib-link .tit{display:block;font-size:12px;font-weight:700;line-height:1.3;}'
    + '#uke-lib-sidebar a.uke-lib-link .ext{opacity:.6;font-weight:400;}'
    + '#uke-lib-sidebar .uke-lib-cat{font-family:var(--uke-font-display,\'Montserrat\',sans-serif);'
    + 'font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;opacity:.55;'
    + 'margin:18px 0 8px;padding-top:12px;border-top:1px solid rgba(255,255,255,.15);}'
    + '#uke-lib-sidebar .uke-lib-cat:first-child{margin-top:0;padding-top:0;border-top:none;}'
    + '#uke-lib-sidebar .uke-lib-sep{margin:14px 0 10px;border-top:1px solid rgba(255,255,255,.15);}'
    + '#uke-lib-sidebar .uke-lib-sep:first-child{display:none;}'
    + '#uke-lib-toggle{position:fixed;top:14px;left:calc(var(--uke-lib-w) - 1px);width:26px;height:34px;'
    + 'z-index:9001;background:var(--uke-azul-oscuro,#004E8A);color:#fff;border:none;border-radius:0 8px 8px 0;'
    + 'cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;line-height:1;'
    + 'box-shadow:2px 2px 8px rgba(0,0,0,.15);transition:left .18s ease;}'
    + '#uke-lib-toggle:hover{background:var(--uke-azul-medio,#1689C0);}'
    + 'body{margin-left:var(--uke-lib-w) !important;transition:margin-left .18s ease;}'
    + '.sidebar{left:var(--uke-lib-w) !important;transition:left .18s ease;}'
    + '.main{margin-left:calc(var(--sidebar-w,0px) + var(--uke-lib-w)) !important;transition:margin-left .18s ease;}'
    + '.comp-filter-bar{left:calc(var(--sidebar-w,0px) + var(--uke-lib-w)) !important;transition:left .18s ease;}';

  function currentFile() {
    var path = window.location.pathname;
    var parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function getCollapsed() {
    try { return localStorage.getItem(COLLAPSE_KEY) === '1'; } catch (e) { return false; }
  }
  function setCollapsed(val) {
    try { localStorage.setItem(COLLAPSE_KEY, val ? '1' : '0'); } catch (e) {}
  }

  function applyCollapsed(collapsed, sidebarEl, toggleBtn) {
    document.documentElement.style.setProperty('--uke-lib-w', collapsed ? '0px' : SIDEBAR_W + 'px');
    sidebarEl.classList.toggle('uke-lib-collapsed', collapsed);
    toggleBtn.textContent = collapsed ? '›' : '‹'; // › / ‹
    toggleBtn.setAttribute('aria-label', collapsed ? 'Mostrar biblioteca' : 'Ocultar biblioteca');
  }

  function init() {
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var cur = currentFile();
    var nav = document.createElement('div');
    nav.id = 'uke-lib-sidebar';

    var linksHtml = (cur === 'index.html' || cur === '')
      ? ''
      : '<a class="uke-lib-home" href="index.html">&larr; Biblioteca de Reportes</a>';

    var lastCat = null;
    UKE_LIBRARY_REPORTS.forEach(function (r) {
      var cat = r.categoria || null;
      if (cat !== lastCat) {
        if (cat) { linksHtml += '<div class="uke-lib-cat">' + cat + '</div>'; }
        else { linksHtml += '<div class="uke-lib-sep"></div>'; }
        lastCat = cat;
      }
      var activeCls = (!r.externo && r.href === cur) ? ' active' : '';
      var attrs = r.externo ? ' target="_blank" rel="noopener noreferrer"' : '';
      var extMark = r.externo ? ' <span class="ext">&#8599;</span>' : '';
      linksHtml += '<a class="uke-lib-link' + activeCls + '" href="' + r.href + '"' + attrs + '>'
        + '<span class="cli">' + r.cliente + '</span>'
        + '<span class="tit">' + r.titulo + extMark + '</span>'
        + '</a>';
    });

    nav.innerHTML = '<div class="uke-lib-inner">'
      + '<div class="uke-lib-brand">Biblioteca Uke</div>'
      + '<div class="uke-lib-sub">Reportes de todas las cuentas</div>'
      + linksHtml
      + '</div>';

    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'uke-lib-toggle';
    toggleBtn.type = 'button';

    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(toggleBtn, nav.nextSibling);

    var collapsed = getCollapsed();
    applyCollapsed(collapsed, nav, toggleBtn);

    toggleBtn.addEventListener('click', function () {
      collapsed = !collapsed;
      applyCollapsed(collapsed, nav, toggleBtn);
      setCollapsed(collapsed);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
