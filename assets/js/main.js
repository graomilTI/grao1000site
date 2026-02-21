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
    const cvMonth = $('#chartMonth');
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
    const panel = $('#stateDetail');
    if (!panel) return;

    const list = GESTORES_POR_UF[uf] || [];
    const badge = `<span class="pill">${uf}</span>`;

    if (!list.length) {
      panel.innerHTML = `${badge}<h3 class="stateTitle">Sem cadastro local</h3><p class="muted">Clique em outro estado ou use o formulário de contato.</p>`;
      return;
    }

    panel.innerHTML = [
      `${badge}<h3 class="stateTitle">Gestor por Estado</h3>`,
      `<div class="statePeople">`,
      ...list.map(
        (p) =>
          `<div class="personRow"><div class="personAvatar">G</div><div class="personMeta"><div class="personName">${escapeHtml(p.nome)}</div><div class="personRole">${escapeHtml(p.cargo || '')}</div></div></div>`
      ),
      `</div>`
    ].join('');
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // ============================
  // Init
  // ============================
  function init() {
    fillTotals();
    renderStateMap();
    buildCharts();
    initReveal();

    // UX: click hint
    const hint = $('#stateHint');
    if (hint) hint.textContent = 'Clique em um pino para ver responsáveis';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
