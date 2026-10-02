/*
 * Biblioteca de Reportes — Ukelele Growth Company
 * Barra lateral compartida, incluida en index.html y en cada reporte.
 *
 * Para sumar un reporte nuevo: agregá un objeto al array UKE_LIBRARY_REPORTS.
 * Esa es la ÚNICA edición necesaria — todas las páginas que incluyen este
 * script (<script src="library-nav.js"></script>) muestran la lista actualizada,
 * agrupada automáticamente por marca (campo "cliente").
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
      cliente: 'Total Grupo',
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
      cliente: 'Vans Argentina',
      titulo: 'Roadmap de Crecimiento',
      descripcion: 'Plan de acción 2026–2027: iniciativas por trimestre, frente estratégico y estado.',
      href: 'Vans_Roadmap_Crecimiento.html'
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
      cliente: 'The North Face',
      titulo: 'Looker de Performance',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/u/0/reporting/c13847cb-db1a-4d5b-8388-c25d2eb6d428/page/p_lzuzwlqq2d?s=gGdzCq-ttVA',
      externo: true
    },
    {
      cliente: 'The North Face',
      titulo: 'Benchmark Outdoor AR — Beneficios & Bancos',
      descripcion: 'Benchmark competitivo mensual de envío, cuotas y beneficios bancarios entre marcas outdoor.',
      href: 'https://claude.ai/artifact/GhNgxvNocbeWGsfCyyhJQR',
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
    },
    {
      categoria: 'Demografía',
      cliente: 'Cat',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/u/0/reporting/226f1437-861a-4424-ba6e-826f0bc6ccb0/page/qkySF',
      externo: true
    },
    {
      categoria: 'Demografía',
      cliente: 'Merrell',
      titulo: 'Demografía (Looker Studio)',
      descripcion: 'Dashboard externo de Google Looker Studio. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://datastudio.google.com/u/0/reporting/226f1437-861a-4424-ba6e-826f0bc6ccb0/page/p_i3710zfryd',
      externo: true
    },
    {
      cliente: 'Hush Puppies',
      titulo: 'Inversión por Segmento de Audiencia (Meta)',
      descripcion: 'Desglose mensual de inversión, alcance y resultados por segmento de audiencia en Meta Ads.',
      href: 'HushPuppies_Segmentos_Meta.html'
    },
    {
      cliente: 'Hush Puppies',
      titulo: 'Experimentos Pauta',
      descripcion: 'Planilla operativa completa: media plan, proyecciones, control de anuncios, raw data y dashboards. Requiere estar logueada con una cuenta de Google con acceso.',
      href: 'https://docs.google.com/spreadsheets/d/1ppxwdtArPzM4JlhOs4oO_2IL5izHTs21irV9iBtTwOc/edit?gid=142714782#gid=142714782',
      externo: true
    },
    {
      cliente: 'Vans Argentina',
      titulo: 'Agosto 2026',
      descripcion: 'Ecommerce traffic, diagnóstico de tráfico & eficiencia de inversión, y reporte de creatividades de agosto 2026.',
      href: 'Vans_ARG_Agosto2026.html'
    },
    {
      cliente: 'The North Face',
      titulo: 'Reporte de Anuncios — Agosto 2026',
      descripcion: 'Performance y branding de anuncios en Meta Ads y Google Ads.',
      href: 'TNF_Reporte_Anuncios_Agosto2026.html'
    },
    {
      cliente: 'Grimoldi',
      titulo: 'Día de la Madre 2025 — Performance Cross-Brand',
      descripcion: 'Resultados de la campaña de Día de la Madre 2025 en Hush Puppies y Vans: tráfico, conversiones, branding e interacción.',
      href: 'https://docs.google.com/presentation/d/1w70y1U21J--Mq0WMDQMLqoUCgijPwWx0jYkbsU9Lkoo/edit?slide=id.p1#slide=id.p1',
      externo: true
    },
    {
      cliente: 'Grimoldi',
      titulo: 'TikTok Ads — Análisis de Creatividades',
      descripcion: 'Análisis de creatividades en TikTok Ads para las marcas del grupo Grimoldi.',
      href: 'https://docs.google.com/presentation/d/13QH539rpjyye8IkqvPsCpibcAeJt8eSe82P2sBIpT2E/edit?slide=id.p1#slide=id.p1',
      externo: true
    }
  ];

  window.UKE_LIBRARY_REPORTS = UKE_LIBRARY_REPORTS;

  var SIDEBAR_W = 240; // px, expandido
  var COLLAPSE_KEY = 'uke_lib_sidebar_collapsed';
  var OPEN_GROUPS_KEY = 'uke_lib_groups_open';

  var css = ''
    + ':root{--uke-lib-w:' + SIDEBAR_W + 'px;}'
    + '#uke-lib-sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--uke-lib-w);'
    + 'background:#FFFFFF;color:#1A1A1A;z-index:9000;overflow-x:hidden;overflow-y:auto;'
    + 'box-sizing:border-box;transition:width .18s ease;border-right:1px solid #E9E9EC;'
    + 'box-shadow:2px 0 14px rgba(0,0,0,.04);'
    + 'font-family:var(--uke-font-body,\'Lato\',\'Helvetica Neue\',Arial,sans-serif);}'
    + '#uke-lib-sidebar .uke-lib-inner{width:' + SIDEBAR_W + 'px;padding:22px 14px;box-sizing:border-box;}'
    + '#uke-lib-sidebar .uke-lib-brand{font-family:var(--uke-font-display,\'Montserrat\',sans-serif);'
    + 'font-weight:900;font-size:13.5px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:3px;'
    + 'color:var(--uke-rojo,#E30233);}'
    + '#uke-lib-sidebar .uke-lib-sub{font-size:10px;color:#8A8A93;margin-bottom:18px;line-height:1.4;}'
    + '#uke-lib-sidebar .uke-lib-home{display:block;font-size:10.5px;color:#8A8A93;'
    + 'text-decoration:none;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #EDEDF0;}'
    + '#uke-lib-sidebar .uke-lib-home:hover{color:var(--uke-rojo,#E30233);}'
    + '#uke-lib-sidebar .uke-lib-group{border-top:1px solid #EDEDF0;}'
    + '#uke-lib-sidebar .uke-lib-group:first-of-type{border-top:none;}'
    + '#uke-lib-sidebar .uke-lib-group-header{display:flex;align-items:center;justify-content:space-between;'
    + 'width:100%;background:none;border:none;padding:12px 4px;margin:0;cursor:pointer;text-align:left;'
    + 'font-family:var(--uke-font-display,\'Montserrat\',sans-serif);font-weight:800;font-size:11px;'
    + 'text-transform:uppercase;letter-spacing:.05em;color:var(--uke-azul-oscuro,#004E8A);}'
    + '#uke-lib-sidebar .uke-lib-group-header:hover{color:var(--uke-rojo,#E30233);}'
    + '#uke-lib-sidebar .uke-lib-group-header .chev{font-size:9px;color:#B4B4BC;transition:transform .18s ease;'
    + 'flex-shrink:0;margin-left:8px;}'
    + '#uke-lib-sidebar .uke-lib-group.open .uke-lib-group-header .chev{transform:rotate(180deg);'
    + 'color:var(--uke-rojo,#E30233);}'
    + '#uke-lib-sidebar .uke-lib-group-items{max-height:0;overflow:hidden;transition:max-height .22s ease;}'
    + '#uke-lib-sidebar .uke-lib-group.open .uke-lib-group-items{max-height:700px;padding-bottom:8px;}'
    + '#uke-lib-sidebar a.uke-lib-link{display:block;padding:8px 10px;margin-bottom:3px;border-radius:7px;'
    + 'text-decoration:none;color:#333338;border-left:3px solid transparent;font-size:12px;font-weight:700;'
    + 'line-height:1.35;}'
    + '#uke-lib-sidebar a.uke-lib-link:hover{background:#F4F5F7;color:#111;}'
    + '#uke-lib-sidebar a.uke-lib-link.active{background:#FCEAEC;border-left-color:var(--uke-rojo,#E30233);'
    + 'color:#111;}'
    + '#uke-lib-sidebar a.uke-lib-link .ext{opacity:.55;font-weight:400;}'
    + '#uke-lib-toggle{position:fixed;top:14px;left:calc(var(--uke-lib-w) - 1px);width:26px;height:34px;'
    + 'z-index:9001;background:#FFFFFF;color:var(--uke-azul-oscuro,#004E8A);border:1px solid #E9E9EC;'
    + 'border-left:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;'
    + 'line-height:1;border-radius:0 8px 8px 0;box-shadow:2px 2px 8px rgba(0,0,0,.06);transition:left .18s ease;}'
    + '#uke-lib-toggle:hover{color:var(--uke-rojo,#E30233);}'
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

  function getOpenGroups() {
    try { return JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY) || '{}'); } catch (e) { return {}; }
  }
  function setOpenGroups(obj) {
    try { localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(obj)); } catch (e) {}
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

    // Agrupar reportes por marca (cliente), orden alfabético.
    var groups = {};
    var groupOrder = [];
    UKE_LIBRARY_REPORTS.forEach(function (r) {
      if (groups[r.cliente] === undefined) {
        groups[r.cliente] = [];
        groupOrder.push(r.cliente);
      }
      groups[r.cliente].push(r);
    });
    var PINNED_FIRST = ['Total Grupo'];
    groupOrder.sort(function (a, b) {
      var pa = PINNED_FIRST.indexOf(a);
      var pb = PINNED_FIRST.indexOf(b);
      if (pa !== -1 || pb !== -1) {
        if (pa === -1) return 1;
        if (pb === -1) return -1;
        return pa - pb;
      }
      return a.localeCompare(b, 'es');
    });

    var activeGroup = null;
    groupOrder.forEach(function (g) {
      groups[g].forEach(function (r) {
        if (!r.externo && r.href === cur) { activeGroup = g; }
      });
    });

    var openState = getOpenGroups();

    var linksHtml = (cur === 'index.html' || cur === '')
      ? ''
      : '<a class="uke-lib-home" href="index.html">&larr; Biblioteca de Reportes</a>';

    groupOrder.forEach(function (g) {
      var isOpen = (openState[g] !== undefined) ? !!openState[g] : (g === activeGroup);
      linksHtml += '<div class="uke-lib-group' + (isOpen ? ' open' : '') + '" data-group="' + g.replace(/"/g, '&quot;') + '">'
        + '<button type="button" class="uke-lib-group-header">'
        + '<span class="grp-name">' + g + '</span>'
        + '<span class="chev">&#9662;</span>'
        + '</button>'
        + '<div class="uke-lib-group-items">';
      groups[g].forEach(function (r) {
        var activeCls = (!r.externo && r.href === cur) ? ' active' : '';
        var attrs = r.externo ? ' target="_blank" rel="noopener noreferrer"' : '';
        var extMark = r.externo ? ' <span class="ext">&#8599;</span>' : '';
        linksHtml += '<a class="uke-lib-link' + activeCls + '" href="' + r.href + '"' + attrs + '>'
          + '<span class="tit">' + r.titulo + extMark + '</span>'
          + '</a>';
      });
      linksHtml += '</div></div>';
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

    var groupEls = nav.querySelectorAll('.uke-lib-group');
    for (var i = 0; i < groupEls.length; i++) {
      (function (el) {
        var header = el.querySelector('.uke-lib-group-header');
        header.addEventListener('click', function () {
          var nowOpen = !el.classList.contains('open');
          el.classList.toggle('open', nowOpen);
          var state = getOpenGroups();
          state[el.getAttribute('data-group')] = nowOpen;
          setOpenGroups(state);
        });
      })(groupEls[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
