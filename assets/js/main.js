/*
  Grão1000 Site — BI Upgrade (static metrics 2025)
  - Animações suaves (reveal + hover)
  - Métricas estáticas (sem atualização ao vivo)
  - Gráficos (Chart.js)
  - Mapa de orientação (pinos por UF)
*/

(() => {
  "use strict";

  // ============================
  // Dados (Relatório 2025)
  // ============================
  const HOME_METRICS = {
    totals: {
      tons_total: 23118878.84,
      cargas_total: 1138482,
      pontos_embarque: 6357,
      colaboradores: 609,
      cidades: 1023
    },
    monthly: [
      { ym: "2025-01", tons: 1264812.27 },
      { ym: "2025-02", tons: 2228203.66 },
      { ym: "2025-03", tons: 2774764.49 },
      { ym: "2025-04", tons: 2051034.75 },
      { ym: "2025-05", tons: 2054132.34 },
      { ym: "2025-06", tons: 1932512.92 },
      { ym: "2025-07", tons: 2024569.23 },
      { ym: "2025-08", tons: 2007829.02 },
      { ym: "2025-09", tons: 1946785.79 },
      { ym: "2025-10", tons: 1808925.42 },
      { ym: "2025-11", tons: 1692115.6 },
      { ym: "2025-12", tons: 1333193.36 }
    ],
    byCoord: [
      { name: "Goiás", tons: 3947867.26 },
      { name: "Cascavel", tons: 2412531.8 },
      { name: "Rio Grande do Sul", tons: 2081055.04 },
      { name: "Maringá & Terminais", tons: 1764181.48 },
      { name: "Mato Grosso MT2", tons: 1583411.5 },
      { name: "São Paulo", tons: 1567867.23 },
      { name: "Londrina", tons: 1486311.16 },
      { name: "Mato Grosso MT1", tons: 1427048.39 },
      { name: "MT3 — Confresa", tons: 1335746.78 },
      { name: "Ponta Grossa", tons: 1196140.88 }
    ],
    topCities: [
      { name: "Querência (MT)", tons: 617738.42 },
      { name: "Maringá (PR)", tons: 418787.41 },
      { name: "São Félix do Araguaia (MT)", tons: 414468.6 },
      { name: "Marialva (PR)", tons: 397621.39 },
      { name: "Primavera do Leste (MT)", tons: 383405.93 },
      { name: "Rio Verde (GO)", tons: 375379.48 },
      { name: "Jataí (GO)", tons: 313869.01 },
      { name: "Montividiu (GO)", tons: 307734.66 },
      { name: "São José do Xingu (MT)", tons: 262245.9 },
      { name: "Cruz Alta (RS)", tons: 214715.21 }
    ]
  };

  // Gestor por estado (estrutura pronta).
  // Obs: se você me mandar uma lista oficial UF->Gestor, eu plugo aqui.
  const GESTORES_POR_UF = {
    PR: [{ nome: "Equipe Regional PR", cargo: "Gestão Operacional" }],
    RS: [{ nome: "Equipe Regional RS", cargo: "Gestão Operacional" }],
    SC: [{ nome: "Equipe Regional SC", cargo: "Gestão Operacional" }],
    MS: [{ nome: "Equipe Regional MS", cargo: "Gestão Operacional" }],
    MT: [{ nome: "Equipe Regional MT", cargo: "Gestão Operacional" }],
    GO: [{ nome: "Equipe Regional GO", cargo: "Gestão Operacional" }],
    SP: [{ nome: "Equipe Regional SP", cargo: "Gestão Operacional" }],
    MA: [{ nome: "Equipe Regional MA", cargo: "Gestão Operacional" }],
    PI: [{ nome: "Equipe Regional PI", cargo: "Gestão Operacional" }],
    TO: [{ nome: "Equipe Regional TO", cargo: "Gestão Operacional" }]
  };

  // Coordenadas (aproximadas) para pinos no SVG (0..100)
  const UF_PINS = {
    AC: { x: 13, y: 34 },
    AL: { x: 79, y: 47 },
    AM: { x: 27, y: 28 },
    AP: { x: 56, y: 15 },
    BA: { x: 73, y: 52 },
    CE: { x: 83, y: 38 },
    DF: { x: 60, y: 60 },
    ES: { x: 79, y: 66 },
    GO: { x: 58, y: 61 },
    MA: { x: 71, y: 33 },
    MG: { x: 69, y: 68 },
    MS: { x: 49, y: 69 },
    MT: { x: 45, y: 52 },
    PA: { x: 54, y: 26 },
    PB: { x: 87, y: 40 },
    PE: { x: 85, y: 43 },
    PI: { x: 76, y: 36 },
    PR: { x: 59, y: 79 },
    RJ: { x: 77, y: 72 },
    RN: { x: 89, y: 37 },
    RO: { x: 22, y: 44 },
    RR: { x: 33, y: 14 },
    RS: { x: 56, y: 92 },
    SC: { x: 61, y: 86 },
    SE: { x: 80, y: 46 },
    SP: { x: 67, y: 76 },
    TO: { x: 60, y: 45 }
  };

  // ============================
  // Utils
  // ============================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function fmtNum(n, opts = {}) {
    try {
      if (n == null || Number.isNaN(Number(n))) return "–";
      return new Intl.NumberFormat("pt-BR", opts).format(n);
    } catch {
      return String(n ?? "–");
    }
  }

  function fmtMonthPt(ym) {
    const [y, m] = (ym || "").split("-").map((x) => parseInt(x, 10));
    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const mm = months[(m || 1) - 1] || ym;
    return `${mm}/${String(y || "").slice(-2)}`;
  }

  // ============================
  // Motion (reveal)
  // ============================
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 240)}ms`);
      io.observe(el);
    });
  }

  // ============================
  // Metrics + Charts
  // ============================
  function fillTotals() {
    $$('[data-metric="tons_total"]').forEach((el) => (el.textContent = fmtNum(HOME_METRICS.totals.tons_total, { maximumFractionDigits: 0 })));
    $$('[data-metric="cargas_total"]').forEach((el) => (el.textContent = fmtNum(HOME_METRICS.totals.cargas_total, { maximumFractionDigits: 0 })));
    $$('[data-metric="pontos_embarque"]').forEach((el) => (el.textContent = fmtNum(HOME_METRICS.totals.pontos_embarque, { maximumFractionDigits: 0 })));
    $$('[data-metric="colaboradores"]').forEach((el) => (el.textContent = fmtNum(HOME_METRICS.totals.colaboradores, { maximumFractionDigits: 0 })));
  }

  function buildCharts() {
    if (!window.Chart) return;

    const monthLabels = HOME_METRICS.monthly.map((d) => fmtMonthPt(d.ym));
    const monthValues = HOME_METRICS.monthly.map((d) => d.tons);

    // Volume por mês (area/linha)
    const cvMonth = $('#chartMonthly') || $('#chartMonth');
    if (cvMonth) {
      new Chart(cvMonth, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Toneladas',
              data: monthValues,
              tension: 0.35,
              fill: true,
              pointRadius: 0,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${fmtNum(ctx.parsed.y, { maximumFractionDigits: 0 })} t`
              }
            }
          },
          scales: {
            x: {
              ticks: { maxRotation: 0, autoSkip: true }
            },
            y: {
              ticks: {
                callback: (v) => fmtNum(v, { maximumFractionDigits: 0 })
              }
            }
          }
        }
      });
    }

    // Top coordenações (barra horizontal)
    const cvCoord = $('#chartCoord');
    if (cvCoord) {
      const labels = HOME_METRICS.byCoord.map((d) => d.name);
      const values = HOME_METRICS.byCoord.map((d) => d.tons);

      new Chart(cvCoord, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Toneladas', data: values, borderWidth: 0, borderRadius: 10 }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${fmtNum(ctx.parsed.x, { maximumFractionDigits: 0 })} t`
              }
            }
          },
          scales: {
            x: {
              ticks: {
                callback: (v) => fmtNum(v, { maximumFractionDigits: 0 })
              }
            },
            y: {
              ticks: { autoSkip: false }
            }
          }
        }
      });
    }

    // Top cidades (barra horizontal) — sem ranking por cliente.
    const cvCity = $('#chartCities');
    if (cvCity) {
      const labels = HOME_METRICS.topCities.map((d) => d.name);
      const values = HOME_METRICS.topCities.map((d) => d.tons);

      new Chart(cvCity, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Toneladas', data: values, borderWidth: 0, borderRadius: 10 }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${fmtNum(ctx.parsed.x, { maximumFractionDigits: 0 })} t`
              }
            }
          },
          scales: {
            x: {
              ticks: {
                callback: (v) => fmtNum(v, { maximumFractionDigits: 0 })
              }
            },
            y: {
              ticks: { autoSkip: false }
            }
          }
        }
      });
    }
  }

  // ============================
  // Map (SVG)
  // ============================
  function renderStateMap() {
    const host = $('#stateMap');
    if (!host) return;

    // Um outline estilizado do Brasil (simplificado) + pinos.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'brMap');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Mapa do Brasil com pinos por estado');

    const outline = document.createElementNS(svg.namespaceURI, 'path');
    outline.setAttribute(
      'd',
      'M28,14 L35,10 L48,12 L56,18 L64,18 L71,25 L84,33 L88,41 L86,50 L81,56 L79,66 L72,72 L71,79 L66,86 L60,92 L55,95 L49,91 L45,88 L42,83 L34,78 L30,70 L22,62 L18,52 L14,41 L18,32 L24,24 Z'
    );
    outline.setAttribute('class', 'brOutline');
    svg.appendChild(outline);

    // Pinos
    Object.entries(UF_PINS).forEach(([uf, p]) => {
      const g = document.createElementNS(svg.namespaceURI, 'g');
      g.setAttribute('class', 'pin');
      g.setAttribute('data-uf', uf);

      const c = document.createElementNS(svg.namespaceURI, 'circle');
      c.setAttribute('cx', String(p.x));
      c.setAttribute('cy', String(p.y));
      c.setAttribute('r', '1.35');
      c.setAttribute('class', 'pinDot');

      const halo = document.createElementNS(svg.namespaceURI, 'circle');
      halo.setAttribute('cx', String(p.x));
      halo.setAttribute('cy', String(p.y));
      halo.setAttribute('r', '3.2');
      halo.setAttribute('class', 'pinHalo');

      g.appendChild(halo);
      g.appendChild(c);
      g.addEventListener('click', () => selectUF(uf));
      g.addEventListener('mouseenter', () => host.classList.add('is-hovering'));
      g.addEventListener('mouseleave', () => host.classList.remove('is-hovering'));
      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  function selectUF(uf) {
    const titleEl = $('#stateTitle');
    const metaEl = $('#stateMeta');
    const cardsEl = $('#stateCards');

    if (!titleEl || !cardsEl) return;

    const list = GESTORES_POR_UF[uf] || [];

    titleEl.textContent = uf ? `Estado: ${uf}` : 'Selecione um estado';
    if (metaEl) metaEl.textContent = list.length ? `${list.length} responsável(is)` : 'Sem cadastro';

    if (!list.length) {
      cardsEl.innerHTML = `
        <div class="stateEmpty">
          <b>Sem cadastro local</b>
          <p class="muted">Clique em outro estado ou use o formulário de contato.</p>
        </div>`;
      return;
    }

    cardsEl.innerHTML = list
      .map((p) => {
        const nome = escapeHtml(p.nome);
        const cargo = escapeHtml(p.cargo || '');
        return `
          <div class="stateCard">
            <div class="avatar">${nome.slice(0, 1).toUpperCase()}</div>
            <div class="meta">
              <div class="name">${nome}</div>
              <div class="role">${cargo}</div>
            </div>
          </div>`;
      })
      .join('');
  }

  function escapeHtml(s) {(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  

// ============================
// Navbar (mobile + active link)
// ============================
function initNav() {
  const btn = document.querySelector('[data-hamburger]');
  const mobile = document.querySelector('[data-mobile]');
  if (btn && mobile) {
    const close = () => {
      mobile.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };
    btn.addEventListener('click', () => {
      const isOpen = mobile.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
    // Fecha ao clicar em um item
    mobile.querySelectorAll('a[data-nav]').forEach((a) => a.addEventListener('click', close));
    // Fecha ao clicar fora (mobile)
    document.addEventListener('click', (ev) => {
      if (!mobile.classList.contains('open')) return;
      const t = ev.target;
      if (t === btn || btn.contains(t) || mobile.contains(t)) return;
      close();
    });
  }

  // Link ativo
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href && href === path) a.classList.add('active');
  });
}

// ============================
// Facebook feed (com fallback)
// ============================
async function initFacebookFeed() {
  const host = document.getElementById('fbPosts');
  if (!host) return;

  const endpoint = (window.G1000_FB_FEED_ENDPOINT || '').trim();

  const render = (items) => {
    host.innerHTML = items
      .slice(0, 5)
      .map((p) => {
        const img = escapeHtml(p.image || '');
        const title = escapeHtml(p.title || 'Facebook');
        const text = escapeHtml(p.text || '');
        const url = escapeHtml(p.url || 'https://www.facebook.com/grao1000');
        const date = p.date ? `<div class="fbDate">${escapeHtml(p.date)}</div>` : '';
        return `
          <a class="fbCard" href="${url}" target="_blank" rel="noopener">
            <div class="fbImg" style="background-image:url('${img}')"></div>
            <div class="fbBody">
              ${date}
              <div class="fbTitle">${title}</div>
              <div class="fbText">${text}</div>
            </div>
          </a>`;
      })
      .join('');
  };

  // Fallback local (não quebra o layout)
  const localFallback = () =>
    render([
      { image: 'assets/img/posts/post-1.webp', title: 'Grão 1000', text: 'Acompanhe nossas atualizações no Facebook.', url: 'https://www.facebook.com/grao1000' },
      { image: 'assets/img/posts/post-2.webp', title: 'Grão 1000', text: 'Qualidade e rastreabilidade com padrão.', url: 'https://www.facebook.com/grao1000' },
      { image: 'assets/img/posts/post-3.webp', title: 'Grão 1000', text: 'Equipe e supervisão em campo.', url: 'https://www.facebook.com/grao1000' },
      { image: 'assets/img/posts/post-4.webp', title: 'Grão 1000', text: 'Agilidade em períodos críticos.', url: 'https://www.facebook.com/grao1000' },
      { image: 'assets/img/posts/post-5.webp', title: 'Grão 1000', text: 'Atendimento Brasil.', url: 'https://www.facebook.com/grao1000' }
    ]);

  if (!endpoint) {
    localFallback();
    return;
  }

  try {
    const res = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Esperado: array de posts (id, message/text, full_picture/image, permalink_url/url, created_time/date)
    const items = (Array.isArray(data) ? data : data.items || []).map((p) => ({
      image: p.full_picture || p.image || '',
      title: 'Facebook',
      text: (p.message || p.text || '').slice(0, 140),
      url: p.permalink_url || p.url || 'https://www.facebook.com/grao1000',
      date: p.created_time ? new Date(p.created_time).toLocaleDateString('pt-BR') : ''
    }));
    if (!items.length) throw new Error('empty');
    render(items);
  } catch (e) {
    localFallback();
  }
}

// ============================
// Contato (fallback WhatsApp)
// ============================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const hint = document.getElementById('formHint');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const fd = new FormData(form);
    const nome = (fd.get('nome') || '').toString().trim();
    const local = (fd.get('local') || '').toString().trim();
    const cultura = (fd.get('cultura') || '').toString().trim();
    const periodo = (fd.get('periodo') || '').toString().trim();
    const msg = (fd.get('mensagem') || '').toString().trim();

    const parts = [
      'Olá! Quero um atendimento com a Grão 1000.',
      nome ? `Nome: ${nome}` : null,
      local ? `Cidade/UF: ${local}` : null,
      cultura ? `Cultura: ${cultura}` : null,
      periodo ? `Período: ${periodo}` : null,
      msg ? `Mensagem: ${msg}` : null
    ].filter(Boolean);

    const text = encodeURIComponent(parts.join('\n'));
    const url = `https://wa.me/5545983410000?text=${text}`;

    if (hint) {
      hint.textContent = 'Abrindo o WhatsApp…';
      setTimeout(() => (hint.textContent = 'Ao enviar, abrimos o WhatsApp com a mensagem pronta.'), 1800);
    }

    window.open(url, '_blank', 'noopener');
  });
}

// ============================
  // Init
  // ============================
  function init() {
    initNav();
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
    fillTotals();
    renderStateMap();
    buildCharts();
    initFacebookFeed();
    initContactForm();
    initReveal();

    // seleção inicial (se quiser deixar PR como padrão, troque para 'PR')
    selectUF('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
