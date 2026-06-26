/* ============================================================================
 *  app.js — 描画・診断・アニメーション
 * ==========================================================================*/
(function () {
  "use strict";

  /* ---- モノクロ・ライン アイコン（currentColorで着色）-------------------- */
  const ICONS = {
    drop:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    leaf:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14H4Z"/><path d="M4 20c4-6 8-9 12-10"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    circle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v.01M9.5 13c.6.8 1.5 1.2 2.5 1.2s1.9-.4 2.5-1.2"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>',
    sun:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/></svg>',
    wave:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>',
    split: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M12 8h5M12 12h6M12 16h5" opacity=".5"/></svg>',
    logo:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5C12 8 8 9.5 8 13a4 4 0 0 0 8 0c0-3.5-4-5-4-10.5Z"/><circle cx="12" cy="13" r="1.1" fill="currentColor" stroke="none"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    ext:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5H5V5h5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8M8 12h8"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
  };

  /* ---- カテゴリ別 商品ライン画像（実写真が無い間のプレースホルダ）-------- */
  const PRODUCT_ART = {
    "化粧水":   '<path d="M40 30h20v8l4 4v34a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V42l4-4v-8Z"/><path d="M42 52h16" opacity=".5"/>',
    "ジェル":   '<path d="M34 46h32v28a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V46Z"/><path d="M40 38h20v8H40zM44 32h12v6H44Z"/>',
    "乳液":     '<path d="M40 40h20v34a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6V40Z"/><path d="M46 40v-6h8v6M50 24v8M46 26h8" opacity=".7"/>',
    "オイル":   '<path d="M42 44h16v30a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V44Z"/><path d="M46 44v-6h8v6M50 24v6M47 30h6l-1 8h-4Z" opacity=".7"/>',
    "ミスト":   '<path d="M42 40h16v34a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V40Z"/><path d="M46 40v-6h8M58 28h6M58 32h5M58 24h5" opacity=".7"/><path d="M50 24v10" opacity=".7"/>',
    "美容液":   '<path d="M44 46h12v28a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V46Z"/><path d="M46 46v-8h8v8M50 22v6" opacity=".7"/><circle cx="50" cy="32" r="3" opacity=".7"/>',
    "日焼け止め":'<path d="M42 38h16v36a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V38Z"/><path d="M46 38v-6h8v6" opacity=".7"/><path d="M50 50v10M45 55h10" opacity=".6"/>',
  };
  function productArt(cat) {
    const p = PRODUCT_ART[cat] || PRODUCT_ART["化粧水"];
    return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }

  const yen = (n) => "¥" + n.toLocaleString("ja-JP");

  /* ---- 商品カード -------------------------------------------------------- */
  function productCard(p) {
    const media = p.img
      ? `<img src="assets/img/${p.img}" alt="${p.name}" loading="lazy" width="160" height="160">`
      : `<div class="product__art" aria-hidden="true">${productArt(p.cat)}</div>`;
    const price = p.price ? `${yen(p.price)} <small>目安</small>` : `<small>価格はさまざま</small>`;
    const otc = p.otc ? `<span class="otc">医薬部外品</span>` : "";
    const direct = !!p.asin;
    const ctaLabel = direct ? "Amazonで見る" : "Amazonで探す";
    return `
      <a class="product" href="${buildAmazonLink(p)}" target="_blank" rel="nofollow sponsored noopener"
         aria-label="${p.name} を ${ctaLabel}（新しいタブで開きます）">
        <div class="product__media">${media}</div>
        <div class="product__body">
          <span class="product__cat">${p.cat}${otc}</span>
          <span class="product__name">${p.name}</span>
          <span class="product__note">${p.note || ""}</span>
          <span class="product__foot">
            <span class="product__price">${price}</span>
            <span class="product__cta">${ctaLabel} ${ICONS.ext}</span>
          </span>
          <span class="product__sub">${direct ? "在庫・価格はAmazonでご確認ください" : "成分名でAmazon検索を開きます"}</span>
        </div>
      </a>`;
  }

  /* ---- 1つの推奨ブロック（成分 → 商品 → 効能 → 注意点 → ※研究データ）---- */
  function recBlock(item, i) {
    const ing = INGREDIENTS[item.ing];
    const p = PRODUCTS[item.product];
    const id = `ev-${item.ing}-${i}`;
    const best = i === 0;
    return `
      <article class="rec reveal${best ? " rec--best" : ""}" data-d="${(i % 4) + 1}">
        <div class="rec__index"><span>${String(i + 1).padStart(2, "0")}</span></div>
        <div class="rec__main">
          ${best ? `<span class="rec__pick">迷ったら、まずこれ</span>` : ""}
          <header class="rec__head">
            <h3 class="rec__name">${ing.name}<span class="rec__en">${ing.en}</span></h3>
            <span class="rec__tag">${ing.tag}</span>
          </header>

          ${productCard(p)}

          <div class="rec__lines">
            <p class="rec__why"><span class="rec__k">効能</span>${ing.why}</p>
            <p class="rec__caution"><span class="rec__k">注意点</span>${ing.caution}</p>
          </div>

          <button class="rec__ref" type="button" aria-expanded="false" aria-controls="${id}">
            ※研究データを見る
          </button>
          <div class="rec__ev" id="${id}" hidden>
            <p>${ing.evidence}</p>
          </div>
        </div>
      </article>`;
  }

  /* ---- 結果ビュー全体 --------------------------------------------------- */
  function renderResult(c) {
    const blocks = c.recommend.map(recBlock).join("");
    const routine = c.routine.map((s) => `<li>${s}</li>`).join("");
    const clinic = c.clinic
      ? `<p class="clinic-flag">${ICONS.cross}<span>赤く腫れる・痛い・繰り返すニキビは、市販品より皮膚科の受診を。</span></p>`
      : "";
    return `
      <div class="wrap">
        <button class="result-back" type="button" data-back>${ICONS.back}<span>悩みを選び直す</span></button>

        <header class="result-hero reveal">
          <div class="result-hero__badge">${ICONS[c.icon]}</div>
          <div>
            <p class="result-hero__eyebrow">あなたの悩み — ${c.label}</p>
            <h2 class="result-hero__headline">${c.headline}</h2>
          </div>
        </header>
        <p class="result-hero__summary reveal" data-d="1">${c.summary}</p>

        <div class="result-section reveal" data-d="2">
          <p class="eyebrow">Routine</p>
          <h3 class="result-subtitle">まずは、この順番で。</h3>
          <ol class="steps">${routine}</ol>
        </div>

        <div class="result-section">
          <p class="eyebrow reveal">Ingredients &amp; Picks</p>
          <h3 class="result-subtitle reveal">合う成分と、選び方。</h3>
          <p class="result-lead reveal">まずは「<b>迷ったら、まずこれ</b>」から。高い物ほど効くわけではありません——続けやすい1本を。各ブロックの<b>※研究データ</b>で根拠（出典）も確認できます。</p>
          <div class="recs">${blocks}</div>
        </div>

        ${clinic}

        <p class="aff-note reveal">※ 商品リンクは Amazonアソシエイト・プログラムを利用しています（広告）。価格・在庫は変動します。掲載は成分の一例で、効果には個人差があります。</p>

        <button class="result-back result-back--bottom" type="button" data-back>${ICONS.back}<span>ほかの悩みも見る</span></button>
      </div>`;
  }

  /* ---- 悩みグリッド（トップ）------------------------------------------- */
  function renderConcerns() {
    const grid = document.getElementById("concern-grid");
    if (!grid) return;
    grid.innerHTML = CONCERNS.map((c, i) => `
      <button class="concern reveal" data-d="${(i % 4) + 1}" data-id="${c.id}" type="button">
        <span class="concern__icon">${ICONS[c.icon]}</span>
        <span class="concern__label">${c.label}</span>
        <span class="concern__sub">${c.sub}</span>
      </button>`).join("");
  }

  /* ---- 「化粧水の科学」アコーディオン ----------------------------------- */
  function renderScience() {
    const list = document.getElementById("sci-list");
    if (!list) return;
    list.innerHTML = SCIENCE.map((s, i) => `
      <div class="sci">
        <button class="sci__q" type="button" aria-expanded="false" aria-controls="sci-${i}">
          ${s.q}<span class="tog" aria-hidden="true"></span>
        </button>
        <div class="sci__panel" id="sci-${i}" hidden><div class="sci__a">${s.a}</div></div>
      </div>`).join("");
  }

  /* ---- 高さアニメ付き開閉ヘルパー -------------------------------------- */
  function toggleHeight(panel, open) {
    if (open) {
      panel.hidden = false;
      const h = panel.scrollHeight;
      panel.style.height = "0px";
      requestAnimationFrame(() => { panel.style.height = h + "px"; });
      panel.addEventListener("transitionend", function te() {
        panel.style.height = "auto"; panel.removeEventListener("transitionend", te);
      });
    } else {
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(() => { panel.style.height = "0px"; });
      panel.addEventListener("transitionend", function te() {
        panel.hidden = true; panel.removeEventListener("transitionend", te);
      });
    }
  }

  /* ---- スクロール出現 -------------------------------------------------- */
  let io;
  function observeReveals(root) {
    if (!("IntersectionObserver" in window)) {
      (root || document).querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    (root || document).querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
  }

  /* ---- ルーティング（トップ ⇄ 結果）----------------------------------- */
  const home = document.getElementById("view-home");
  const result = document.getElementById("view-result");

  function showHome() {
    result.hidden = true;
    home.hidden = false;
    document.body.classList.remove("is-result");
    document.querySelectorAll(".concern.is-active").forEach((b) => b.classList.remove("is-active"));
  }

  function showResult(id, push) {
    const c = CONCERNS.find((x) => x.id === id);
    if (!c) { showHome(); return; }
    result.innerHTML = renderResult(c);
    home.hidden = true;
    result.hidden = false;
    document.body.classList.add("is-result");
    window.scrollTo({ top: 0, behavior: "auto" });
    observeReveals(result);
    if (push && location.hash !== "#c/" + id) history.pushState({ id }, "", "#c/" + id);
  }

  function routeFromHash() {
    const m = location.hash.match(/^#c\/(.+)$/);
    if (m) showResult(decodeURIComponent(m[1]), false);
    else showHome();
  }

  /* ---- イベント（委譲）------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const concern = e.target.closest(".concern");
    if (concern) { showResult(concern.dataset.id, true); return; }

    if (e.target.closest("[data-back]")) {
      // 直接 #c/xxx へ流入していても外部に戻らないよう、必ずサイト内のホームへ
      history.replaceState(null, "", location.pathname + location.search);
      showHome();
      const d = document.getElementById("diagnose");
      if (d) d.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    const ref = e.target.closest(".rec__ref");
    if (ref) {
      const panel = document.getElementById(ref.getAttribute("aria-controls"));
      const open = ref.getAttribute("aria-expanded") === "false";
      ref.setAttribute("aria-expanded", String(open));
      ref.textContent = open ? "※研究データを閉じる" : "※研究データを見る";
      toggleHeight(panel, open);
      return;
    }

    const sciQ = e.target.closest(".sci__q");
    if (sciQ) {
      const panel = document.getElementById(sciQ.getAttribute("aria-controls"));
      const open = sciQ.getAttribute("aria-expanded") === "false";
      sciQ.setAttribute("aria-expanded", String(open));
      sciQ.closest(".sci").classList.toggle("is-open", open);
      toggleHeight(panel, open);
      return;
    }

    const jump = e.target.closest('[data-jump]');
    if (jump) {
      e.preventDefault();
      const t = document.querySelector(jump.getAttribute("href"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  window.addEventListener("popstate", routeFromHash);

  /* ---- ヘッダーのスクロール状態 ---------------------------------------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- ヒーローのタイトル行アニメ -------------------------------------- */
  function animateHero() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".hero__title .line > span").forEach((el, i) => {
      el.style.transform = "translateY(110%)";
      el.style.transition = "transform .9s var(--ease)";
      el.style.transitionDelay = 0.12 + i * 0.12 + "s";
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = "translateY(0)"; }));
    });
  }

  /* ---- 初期化 ---------------------------------------------------------- */
  renderConcerns();
  renderScience();
  observeReveals();
  onScroll();
  animateHero();
  routeFromHash();
})();
