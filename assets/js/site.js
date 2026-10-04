/* =========================================================================
   Site runtime. Reads window.PORTFOLIO (assets/js/data.js).
   Page type is set on <body>: data-page="home" | "project" | "404",
   data-root="" (site root) or "../" (pages inside /projects/),
   data-slug="<project slug>" on project pages.
   ========================================================================= */
(function () {
  "use strict";

  const P = window.PORTFOLIO;
  const body = document.body;
  const root = body.dataset.root || "";
  const pageType = body.dataset.page || "";
  const slug = body.dataset.slug || "";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catById = (id) => P.categories.find((c) => c.id === id) || { title: id, id };
  const catIndex = (id) => P.categories.findIndex((c) => c.id === id);
  const bySlug = (s) => P.projects.find((p) => p.slug === s);
  const projHref = (p) => `${root}projects/${p.slug}.html`;
  const full = (src) => src.replace(/-sm\.webp$/, ".webp");
  const pad = (n) => String(n).padStart(2, "0");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ROLE_MARK = { solo: "Solo design", lead: "Lead designer", co: "Two-person project", team: "Team project" };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return d ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`;
  };

  const ICONS = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>',
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
  };

  /* ---------------- Theme ---------------- */
  function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintToggle(btn) {
    const t = currentTheme();
    btn.innerHTML = t === "dark" ? ICONS.sun : ICONS.moon;
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  /* ---------------- Header / footer ---------------- */
  function injectChrome() {
    const home = pageType === "home";
    const h = (hash) => (home ? hash : `${root}index.html${hash}`);
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${root}index.html" aria-label="${esc(P.person.name)}, home">
          <span class="brand-mark" aria-hidden="true">${esc(P.person.initials)}</span>
          <span class="brand-name">${esc(P.person.name)}</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <a href="${h("#work")}">Work</a>
          <a href="${h("#about")}">About</a>
          <a href="${h("#contact")}">Contact</a>
          <button class="theme-toggle" type="button"></button>
        </nav>
      </div>`;
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    body.prepend(header);
    body.prepend(skip);

    const btn = $(".theme-toggle", header);
    paintToggle(btn);
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      paintToggle(btn);
    });

    const latest = allUpdates()[0];
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <span>© ${new Date().getFullYear()} ${esc(P.person.name)}</span>
        <span class="mono">${latest ? "Last revision " + esc(fmtDate(latest.date)) : ""}</span>
      </div>`;
    body.append(footer);
  }

  /* ---------------- Shared helpers ---------------- */
  function allUpdates() {
    const out = [];
    P.projects.forEach((p) => (p.updates || []).forEach((u) => out.push({ ...u, project: p })));
    return out.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function imgTag(src, alt, sizes, extra = "") {
    return `<img src="${root}${esc(src)}" srcset="${root}${esc(src)} 900w, ${root}${esc(full(src))} 2000w" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
  }

  function metaStrip(p) {
    return `<div class="meta"><span>${esc(p.season)}</span><span class="sep"></span><span class="role" data-own="${esc(p.own)}">${esc(ROLE_MARK[p.own] || "")}</span></div>`;
  }

  function cardHTML(p, opts = {}) {
    const span = p.scale === "flagship" && !opts.noSpan ? " span-2" : "";
    const sizes = span ? "(max-width: 640px) 100vw, 60vw" : "(max-width: 640px) 100vw, 30vw";
    return `
      <a class="card${span}" href="${projHref(p)}" data-slug="${esc(p.slug)}">
        <div class="card-media">
          ${imgTag(p.cover, p.title, sizes)}
          ${p.video ? `<span class="media-badge">${ICONS.play} Video</span>` : ""}
          <span class="dwg-badge">DWG ${esc(p.dwg)}</span>
        </div>
        <div class="card-body">
          ${metaStrip(p)}
          <h4>${esc(p.title)}</h4>
          <p>${esc(p.summary)}</p>
          <ul class="tags">${(p.tags || []).slice(0, 4).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          ${span ? `<span class="card-cta">${esc(p.role)} · Full write-up →</span>` : ""}
        </div>
        <span class="go">${ICONS.arrow}</span>
      </a>`;
  }

  /* ---------------- Video clips ---------------- */
  function setupClips(scope = document) {
    const vids = $$("video.clip", scope).filter((v) => !v.dataset.ready);
    if (!vids.length) return;
    vids.forEach((v) => {
      v.dataset.ready = "1";
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("muted", "");
      // Pause / play control (WCAG 2.2.2)
      let host = v.parentElement;
      if (!host.classList.contains("clip-wrap") && !host.classList.contains("feature-media")) {
        const w = document.createElement("div");
        w.className = "clip-wrap";
        v.replaceWith(w);
        w.append(v);
        host = w;
      }
      const b = document.createElement("button");
      b.type = "button";
      b.className = "clip-toggle";
      const paint = () => {
        const playing = !v.paused;
        b.innerHTML = playing ? ICONS.pause : ICONS.play;
        b.setAttribute("aria-label", playing ? "Pause video" : "Play video");
      };
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        if (v.paused) { delete v.dataset.userPaused; v.play().catch(() => {}); }
        else { v.dataset.userPaused = "1"; v.pause(); }
      });
      v.addEventListener("play", paint);
      v.addEventListener("pause", paint);
      host.append(b);
      paint();
      if (reduceMotion) {
        v.dataset.userPaused = "1";
        if (v.dataset.src) { v.preload = "metadata"; }
      }
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      if (!("IntersectionObserver" in window)) vids.forEach((v) => { if (v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src;
          if (!v.dataset.userPaused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.2, rootMargin: "120px 0px" });
    vids.forEach((v) => io.observe(v));
  }

  /* ---------------- Lightbox ---------------- */
  function setupLightbox() {
    const imgs = $$("main .fig img, main [data-zoom]").filter((i) => i.tagName === "IMG");
    if (!imgs.length || typeof HTMLDialogElement === "undefined") return;
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Image viewer");
    dlg.innerHTML = `
      <div class="lightbox-inner">
        <img alt="">
        <p class="lightbox-cap"></p>
        <button class="lb-btn lb-close" type="button" aria-label="Close">✕</button>
        <button class="lb-btn lb-prev" type="button" aria-label="Previous image">‹</button>
        <button class="lb-btn lb-next" type="button" aria-label="Next image">›</button>
      </div>`;
    body.append(dlg);
    const big = $("img", dlg), cap = $(".lightbox-cap", dlg);
    let idx = 0;
    const show = (i) => {
      idx = (i + imgs.length) % imgs.length;
      const im = imgs[idx];
      big.src = im.dataset.full || full(im.getAttribute("src"));
      big.alt = im.alt;
      const fc = im.closest("figure") && im.closest("figure").querySelector("figcaption");
      cap.textContent = fc ? fc.textContent.trim() : im.alt;
    };
    imgs.forEach((im, i) => {
      im.setAttribute("data-zoom", "");
      im.tabIndex = 0;
      im.setAttribute("role", "button");
      im.setAttribute("aria-label", `Enlarge image: ${im.alt}`);
      const open = () => { show(i); dlg.showModal(); };
      im.addEventListener("click", open);
      im.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    $(".lb-close", dlg).addEventListener("click", () => dlg.close());
    $(".lb-prev", dlg).addEventListener("click", () => show(idx - 1));
    $(".lb-next", dlg).addEventListener("click", () => show(idx + 1));
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.classList.contains("lightbox-inner")) dlg.close(); });
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------------- Reveal ---------------- */
  function setupReveal(els) {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  /* =======================================================================
     HOME
     ======================================================================= */
  function renderHome() {
    // Stats
    $$("[data-stat='projects']").forEach((el) => (el.textContent = P.projects.length));

    // Balloons ↔ parts list
    $$(".balloon").forEach((b) => {
      const row = $(`.parts-list tr[data-item='${b.dataset.item}']`);
      const on = () => { b.classList.add("is-active"); row && row.classList.add("is-active"); };
      const off = () => { b.classList.remove("is-active"); row && row.classList.remove("is-active"); };
      b.addEventListener("mouseenter", on); b.addEventListener("mouseleave", off);
      b.addEventListener("focus", on); b.addEventListener("blur", off);
      if (row) { row.addEventListener("mouseenter", on); row.addEventListener("mouseleave", off); }
    });

    // Featured
    const fg = $("#featured-grid");
    if (fg) {
      fg.innerHTML = P.projects.filter((p) => p.featured).map((p) => {
        const media = p.featureMedia
          ? `<video class="clip" data-src="${root}${esc(p.featureMedia)}" poster="${root}${esc(p.featurePoster || "")}" preload="none" muted loop playsinline aria-label="${esc(p.title)} video"></video>`
          : imgTag(p.cover, p.title, "(max-width: 760px) 100vw, 50vw");
        return `
          <article class="feature">
            <div class="feature-media">${media}<span class="dwg-badge">DWG ${esc(p.dwg)}</span></div>
            <div class="feature-body">
              ${metaStrip(p)}
              <h3><a class="stretched" href="${projHref(p)}">${esc(p.title)}</a></h3>
              <p>${esc(p.summary)}</p>
              <p class="mono" style="font-size:.74rem;color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em">${esc(catById(p.category).title)} — ${esc(p.role)}</p>
            </div>
          </article>`;
      }).join("");
      setupClips(fg);
      setupReveal($$(".feature", fg));
    }

    // Work: toolbar + views
    const work = $("#work-body");
    const chips = $("#skill-chips");
    const seg = $$("#view-toggle button");
    const state = { view: "category", skill: "all" };
    try { const v = sessionStorage.getItem("view"); if (v === "timeline" || v === "category") state.view = v; } catch (e) { /* ignore */ }

    if (chips) {
      const count = (id) => P.projects.filter((p) => (p.skills || []).includes(id)).length;
      chips.innerHTML = `<span class="chips-label">Filter</span>` +
        `<button class="chip" type="button" data-skill="all" aria-pressed="true">All<span class="count">${P.projects.length}</span></button>` +
        P.skills.map((s) => `<button class="chip" type="button" data-skill="${esc(s.id)}" aria-pressed="false">${esc(s.label)}<span class="count">${count(s.id)}</span></button>`).join("");
      chips.addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        state.skill = b.dataset.skill;
        $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        draw();
      });
    }
    seg.forEach((b) => b.addEventListener("click", () => {
      state.view = b.dataset.view;
      try { sessionStorage.setItem("view", state.view); } catch (e) { /* ignore */ }
      draw();
    }));

    function visible(p) { return state.skill === "all" || (p.skills || []).includes(state.skill); }

    function drawCategories() {
      const blocks = P.categories.map((c, i) => {
        const items = P.projects.filter((p) => p.category === c.id && visible(p));
        if (!items.length) return "";
        const total = P.projects.filter((p) => p.category === c.id).length;
        return `
          <section class="cat" id="cat-${esc(c.id)}" aria-labelledby="cat-${esc(c.id)}-t">
            <div class="cat-head">
              <div class="cat-num">${pad(i + 1)} / ${pad(P.categories.length)}</div>
              <h3 id="cat-${esc(c.id)}-t">${esc(c.title)}</h3>
              <p>${esc(c.blurb)}</p>
              <div class="cat-count">${items.length === total ? total : items.length + " of " + total} project${total === 1 ? "" : "s"}</div>
            </div>
            <div class="card-grid">${items.map((p) => cardHTML(p, { noSpan: state.skill !== "all" && items.length < 2 })).join("")}</div>
          </section>`;
      }).join("");
      return blocks || `<p class="empty-state">No projects match this filter.</p>`;
    }

    function drawTimeline() {
      const items = P.projects.filter(visible).slice().sort((a, b) => (a.sort < b.sort ? 1 : -1));
      if (!items.length) return `<p class="empty-state">No projects match this filter.</p>`;
      const years = {};
      items.forEach((p) => { const y = p.sort.slice(0, 4); (years[y] = years[y] || []).push(p); });
      return Object.keys(years).sort().reverse().map((y) => `
        <section class="tl-year" aria-label="${y}">
          <div class="tl-year-label">${y}</div>
          <ol class="tl-list">
            ${years[y].map((p) => `
              <li class="tl-item">
                <a href="${projHref(p)}">
                  <span class="tl-date">${esc(p.season)}</span>
                  <img class="tl-thumb" src="${root}${esc(p.cover)}" alt="" loading="lazy" decoding="async">
                  <span class="tl-text">
                    <span class="tl-cat">${esc(catById(p.category).title)}</span>
                    <h4>${esc(p.title)}</h4>
                    <p>${esc(p.role)}</p>
                  </span>
                </a>
              </li>`).join("")}
          </ol>
        </section>`).join("");
    }

    function draw() {
      seg.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
      work.innerHTML = state.view === "timeline" ? drawTimeline() : drawCategories();
      setupReveal($$(".card, .tl-item", work));
    }
    if (work) draw();

    // Latest revisions
    const rev = $("#updates-body");
    if (rev) {
      const ups = allUpdates().slice(0, 8);
      rev.innerHTML = ups.map((u) => `
        <tr>
          <td class="date">${esc(fmtDate(u.date))}</td>
          <td class="proj"><a href="${projHref(u.project)}">${esc(u.project.title)}</a></td>
          <td>${esc(u.text)}</td>
        </tr>`).join("");
    }

    // Contact info
    const cl = $("#contact-list");
    if (cl) {
      const p = P.person, rows = [];
      const bare = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      if (p.email) rows.push(["Email", `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`]);
      if (p.linkedin) rows.push(["LinkedIn", `<a href="${esc(p.linkedin)}" rel="noopener">${esc(bare(p.linkedin))}</a>`]);
      if (p.github) rows.push(["GitHub", `<a href="${esc(p.github)}" rel="noopener">${esc(bare(p.github))}</a>`]);
      if (p.resume) rows.push(["Résumé", `<a href="${root}${esc(p.resume)}">Download (PDF)</a>`]);
      cl.innerHTML = rows.map(([k, v]) => `<div class="contact-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    }
  }

  /* =======================================================================
     PROJECT PAGE
     ======================================================================= */
  function renderProject() {
    const p = bySlug(slug);
    if (!p) return;
    const cat = catById(p.category);

    const crumbs = $("[data-crumbs]");
    if (crumbs) {
      crumbs.innerHTML = `<a href="${root}index.html#work">Work</a><span class="slash">/</span><a href="${root}index.html#cat-${esc(cat.id)}">${esc(cat.title)}</a><span class="slash">/</span><span>DWG ${esc(P.person.initials)}-${esc(p.dwg)}</span>`;
    }

    const tb = $("[data-titleblock]");
    if (tb) {
      const statusAttr = p.status === "Complete" ? "done" : "active";
      tb.classList.add("titleblock");
      tb.setAttribute("role", "group");
      tb.setAttribute("aria-label", "Project title block");
      tb.innerHTML = `
        <div class="tb-cell w3 full-sm"><span class="tb-label">Project</span><span class="tb-value">${esc(p.title)}</span></div>
        <div class="tb-cell w2"><span class="tb-label">Category</span><span class="tb-value">${esc(cat.title)}</span></div>
        <div class="tb-cell last dwg"><span class="tb-label">Dwg no.</span><span class="tb-value">${esc(P.person.initials)}-${esc(p.dwg)}</span></div>
        <div class="tb-cell w2 designer full-sm"><span class="tb-label">Designed by</span><span class="tb-value">J. HICKMAN-MAYNARD</span></div>
        <div class="tb-cell w2 full-sm"><span class="tb-label">Role</span><span class="tb-value">${esc(p.role)}</span></div>
        <div class="tb-cell"><span class="tb-label">Date</span><span class="tb-value">${esc(p.season)}</span></div>
        <div class="tb-cell last"><span class="tb-label">Status</span><span class="tb-value tb-status" data-status="${statusAttr}">${esc(p.status)}</span></div>
        <div class="tb-cell w3 bottom full-sm"><span class="tb-label">Context</span><span class="tb-value">${esc(p.team || "Independent project")}</span></div>
        <div class="tb-cell w3 bottom last full-sm"><span class="tb-label">Tools &amp; processes</span><span class="tb-value">${esc(p.tools)}</span></div>`;
    }

    // Section numbering + TOC
    const prose = $(".prose");
    const toc = $("[data-toc]");
    if (prose) {
      const hs = $$("h2", prose);
      hs.forEach((h, i) => {
        h.dataset.label = h.textContent.trim();
        if (!h.id) h.id = h.dataset.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const n = document.createElement("span");
        n.className = "sec-no";
        n.textContent = pad(i + 1);
        h.prepend(n);
      });
      if (toc && hs.length > 2) {
        toc.innerHTML = `<div class="toc-title">On this page</div><ol>${hs.map((h) => `<li><a href="#${h.id}">${esc(h.dataset.label)}</a></li>`).join("")}</ol>`;
        const links = $$("a", toc);
        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
              }
            });
          }, { rootMargin: "-20% 0px -70% 0px" });
          hs.forEach((h) => io.observe(h));
        }
      } else if (toc) {
        toc.remove();
        const layout = $(".proj-layout");
        if (layout) layout.style.gridTemplateColumns = "1fr";
      }
    }

    // Figure numbers
    let n = 0;
    $$("main figure.fig").forEach((f) => {
      const fc = $("figcaption", f);
      if (!fc || f.classList.contains("no-num")) return;
      n += 1;
      const s = document.createElement("span");
      s.className = "fig-no";
      s.textContent = `Fig. ${n}`;
      fc.prepend(s);
    });

    // Revision history
    const revEl = $("[data-revisions]");
    if (revEl) {
      const ups = (p.updates || []).slice().sort((a, b) => (a.date > b.date ? 1 : -1));
      const rows = [{ rev: "A", date: p.season, text: "Initial release of this write-up." }]
        .concat(ups.map((u, i) => ({ rev: String.fromCharCode(66 + i), date: fmtDate(u.date), text: u.text })));
      revEl.innerHTML = `
        <table class="rev-table">
          <caption>Revision history</caption>
          <thead><tr><th scope="col">Rev</th><th scope="col">Date</th><th scope="col">Description</th></tr></thead>
          <tbody>${rows.reverse().map((r) => `<tr><td class="rev">${r.rev}</td><td class="date">${esc(r.date)}</td><td>${esc(r.text)}</td></tr>`).join("")}</tbody>
        </table>`;
    }

    // Related (same category) + prev/next
    const rel = $("[data-related]");
    if (rel) {
      const others = P.projects.filter((q) => q.category === p.category && q.slug !== p.slug);
      if (others.length) rel.innerHTML = others.map((q) => cardHTML(q, { noSpan: true })).join("");
      else { const sec = rel.closest("section"); if (sec) sec.remove(); }
    }
    const pn = $("[data-pn]");
    if (pn) {
      const order = P.projects.slice().sort((a, b) => catIndex(a.category) - catIndex(b.category));
      const i = order.findIndex((q) => q.slug === p.slug);
      const prev = order[(i - 1 + order.length) % order.length];
      const next = order[(i + 1) % order.length];
      pn.classList.add("pn");
      pn.innerHTML = `
        <a class="prev" href="${projHref(prev)}"><small>← Previous · DWG ${esc(prev.dwg)}</small><b>${esc(prev.title)}</b></a>
        <a class="next" href="${projHref(next)}"><small>Next · DWG ${esc(next.dwg)} →</small><b>${esc(next.title)}</b></a>`;
    }

    setupClips();
    setupLightbox();
  }

  /* ---------------- Boot ---------------- */
  injectChrome();
  if (pageType === "home") renderHome();
  if (pageType === "project") renderProject();
})();
