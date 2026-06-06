/* =====================================================================
   CAREER PREP — site rendering + hash routing
   Reads window.siteConfig (from site-config.js) and renders everything.
   ===================================================================== */
(function () {
  const cfg = window.siteConfig;
  if (!cfg) { console.error("siteConfig is missing"); return; }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) node.setAttribute(k, v);
    }
    children.flat().forEach(c => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  };

  /* ----------------------- MENU ----------------------------------- */
  function buildMenuLink(item) {
    const isExternal = /^https?:\/\//i.test(item.href || "");
    const node = el("a", {
      href: item.href,
      "data-page": item.id,
      class: item.cta ? "cta" : "",
      target: isExternal ? "_blank" : null,
      rel: isExternal ? "noopener noreferrer" : null,
    });
    if (item.html) node.innerHTML = item.html;
    else node.textContent = item.label;
    return node;
  }

  // Resolve any `submenuFrom: "locations"` keyword into a submenu:
  //   1) "Locations" entry first (the all-campuses page with finder)
  //   2) Each campus with its city after a green dot, e.g. "Skyway · Toledo"
  function expandedMenu() {
    return cfg.menu.map(item => {
      if (item.submenuFrom === "locations" && cfg.locations && cfg.locations.items) {
        const submenu = [{ id: "locations", label: "Locations", href: "#locations" }];
        cfg.locations.items.forEach(loc => {
          const showCity = loc.city && loc.city.toLowerCase() !== loc.name.toLowerCase();
          submenu.push({
            id: loc.slug,
            label: loc.name + (showCity ? " · " + loc.city : ""),
            html: showCity
              ? loc.name + ' <span class="campus-city">· ' + loc.city + "</span>"
              : loc.name,
            href: "#" + loc.slug,
          });
        });
        return Object.assign({}, item, { submenu });
      }
      return item;
    });
  }

  // True when the current "page" is actually a school slug
  function isSchoolSlug(id) {
    return cfg.locations && cfg.locations.items && cfg.locations.items.some(l => l.slug === id);
  }

  function renderMenu(currentPage) {
    const list = $("#navList");
    list.innerHTML = "";
    // When viewing a school page, treat "locations" as the active top-level item.
    // When viewing a Student Life submenu page (testimonials/faq/resources), highlight Student Life.
    const onSchoolPage = isSchoolSlug(currentPage);
    let topLevelActive = currentPage;
    if (onSchoolPage) {
      topLevelActive = "locations";
    } else {
      const parent = expandedMenu().find(m =>
        Array.isArray(m.submenu) && m.submenu.some(s => s.id === currentPage)
      );
      if (parent) topLevelActive = parent.id;
    }

    expandedMenu()
      .filter(item => item.visible !== false)
      .filter(item => !(item.hideOnPages || []).includes(currentPage))
      .forEach(item => {
        // Insert a green arrow separator right before the CTA so the menu visually
        // points at "Start Today"
        if (item.cta) {
          list.appendChild(el("li", { class: "nav-arrow", "aria-hidden": "true" }));
        }
        const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
        const li = el("li", { class: hasSubmenu ? "has-submenu" : "" });
        const link = buildMenuLink(item);
        if (item.id === topLevelActive) link.classList.add("active");
        // Carets removed per design — submenus reveal on hover/focus
        li.appendChild(link);

        if (hasSubmenu) {
          const sub = el("ul", { class: "submenu" });
          item.submenu.forEach(child => {
            const childLink = buildMenuLink(child);
            if (child.id === currentPage) childLink.classList.add("active");
            sub.appendChild(el("li", {}, childLink));
          });
          li.appendChild(sub);
        }
        list.appendChild(li);
      });
  }

  /* ----------------------- MODULE VISIBILITY ---------------------- */
  function applyModuleVisibility() {
    const map = cfg.modules || {};
    $$("[data-module]").forEach(node => {
      const key = node.getAttribute("data-module"); // e.g. "home.hero"
      const [page, mod] = key.split(".");
      const visible = map[page] && map[page][mod] !== false;
      node.style.display = visible ? "" : "none";
    });
  }

  /* ----------------------- HOME ----------------------------------- */
  /* Populate a video frame element with either the local video or YouTube/Vimeo
     embed configured in cfg.videoHero. Falls back to populating placeholder
     text in the frame's existing placeholder children when nothing is set.
     Used for both the home-page hero video and the per-school conversion
     hero (each school page gets its own iframe instance). */
  function renderVideoIntoFrame(frame, placeholderTitleSelector, placeholderSubSelector) {
    const v = cfg.videoHero;
    if (!v || !frame) return;
    if (v.localUrl) {
      // Native <video> player — autoplay + muted so browsers allow it,
      // playsinline so iOS plays it in place, loop so it keeps running.
      frame.innerHTML = "";
      const video = el("video", {
        src: v.localUrl,
        autoplay: "",
        muted: "",
        loop: "",
        playsinline: "",
        "webkit-playsinline": "",
        controls: "",
        preload: "metadata",
      });
      video.muted = true;
      video.autoplay = true;
      frame.appendChild(video);
      const playWhenReady = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
      playWhenReady();
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) playWhenReady(); });
        }, { threshold: 0.25 });
        io.observe(video);
      }
    } else if (v.embedUrl) {
      frame.innerHTML = "";
      frame.appendChild(el("iframe", {
        src: v.embedUrl,
        title: "Student testimonial",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowfullscreen: "",
        loading: "lazy",
        referrerpolicy: "strict-origin-when-cross-origin",
      }));
    } else {
      const t = placeholderTitleSelector ? document.querySelector(placeholderTitleSelector) : null;
      const s = placeholderSubSelector   ? document.querySelector(placeholderSubSelector)   : null;
      if (t) t.textContent = v.placeholderTitle || "";
      if (s) s.textContent = v.placeholderSub   || "";
    }
  }

  function renderHeroVideo() {
    renderVideoIntoFrame($("#videoFrame"), "#videoPlaceholderTitle", "#videoPlaceholderSub");
  }

  /* Populate the home-page value prop (eyebrow + headline + body + promise)
     into the school-page hero. The CTAs and campus identifier already live
     in the school-hero markup; we only fill in the broad-pitch text here so
     a visitor landing directly on /#cascade still sees the conversion pitch
     above the fold. Called from renderSchoolPage. */
  function renderSchoolConversionHero() {
    const h = cfg.hero;
    if (!h) return;
    const eb = $("#schoolConvEyebrow");  if (eb) eb.textContent = h.eyebrow  || "";
    const hd = $("#schoolConvHeadline"); if (hd) hd.textContent = h.headline || "";
    const bodyWrap = $("#schoolConvBody");
    if (bodyWrap) {
      bodyWrap.innerHTML = "";
      (h.body || []).forEach(p => bodyWrap.appendChild(el("p", { class: "lead" }, p)));
    }
    const promise = $("#schoolConvPromise"); if (promise) promise.textContent = h.promise || "";
  }

  /* Render the pathway-icon row in the school hero — pulls icon + title from
     cfg.pathways.items, filtered to school.pathways (the slugs available at
     this campus). Quick visual cue of exactly what's offered here. */
  function renderSchoolHeroPathways(school) {
    const host = document.getElementById("schoolHeroPathways");
    if (!host) return;
    host.innerHTML = "";
    const slugs = Array.isArray(school.pathways) ? school.pathways : [];
    const all   = (cfg.pathways && cfg.pathways.items) || [];
    slugs.forEach(slug => {
      const p = all.find(x => x.slug === slug);
      if (!p) return;
      const pill = el("a", {
        class: "school-hero-pathway-pill",
        href: "#pathways",
        title: p.title,
      });
      pill.appendChild(el("span", { class: "school-hero-pathway-pill-icon", "aria-hidden": "true" }, p.icon || "★"));
      pill.appendChild(el("span", {}, p.title));
      host.appendChild(pill);
    });
  }

  /* Rotates the school-hero headline through cfg.hero.headlineRotation with
     a fade transition, exactly like the home hero rotator. Runs once when
     the school page first renders, then never restarts. */
  let schoolHeadlineRotatorStarted = false;
  function startSchoolHeadlineRotator() {
    if (schoolHeadlineRotatorStarted) return;
    const h = cfg.hero;
    const phrases = Array.isArray(h && h.headlineRotation) ? h.headlineRotation.filter(Boolean) : [];
    if (phrases.length < 2) return;
    const node = document.getElementById("schoolConvHeadline");
    if (!node) return;
    schoolHeadlineRotatorStarted = true;
    let i = 0;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      node.classList.add("is-fading");
      setTimeout(() => {
        i = (i + 1) % phrases.length;
        node.textContent = phrases[i];
        node.classList.remove("is-fading");
      }, 380);
    }, 4200);
  }

  // Rotates the hero headline through `cfg.hero.headlineRotation` with a fade transition
  let heroRotatorStarted = false;
  function startHeroHeadlineRotator() {
    if (heroRotatorStarted) return;
    const h = cfg.hero;
    const phrases = Array.isArray(h && h.headlineRotation) ? h.headlineRotation.filter(Boolean) : [];
    if (phrases.length < 2) return;
    const node = document.getElementById("heroHeadline");
    if (!node) return;
    heroRotatorStarted = true;
    let i = 0;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      node.classList.add("is-fading");
      setTimeout(() => {
        i = (i + 1) % phrases.length;
        node.textContent = phrases[i];
        node.classList.remove("is-fading");
      }, 380);
    }, 4200);
  }

  function renderHome() {
    const h = cfg.hero;
    $("#heroEyebrow").textContent = h.eyebrow;
    $("#heroHeadline").textContent = h.headline;
    const bodyWrap = $("#heroBody");
    bodyWrap.innerHTML = "";
    h.body.forEach(p => bodyWrap.appendChild(el("p", { class: "lead" }, p)));
    $("#heroPromise").textContent = h.promise;

    const cta = $("#heroCta");
    cta.innerHTML = "";
    const applyHref = h.primaryCta.href || cfg.brand.applyUrl;
    const isExternal = /^https?:\/\//i.test(applyHref);
    cta.appendChild(el("a", {
      class: "btn btn-primary btn-pop",
      href: applyHref,
      target: isExternal ? "_blank" : null,
      rel: isExternal ? "noopener" : null,
    }, h.primaryCta.label));
    // Secondary CTA — supports `action: "open-quiz"` so the button opens
    // the Career Quiz modal instead of routing to a hash. Any other value
    // falls through to a normal link.
    const secondaryEl = el("a", {
      class: "btn btn-outline",
      href: h.secondaryCta.href || "#",
    }, h.secondaryCta.label);
    if (h.secondaryCta.action === "open-quiz") {
      secondaryEl.setAttribute("data-action", "open-quiz");
      secondaryEl.addEventListener("click", (e) => { e.preventDefault(); openCareerQuiz(); });
    }
    cta.appendChild(secondaryEl);

    // Video caption under the hero testimonial video
    const cap = $("#heroVideoCaption");
    if (cap) cap.textContent = h.videoCaption || "";

    // Value props
    const vp = $("#valueProps");
    vp.innerHTML = "";
    cfg.valueProps.forEach(v => {
      vp.appendChild(el("div", { class: "value" },
        el("span", { class: "label" }, v.label),
        el("span", { class: "detail" }, v.detail)
      ));
    });

    // Mission strip — headline + wraparound-services ecosystem
    const m = cfg.mission;
    const headlineEl = $("#missionHeadline");
    if (headlineEl) headlineEl.textContent = m.headline;

    // Wraparound services — circular ecosystem layout with hub in the center
    const ecoHost = $("#missionEcosystem");
    if (ecoHost) {
      ecoHost.innerHTML = "";
      ecoHost.classList.remove("services-grid");
      ecoHost.classList.add("ecosystem", "mission-ecosystem");
      const offerings = (cfg.studentLife && cfg.studentLife.offerings) || [];
      const total = offerings.length;
      offerings.forEach((o, i) => {
        ecoHost.appendChild(el("li", {
          class: "ecosystem-node",
          style: "--i:" + i + ";--total:" + total + ";",
        },
          el("span", { class: "offering-badge" + (i % 2 ? " is-navy" : "") }, String(i + 1)),
          el("h4", {}, o.title),
          el("p", { class: "muted" }, o.body)
        ));
      });
      const hub = el("div", { class: "ecosystem-hub" },
        el("span", { class: "ecosystem-hub-label" }, "Wraparound support"),
        el("span", { class: "ecosystem-hub-sub" }, "Every student")
      );
      ecoHost.appendChild(hub);
    }

    // How It Works — 4 steps arranged as a climb up a mountain to the diploma
    if (cfg.howItWorks) {
      const hiw = cfg.howItWorks;
      $("#hiwEyebrow").textContent = hiw.eyebrow || "";
      $("#hiwHeadline").textContent = hiw.headline || "Make the Climb Toward Your Diploma";
      const subEl = $("#hiwSub");
      if (subEl) subEl.textContent = hiw.sub || "";
      const stepsHost = $("#hiwSteps");
      stepsHost.innerHTML = "";
      const steps = hiw.steps || [];
      const total = steps.length;
      steps.forEach((s, i) => {
        const li = el("li", {
          class: "mtn-item hiw-mtn-item",
          tabindex: "0",                 // focusable so tap-to-reveal works on touch
          role: "button",
          "aria-label": (s.title || ("Step " + (i + 1))) + " — tap for details",
          style: "--i:" + i + ";--total:" + total + ";--delay:" + (0.2 + i * 0.25) + "s;",
        });
        li.appendChild(el("span", { class: "mtn-num" }, s.num || String(i + 1)));
        const body = el("div", { class: "hiw-mtn-body" });
        body.appendChild(el("strong", { class: "hiw-mtn-title" }, s.title));
        body.appendChild(el("p", {}, s.body));
        li.appendChild(body);
        stepsHost.appendChild(li);
      });

      // Trigger the climbing animation once the mountain scrolls into view
      const mtn = document.querySelector(".hiw-mountain");
      if (mtn && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              mtn.classList.add("is-climbing");
              io.disconnect();
            }
          });
        }, { threshold: 0.25 });
        io.observe(mtn);
      } else if (mtn) {
        mtn.classList.add("is-climbing");
      }

      const cta = $("#hiwCta");
      if (cta && hiw.cta) {
        cta.textContent = hiw.cta.label || "Apply now";
        const href = hiw.cta.href || cfg.brand.applyUrl;
        cta.href = href;
        if (/^https?:\/\//i.test(href)) { cta.target = "_blank"; cta.rel = "noopener"; }
      }
    }

    // Pain points on the home page (sits before the circle graph).
    // Reuses cfg.painPoints — same content as the Why We're Different page,
    // so a single edit updates both.
    if (cfg.painPoints) {
      const pp = cfg.painPoints;
      const eb = $("#homePainPointsEyebrow"); if (eb) eb.textContent = pp.eyebrow || "";
      const hd = $("#homePainPointsHeadline"); if (hd) hd.textContent = pp.headline || "";
      const bd = $("#homePainPointsBody");     if (bd) bd.textContent = pp.body || "";
      const grid = $("#homePainPointsGrid");
      if (grid) {
        grid.innerHTML = "";
        (pp.items || []).forEach(item => {
          const card = el("div", { class: "pain-card" });
          card.appendChild(el("span", { class: "pain-icon", "aria-hidden": "true" }, item.icon || "•"));
          card.appendChild(el("p", { class: "pain-problem" }, item.problem));
          card.appendChild(el("p", { class: "pain-promise" }, item.promise));
          grid.appendChild(card);
        });
      }
    }

    // Impact stats — headline numbers (lives changed, diplomas, certs, campuses)
    if (cfg.impactStats) {
      const is = cfg.impactStats;
      const eb = $("#impactEyebrow");  if (eb) eb.textContent = is.eyebrow  || "";
      const hd = $("#impactHeadline"); if (hd) hd.textContent = is.headline || "";
      const sb = $("#impactSub");      if (sb) sb.textContent = is.sub      || "";
      const grid = $("#impactStatsGrid");
      if (grid) {
        grid.innerHTML = "";
        (is.items || []).forEach(item => {
          const card = el("div", { class: "impact-stat" });
          card.appendChild(el("div", { class: "impact-stat-number" }, item.number || ""));
          card.appendChild(el("div", { class: "impact-stat-label" },  item.label  || ""));
          if (item.sub) card.appendChild(el("div", { class: "impact-stat-sub" }, item.sub));
          grid.appendChild(card);
        });
      }
    }

    // Sponsored by — partner logos (placeholders until real logos land)
    if (cfg.sponsored) {
      const sp = cfg.sponsored;
      const eb = $("#sponsoredEyebrow");  if (eb) eb.textContent = sp.eyebrow  || "";
      const hd = $("#sponsoredHeadline"); if (hd) hd.textContent = sp.headline || "";
      const sb = $("#sponsoredSub");      if (sb) sb.textContent = sp.sub      || "";
      const grid = $("#sponsoredGrid");
      if (grid) {
        grid.innerHTML = "";
        (sp.items || []).forEach(item => {
          const isLink = !!item.href;
          const wrap = el(isLink ? "a" : "div", isLink
            ? { class: "sponsor-tile", href: item.href, target: "_blank", rel: "noopener" }
            : { class: "sponsor-tile" }
          );
          if (item.logoUrl) {
            wrap.appendChild(el("img", { class: "sponsor-logo", src: item.logoUrl, alt: item.name || "Sponsor logo", loading: "lazy" }));
          } else {
            // Placeholder tile — labeled so it's obvious which slot still needs a real logo
            wrap.classList.add("is-placeholder");
            wrap.appendChild(el("div", { class: "placeholder-tag" }, "Logo placeholder"));
            wrap.appendChild(el("div", { class: "sponsor-tile-name" }, item.name || "Partner logo"));
          }
          grid.appendChild(wrap);
        });
      }
    }

    // Written testimonials grid
    if (cfg.writtenTestimonials) {
      const wt = cfg.writtenTestimonials;
      $("#wtEyebrow").textContent = wt.eyebrow || "";
      $("#wtHeadline").textContent = wt.headline || "";
      const wtGrid = $("#wtGrid");
      wtGrid.innerHTML = "";
      (wt.items || []).forEach(item => {
        const card = el("div", { class: "wt-card" });
        card.appendChild(el("div", { class: "wt-quote-mark", "aria-hidden": "true" }, "“"));
        card.appendChild(el("p", { class: "wt-quote" }, item.quote));
        const meta = el("div", { class: "wt-meta" });
        meta.appendChild(el("strong", {}, item.name || ""));
        // Campus attribution intentionally hidden on the home page — the
        // student's name alone keeps the focus on the voice, not the school.
        card.appendChild(meta);
        wtGrid.appendChild(card);
      });
    }

    // FAQ preview (top 4 collapsible items)
    const homeFaq = $("#homeFaqList");
    if (homeFaq && cfg.faq && cfg.faq.items) {
      homeFaq.innerHTML = "";
      cfg.faq.items.slice(0, 4).forEach(item => {
        const d = el("details", {});
        d.appendChild(el("summary", {}, item.q));
        d.appendChild(el("div", { class: "a" }, item.a));
        homeFaq.appendChild(d);
      });
    }

    // Pathway photo cards (right under the hero — visitors see what's offered immediately)
    const prev = $("#homePathwaysPreview");
    if (prev) {
      prev.innerHTML = "";
      const photos = (cfg.stockPhotos && cfg.stockPhotos.pathwayDefaults) || {};
      (cfg.pathways && cfg.pathways.items ? cfg.pathways.items : []).forEach(p => {
        const card = el("a", { class: "pathway-icon-card", href: "#pathways" });
        const photo = photos[p.slug];
        if (photo && photo.url) {
          card.appendChild(el("img", { class: "pathway-icon-img", src: photo.url, alt: p.title, loading: "lazy" }));
        } else {
          card.appendChild(el("span", { class: "pathway-icon", "aria-hidden": "true" }, p.icon || "★"));
        }
        card.appendChild(el("span", { class: "pathway-icon-name" }, p.title));
        prev.appendChild(card);
      });
    }
  }

  function stockPhotoFigure(photo, extraClass) {
    if (!photo || !photo.url) return null;
    const fig = el("figure", { class: "stock-photo" + (extraClass ? " " + extraClass : "") });
    fig.appendChild(el("img", { src: photo.url, alt: photo.alt || "", loading: "lazy" }));
    if (photo.placeholder) {
      fig.appendChild(el("span", { class: "stock-photo-badge" }, "Placeholder photo"));
    }
    return fig;
  }

  function pathwayCard(p) {
    const card = el("div", { class: "card pathway-card" });
    // Stock photo at the top of each pathway card
    const photoCfg = (cfg.stockPhotos && cfg.stockPhotos.pathwayDefaults) || {};
    const photo = p.slug && photoCfg[p.slug];
    const fig = stockPhotoFigure(photo, "pathway-thumb");
    if (fig) card.appendChild(fig);

    card.appendChild(el("span", { class: "pill" }, p.availability));
    card.appendChild(el("h3", {}, p.title));
    card.appendChild(el("p", { class: "muted" }, p.body));
    if (p.certs && p.certs.length) {
      const certs = el("div", { class: "certs" });
      p.certs.forEach(c => certs.appendChild(el("span", {}, c)));
      card.appendChild(certs);
    }
    return card;
  }

  /* ----------------------- WHY ------------------------------------ */
  function renderWhy() {
    // Stock hero photo at the top of the page
    const photoCfg = cfg.stockPhotos && cfg.stockPhotos.whyHero;
    const heroPhotoHost = $("#whyHeroPhoto");
    if (heroPhotoHost && photoCfg) {
      heroPhotoHost.innerHTML = "";
      heroPhotoHost.appendChild(el("img", { src: photoCfg.url, alt: photoCfg.alt || "", loading: "lazy" }));
      if (photoCfg.placeholder) {
        heroPhotoHost.appendChild(el("span", { class: "stock-photo-badge" }, "Placeholder photo"));
      }
    }

    const m = cfg.mission;
    $("#whyEyebrow").textContent = m.eyebrow;
    $("#whyHeadline").textContent = m.headline;
    const wb = $("#whyBody");
    wb.innerHTML = "";
    m.body.forEach(p => wb.appendChild(el("p", {}, p)));
    $("#fusionMission").textContent = m.fusionMission;
    $("#whyPullQuote").textContent = m.pullQuote;

    // Pain points — the real things in the way, lined up before the comparison chart
    if (cfg.painPoints) {
      const pp = cfg.painPoints;
      const eb = $("#painPointsEyebrow"); if (eb) eb.textContent = pp.eyebrow || "";
      const hd = $("#painPointsHeadline"); if (hd) hd.textContent = pp.headline || "";
      const bd = $("#painPointsBody");     if (bd) bd.textContent = pp.body || "";
      const grid = $("#painPointsGrid");
      if (grid) {
        grid.innerHTML = "";
        (pp.items || []).forEach(item => {
          const card = el("div", { class: "pain-card" });
          card.appendChild(el("span", { class: "pain-icon", "aria-hidden": "true" }, item.icon || "•"));
          card.appendChild(el("p", { class: "pain-problem" }, item.problem));
          card.appendChild(el("p", { class: "pain-promise" }, item.promise));
          grid.appendChild(card);
        });
      }
    }

    // Comparison table — split "Traditional School vs Career Prep" so each side
    // can be styled independently (Traditional plain white, Career Prep gradient + underline)
    const c = cfg.comparison;
    const splitMatch = (c.headline || "").match(/^(.+?)\s+vs\s+(.+)$/i);
    const headlineEl = $("#compareHeadline");
    if (splitMatch) {
      headlineEl.innerHTML = "";
      headlineEl.appendChild(el("span", { class: "ch-trad" }, splitMatch[1]));
      headlineEl.appendChild(el("span", { class: "ch-vs" }, " vs "));
      headlineEl.appendChild(el("span", { class: "ch-cp" }, splitMatch[2]));
    } else {
      headlineEl.textContent = c.headline;
    }
    const head = $("#compareHead");
    head.innerHTML = "";
    head.appendChild(el("th", {}, ""));
    c.columns.forEach(col => head.appendChild(el("th", { class: col.accent ? "accent" : "" }, col.label)));
    const body = $("#compareBody");
    body.innerHTML = "";
    c.rows.forEach(row => {
      const tr = el("tr", {},
        el("td", { class: "trait" }, row.trait),
        el("td", { class: "trad" }, row.traditional),
        el("td", { class: "cp" }, row.cp)
      );
      body.appendChild(tr);
    });

    // Start Today CTA right under the comparison chart — points at the
    // brand-wide application URL so the single source of truth stays in
    // brand.applyUrl.
    const whyCta = $("#whyCompareCta");
    if (whyCta) {
      const url = cfg.brand.applyUrl;
      whyCta.href = url;
      if (/^https?:\/\//i.test(url)) { whyCta.target = "_blank"; whyCta.rel = "noopener"; }
    }

    // Promise list — rendered as climbing milestones up the mountain
    const p = cfg.promise;
    $("#promiseHeadline").textContent = p.headline;
    $("#promiseSub").textContent = p.sub;
    const list = $("#promiseList");
    list.innerHTML = "";
    const total = p.items.length;
    p.items.forEach((it, i) => {
      list.appendChild(el("li", {
        class: "mtn-item",
        style: "--i:" + i + ";--total:" + total + ";",
      },
        el("span", { class: "mtn-num" }, String(i + 1)),
        el("p", {}, it)
      ));
    });
  }

  /* ----------------------- PATHWAYS ------------------------------- */
  function renderPathways() {
    const p = cfg.pathways;
    $("#pathwaysEyebrow").textContent = p.eyebrow;
    $("#pathwaysHeadline").textContent = p.headline;
    $("#pathwaysBody").textContent = p.body;
    const grid = $("#pathwaysGrid");
    grid.innerHTML = "";
    p.items.forEach(i => grid.appendChild(pathwayCard(i)));
    $("#pathwaysNote").textContent = p.note;
  }

  /* ----------------------- STUDENT LIFE --------------------------- */
  function renderStudentLife() {
    const s = cfg.studentLife;
    // Intro replaced with a hero image placeholder — no text to render here.
    // Render as a circular ecosystem with a central hub
    const off = $("#offerings");
    off.innerHTML = "";
    off.classList.add("ecosystem");
    const total = s.offerings.length;
    s.offerings.forEach((o, idx) => {
      const node = el("div", {
        class: "ecosystem-node",
        style: `--i:${idx};--total:${total};`,
      });
      const badge = el("span", { class: "offering-badge" + (idx % 2 ? " is-navy" : "") }, String(idx + 1));
      node.appendChild(badge);
      node.appendChild(el("h4", {}, o.title));
      node.appendChild(el("p", { class: "muted" }, o.body));
      off.appendChild(node);
    });
    // Center hub
    const hub = el("div", { class: "ecosystem-hub" },
      el("span", { class: "ecosystem-hub-label" }, "Wraparound support"),
      el("span", { class: "ecosystem-hub-sub" }, "All in one place")
    );
    off.appendChild(hub);
    $("#testimonialPlaceholder").textContent = s.testimonialsPlaceholder;
    $("#eventsPlaceholder").textContent = s.eventsPlaceholder;
  }

  // Split a "street, city, state ZIP" address onto two lines (street / city-state-zip)
  function formatAddressTwoLine(addressStr) {
    if (!addressStr) return "";
    const idx = addressStr.indexOf(",");
    if (idx === -1) return addressStr;
    const street = addressStr.slice(0, idx).trim();
    const rest   = addressStr.slice(idx + 1).trim();
    // Escape minimal HTML (addresses don't normally contain it but be safe)
    const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    return esc(street) + "<br>" + esc(rest);
  }

  /* ----------------------- LOCATIONS ------------------------------ */
  // Cycle the locations headline through "9 Locations, One Mission" + each campus name
  let locRotatorStarted = false;
  function startLocationRotator() {
    if (locRotatorStarted) return;
    const node = document.getElementById("locHeadline");
    if (!node) return;
    const items = (cfg.locations && cfg.locations.items) || [];
    if (!items.length) return;
    const phrases = [cfg.locations.headline].concat(
      items.map(i => {
        const c = (i.city || "").trim();
        // Skip the " · city" suffix when the school name already IS the city (e.g. Cincinnati)
        if (!c || c.toLowerCase() === i.name.toLowerCase()) return i.name;
        return i.name + " · " + c;
      })
    );
    if (phrases.length < 2) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    locRotatorStarted = true;
    let i = 0;
    setInterval(() => {
      node.classList.add("is-fading");
      setTimeout(() => {
        i = (i + 1) % phrases.length;
        node.textContent = phrases[i];
        node.classList.remove("is-fading");
      }, 350);
    }, 2600);
  }
  // Build the scrolling marquee of campus names
  function renderLocationsMarquee() {
    const track = document.getElementById("locMarqueeTrack");
    if (!track) return;
    track.innerHTML = "";
    const items = (cfg.locations && cfg.locations.items) || [];
    if (!items.length) return;
    // Duplicate so the looping animation joins seamlessly
    [items, items].forEach(set => {
      set.forEach(loc => {
        const span = document.createElement("span");
        span.className = "loc-marquee-item";
        const c = (loc.city || "").trim();
        // Skip the city tag when the school name IS the city (e.g. Cincinnati)
        const cityHtml = (!c || c.toLowerCase() === loc.name.toLowerCase())
          ? ""
          : ' <span class="city">' + c + "</span>";
        span.innerHTML = loc.name + cityHtml;
        track.appendChild(span);
      });
    });
  }

  function renderLocations() {
    const l = cfg.locations;
    $("#locEyebrow").textContent = l.eyebrow;
    $("#locHeadline").textContent = l.headline;
    $("#locBody").textContent = l.body;
    renderLocationsMarquee();

    const grid = $("#locGrid");
    grid.innerHTML = "";
    l.items.forEach(item => {
      const card = el("div", { class: "location" + (item.featured ? " featured" : "") });
      if (item.featured) card.appendChild(el("span", { class: "badge" }, "Toledo · Skyway"));
      // School name links to that school's dedicated page
      const nameLink = item.slug ? el("a", { href: "#" + item.slug, class: "location-name-link" }, item.name) : item.name;
      card.appendChild(el("h4", {}, nameLink));
      card.appendChild(el("p", { class: "addr", html: formatAddressTwoLine(item.address) }));
      const phone = el("a", { class: "phone", href: "tel:" + item.phone.replace(/[^0-9]/g, "") }, item.phone);
      card.appendChild(phone);
      if (item.email) {
        card.appendChild(el("a", {
          class: "loc-email",
          href: "mailto:" + item.email,
        }, item.email));
      }
      const actions = el("div", { class: "location-actions" });
      if (item.slug) {
        actions.appendChild(el("a", { class: "btn btn-primary btn-sm", href: "#" + item.slug }, "View campus →"));
      }
      const dirHref = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.address);
      actions.appendChild(el("a", { class: "btn btn-outline btn-sm", href: dirHref, target: "_blank", rel: "noopener" }, "Directions"));
      card.appendChild(actions);
      grid.appendChild(card);
    });

    renderFinder();
  }

  /* ----------------------- QUICK FINDER WIDGET (floating, collapsible) ---- */
  let quickFinderInited = false;
  function initQuickFinder() {
    if (quickFinderInited) return;
    const root = document.getElementById("quickFinder");
    if (!root) return;
    quickFinderInited = true;

    const toggle = document.getElementById("quickFinderToggle");
    const closeBtn = document.getElementById("quickFinderClose");
    const form = document.getElementById("quickFinderForm");
    const input = document.getElementById("quickFinderInput");
    const useLoc = document.getElementById("quickFinderUseLocation");
    const status = document.getElementById("quickFinderStatus");
    const results = document.getElementById("quickFinderResults");

    function setOpen(open) {
      root.dataset.collapsed = open ? "false" : "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", () => setOpen(root.dataset.collapsed === "true"));
    closeBtn.addEventListener("click", () => setOpen(false));

    function showResults(origin) {
      const items = (cfg.locations && cfg.locations.items) || [];
      const ranked = items
        .filter(s => s.coords)
        .map(s => ({ school: s, miles: distanceMiles(origin, s.coords) }))
        .sort((a, b) => a.miles - b.miles)
        .slice(0, 4);
      status.className = "qf-status";
      status.textContent = "";
      results.innerHTML = "";
      ranked.forEach((r, i) => {
        const li = el("li", { class: i === 0 ? "qf-result is-nearest" : "qf-result" },
          el("span", { class: "qf-rank" }, String(i + 1)),
          el("a", { class: "qf-name", href: "#" + r.school.slug }, r.school.name),
          el("span", { class: "qf-dist" }, r.miles.toFixed(1) + " mi")
        );
        results.appendChild(li);
      });
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      status.className = "qf-status is-loading";
      status.textContent = "Looking up…";
      geocodeAddress(q).then(o => {
        if (!o) { status.className = "qf-status is-error"; status.textContent = "Couldn't find that address."; return; }
        showResults({ lat: o.lat, lng: o.lng });
      }).catch(() => { status.className = "qf-status is-error"; status.textContent = "Try again."; });
    });

    useLoc.addEventListener("click", () => {
      if (!navigator.geolocation) { status.className = "qf-status is-error"; status.textContent = "Browser doesn't support location."; return; }
      status.className = "qf-status is-loading";
      status.textContent = "Getting your location…";
      navigator.geolocation.getCurrentPosition(
        pos => showResults({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => { status.className = "qf-status is-error"; status.textContent = "Permission denied — try entering an address."; },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  // Show the floating actions (finder + "Have a question?") only on Home and Start Today
  function updateQuickFinderVisibility(pageId) {
    const root = document.getElementById("floatingActions") || document.getElementById("quickFinder");
    if (!root) return;
    const showPages = ["home", "start"];
    root.style.display = showPages.includes(pageId) ? "" : "none";
  }

  /* ----------------------- ASK-A-QUESTION BUTTON ------------------ */
  /* Floating mailto button. Pulls the recipient from cfg.brand.contactEmail.
     If not set yet, the button still appears but opens the user's mail
     client with no recipient pre-filled (and we log a console hint so the
     missing config is obvious during setup). */
  function initAskQuestionButton() {
    const btn = document.getElementById("askQuestionBtn");
    if (!btn) return;
    const email   = (cfg.brand && cfg.brand.contactEmail) || "";
    const subject = (cfg.brand && cfg.brand.contactEmailSubject) || "Question about Career Prep High School";
    if (email) {
      btn.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject);
    } else {
      // No address configured yet — open mail client blank so nothing routes
      // to the wrong place. Set cfg.brand.contactEmail to fix this.
      btn.href = "mailto:?subject=" + encodeURIComponent(subject);
      console.info("[askQuestion] cfg.brand.contactEmail is null — the floating 'Send a message' button opens a blank email. Set the address in site-config.js.");
    }
  }

  /* ----------------------- INTERACTIVE LEAFLET MAP ---------------- */
  let leafletMap = null;
  const leafletMarkers = {};

  function initInteractiveMap() {
    if (leafletMap) {
      // Map already built — just nudge it to recalc size in case container was hidden
      setTimeout(() => leafletMap.invalidateSize(), 100);
      return;
    }
    if (!window.L) return;       // Leaflet not loaded yet
    const mapEl = document.getElementById("locInteractiveMap");
    if (!mapEl) return;

    const items = (cfg.locations && cfg.locations.items) || [];

    leafletMap = L.map(mapEl, {
      center: [40.0, -82.7],     // approximate centre of Ohio
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(leafletMap);

    items.forEach((school, i) => {
      if (!school.coords) return;
      const num = i + 1;
      const featured = school.featured ? " is-featured" : "";
      const icon = L.divIcon({
        className: "cphs-pin" + featured,
        html: '<div class="cphs-pin-shape"><span>' + num + '</span></div>',
        iconSize: [40, 52],
        iconAnchor: [20, 52],
        popupAnchor: [0, -44],
      });
      const marker = L.marker([school.coords.lat, school.coords.lng], { icon, title: school.name })
        .addTo(leafletMap);

      const slug = school.slug;
      const popupHtml =
        '<div class="cphs-popup">' +
          '<strong>' + school.name + '</strong>' +
          (school.city ? '<span class="cphs-popup-city">' + school.city + '</span>' : '') +
          '<p>' + school.address + '</p>' +
          '<div class="cphs-popup-actions">' +
            (slug ? '<a class="cphs-popup-cta" href="#' + slug + '">View campus →</a>' : '') +
            '<a class="cphs-popup-link" href="https://www.google.com/maps/search/?api=1&query=' +
              encodeURIComponent(school.address) + '" target="_blank" rel="noopener">Directions</a>' +
          '</div>' +
        '</div>';
      marker.bindPopup(popupHtml, { maxWidth: 260 });
      if (slug) leafletMarkers[slug] = marker;
    });

    // Side key: clickable list of all schools
    const keyEl = document.getElementById("locMapKey");
    if (keyEl) {
      keyEl.innerHTML = "";
      items.forEach((school, i) => {
        const li = el("li", {});
        const btn = el("button", { type: "button", class: "map-key-btn", "data-slug": school.slug || "" });
        btn.appendChild(el("span", { class: "map-key-num" }, String(i + 1)));
        const wrap = el("span", { class: "map-key-text" });
        wrap.appendChild(el("strong", {}, school.name));
        if (school.city) wrap.appendChild(el("span", { class: "map-key-city" }, school.city));
        btn.appendChild(wrap);
        btn.addEventListener("click", () => {
          const m = school.slug && leafletMarkers[school.slug];
          if (m) {
            leafletMap.setView(m.getLatLng(), 12, { animate: true });
            m.openPopup();
          }
        });
        li.appendChild(btn);
        keyEl.appendChild(li);
      });
    }
  }

  /* ----------------------- SCHOOL PAGE (per location) ------------- */
  function getSchoolBySlug(slug) {
    return cfg.locations.items.find(l => l.slug === slug) || null;
  }

  function getSchoolContent(slug) {
    const sp = cfg.schoolPage || {};
    const defaults = sp.defaults || {};
    const overrides = (sp.perSchool && sp.perSchool[slug]) || {};
    return Object.assign({}, defaults, overrides);
  }

  // Holds the timer for the school hero auto-sliding reel so route changes
  // don't leak stacked intervals.
  let schoolReelTimer = null;

  function startSchoolHeroReel(reelEl) {
    if (schoolReelTimer) { clearInterval(schoolReelTimer); schoolReelTimer = null; }
    if (!reelEl) return;
    const slides = Array.from(reelEl.querySelectorAll(".school-hero-slide"));
    if (slides.length < 2) {
      slides.forEach(s => s.classList.add("is-active"));
      return;
    }
    let i = 0;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === 0));
    schoolReelTimer = setInterval(() => {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 4200);
  }

  /* Per-campus Drive-powered gallery. Reads cfg.schoolGallery.folders[slug],
     lists the sub-folders inside that parent folder, and renders one section
     per sub-folder with the images as a horizontal slider. No filenames shown;
     clicking any image opens the on-site lightbox. The lightbox is shared
     with the static Campus Photos slider — `currentLightboxImages` is
     re-populated on each click so navigation stays scoped to the slider the
     user actually clicked. */
  let currentLightboxImages = [];   // array of { src } — full-size URLs
  let currentLightboxIndex  = 0;

  async function renderSchoolGallery(slug, school) {
    const host = document.getElementById("schoolGallery");
    const section = host && host.closest('[data-module="school-page.gallery"]');
    if (!host || !section) return;

    host.innerHTML = "";

    const cfgGal = cfg.schoolGallery;
    const folderUrl = cfgGal && cfgGal.folders ? cfgGal.folders[slug] : null;

    // No folder configured yet → hide the section quietly. Once a URL is
    // pasted into site-config.js for this school, it appears automatically.
    if (!cfgGal || !cfgGal.enabled || !folderUrl) {
      section.style.display = "none";
      return;
    }

    const apiKey = cfgGal.apiKey || (cfg.resources && cfg.resources.googleApiKey);
    const parentId = driveFolderIdFromUrl(folderUrl);
    if (!apiKey || !parentId) {
      section.style.display = "none";
      return;
    }

    section.style.display = "";
    // Friendly loading state — replaces itself once the fetch resolves
    host.appendChild(el("p", { class: "school-gallery-loading muted" }, "Loading the latest photos…"));

    let subfolders;
    try {
      subfolders = await fetchDriveSubfolders(parentId, apiKey);
    } catch (err) {
      host.innerHTML = "";
      host.appendChild(el("p", { class: "school-gallery-error muted" },
        "We couldn't load the gallery just now. Check back soon."));
      console.error("[schoolGallery] failed to list subfolders:", err);
      return;
    }

    if (!subfolders.length) {
      // No sections found — fall back to listing images directly in the parent
      try {
        const flatImages = await fetchDriveFolderImages(parentId, apiKey);
        host.innerHTML = "";
        if (!flatImages.length) {
          section.style.display = "none";
          return;
        }
        host.appendChild(renderGallerySection(cfgGal.fallbackSectionLabel || "Photos", flatImages));
        return;
      } catch (err) {
        host.innerHTML = "";
        host.appendChild(el("p", { class: "school-gallery-error muted" },
          "We couldn't load the gallery just now. Check back soon."));
        console.error("[schoolGallery] failed to list images:", err);
        return;
      }
    }

    // Render each subfolder as its own section. Fetch images in parallel.
    host.innerHTML = "";
    const sectionsPromise = subfolders.map(async folder => {
      try {
        const images = await fetchDriveFolderImages(folder.id, apiKey);
        return { name: folder.name, images };
      } catch (err) {
        console.error("[schoolGallery] failed to list images in folder " + folder.name + ":", err);
        return { name: folder.name, images: [] };
      }
    });
    const sections = await Promise.all(sectionsPromise);
    sections.forEach(s => {
      if (s.images && s.images.length) {
        host.appendChild(renderGallerySection(s.name, s.images));
      }
    });
    if (!host.children.length) {
      // Subfolders existed but none had images — hide
      section.style.display = "none";
      return;
    }
  }

  /* Build a single gallery section: heading + horizontal-slider grid.
     Images are rendered with Drive thumbnail URLs, no filenames. Clicking
     any tile opens the shared lightbox scoped to this section's images. */
  function renderGallerySection(label, images) {
    const block = el("div", { class: "school-gallery-section" });
    block.appendChild(el("h3", { class: "school-gallery-section-title" }, label || "Photos"));
    const slider = el("div", { class: "school-gallery-slider", role: "region", "aria-label": label || "Photos" });
    // Full-size URLs for this section — scoped so the lightbox prev/next
    // navigation only steps through this section's images.
    const sectionSrcs = images.map(img => ({ src: driveThumbnailUrl(img.id, 2000) }));
    images.forEach((img, i) => {
      const tile = el("button", {
        type: "button",
        class: "school-gallery-tile",
        "aria-label": "Open larger view",
      });
      tile.appendChild(el("img", {
        src: driveThumbnailUrl(img.id, 800),
        alt: "",
        loading: "lazy",
        decoding: "async",
      }));
      tile.addEventListener("click", () => openLightboxWith(sectionSrcs, i));
      slider.appendChild(tile);
    });
    block.appendChild(slider);
    return block;
  }

  /* Open the lightbox with a specific image list + starting index. */
  function openLightboxWith(images, index) {
    currentLightboxImages = images || [];
    currentLightboxIndex  = Math.max(0, Math.min(index || 0, currentLightboxImages.length - 1));
    openGalleryLightbox();
  }

  function openGalleryLightbox() {
    const modal = document.getElementById("galleryLightbox");
    const img   = document.getElementById("galleryLightboxImg");
    if (!modal || !img || !currentLightboxImages[currentLightboxIndex]) return;
    img.src = currentLightboxImages[currentLightboxIndex].src;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }
  function closeGalleryLightbox() {
    const modal = document.getElementById("galleryLightbox");
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => { modal.hidden = true; }, 200);
    document.body.style.overflow = "";
  }
  function stepGalleryLightbox(delta) {
    if (!currentLightboxImages.length) return;
    const n = currentLightboxImages.length;
    currentLightboxIndex = (currentLightboxIndex + delta + n) % n;
    const img = document.getElementById("galleryLightboxImg");
    if (img) img.src = currentLightboxImages[currentLightboxIndex].src;
  }

  function initGalleryLightbox() {
    const modal = document.getElementById("galleryLightbox");
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target.matches("[data-lightbox-close]")) closeGalleryLightbox();
    });
    document.getElementById("galleryLightboxPrev")?.addEventListener("click", (e) => { e.stopPropagation(); stepGalleryLightbox(-1); });
    document.getElementById("galleryLightboxNext")?.addEventListener("click", (e) => { e.stopPropagation(); stepGalleryLightbox(1); });
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape")     closeGalleryLightbox();
      if (e.key === "ArrowLeft")  stepGalleryLightbox(-1);
      if (e.key === "ArrowRight") stepGalleryLightbox(1);
    });
  }

  function renderSchoolPage(slug) {
    const school = getSchoolBySlug(slug);
    if (!school) return false;
    const content = getSchoolContent(slug);

    // Token substitution: any {name} or {city} in the placeholder text becomes
    // school-specific automatically, so each page reads personalized.
    const t = (str) => (str || "")
      .replace(/\{name\}/g, school.name || "")
      .replace(/\{city\}/g, school.city || "your city");

    // Conversion hero (home-page value prop pinned inside the campus hero so
    // visitors landing directly here still see the broad pitch + CTAs)
    renderSchoolConversionHero();
    renderSchoolHeroPathways(school);
    startSchoolHeadlineRotator();

    // Per-campus photo gallery, sectioned by Drive sub-folder name. Async —
    // the section initially shows a "loading…" line and replaces itself when
    // the Drive API call resolves. Hides itself if no folder is configured.
    renderSchoolGallery(slug, school);

    // Hero — campus identifier (city + name + address). Director name /
    // phone / email used to be rendered here; they now live in the
    // Director Message and Contact modules lower on the page.
    $("#schoolEyebrow").textContent = school.city ? school.city.toUpperCase() + " · CAMPUS" : "CAMPUS";
    $("#schoolName").textContent = school.name;
    $("#schoolAddress").innerHTML = formatAddressTwoLine(school.address);
    const applyUrl = cfg.brand.applyUrl;
    const applyExternal = /^https?:\/\//i.test(applyUrl);
    ["schoolApply", "schoolCtaApply"].forEach(id => {
      const node = document.getElementById(id);
      if (!node) return;
      node.href = applyUrl;
      if (applyExternal) { node.target = "_blank"; node.rel = "noopener"; }
    });
    $("#schoolDirections").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(school.address);

    // Auto-sliding photo reel that lives INSIDE the navy hero header.
    // When a campus has no photos of its own yet, fall back to the generic
    // Career Prep "Student Life" hero + a couple of pathway photos so the
    // banner never reads as empty.
    const heroReel = $("#schoolHeroReel");
    if (heroReel) {
      heroReel.innerHTML = "";
      let photos = Array.isArray(content.photos) ? content.photos.slice() : [];
      if (!photos.length) {
        photos = [
          "Student Life.jpg",
          "medical program.jpg",
          "construction.jpg",
          "hospitality.jpg",
        ];
      }
      photos.forEach(src => {
        const slide = el("div", { class: "school-hero-slide" });
        slide.style.backgroundImage = "url('" + encodeURI(src) + "')";
        heroReel.appendChild(slide);
      });
      startSchoolHeroReel(heroReel);
    }

    // Director — prefer per-school override, fall back to the school's `director` field
    const directorDisplay = content.directorName && !content.directorName.includes("[")
      ? content.directorName
      : (school.director || t(content.directorName));
    const dirHeading = $("#schoolDirectorHeading");
    if (dirHeading) dirHeading.textContent = "A message from " + (directorDisplay || "your campus director");
    $("#schoolDirectorName").textContent = directorDisplay;
    const dmsg = $("#schoolDirectorMessage");
    dmsg.innerHTML = "";
    dmsg.appendChild(el("p", { class: "lead" }, t(content.directorMessage)));
    const photoWrap = $("#schoolDirectorPhotoWrap");
    photoWrap.innerHTML = "";
    if (content.directorPhotoUrl) {
      photoWrap.appendChild(el("img", { src: content.directorPhotoUrl, alt: content.directorName }));
    } else {
      photoWrap.appendChild(el("div", { class: "placeholder-tag" }, "Director photo"));
    }

    // Unique — heading is now "[Campus Name] is unique because…" and the
    // body splits into a punchy "lead" (first two sentences, bold + large)
    // followed by the rest behind a Read-more toggle.
    const uniqHeading = $("#schoolUniqueHeading");
    if (uniqHeading) uniqHeading.textContent = (school.name || "This campus") + " is unique because…";

    const uniq = $("#schoolUnique");
    uniq.innerHTML = "";
    uniq.classList.add("is-collapsed");
    const fullText = String(t(content.uniqueText) || "").trim();
    // Sentence split: any [.!?] followed by whitespace ends a sentence.
    const sentences = fullText.split(/(?<=[.!?])\s+/).filter(Boolean);
    const leadText  = sentences.slice(0, 2).join(" ").trim();
    const tailText  = sentences.slice(2).join(" ").trim();
    if (leadText) {
      uniq.appendChild(el("p", { class: "unique-lead" }, leadText));
    }
    if (tailText) {
      uniq.appendChild(el("p", { class: "unique-tail" }, tailText));
    }

    const uniqToggle = $("#schoolUniqueToggle");
    if (uniqToggle) {
      const needsToggle = tailText.length > 0;
      uniqToggle.style.display = needsToggle ? "" : "none";
      if (needsToggle) {
        uniqToggle.setAttribute("aria-expanded", "false");
        uniqToggle.textContent = "Read more ↓";
        uniqToggle.onclick = () => {
          const collapsed = uniq.classList.toggle("is-collapsed");
          uniqToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
          uniqToggle.textContent = collapsed ? "Read more ↓" : "Show less ↑";
        };
      } else {
        // No "more" text — show whatever lead exists, no toggle needed.
        uniq.classList.remove("is-collapsed");
      }
    }

    // Static Campus Photos — capped at 8, rendered as a horizontal slider,
    // each tile is clickable to enlarge in the shared lightbox.
    const reelGrid = $("#schoolPhotoReel");
    if (reelGrid) {
      reelGrid.innerHTML = "";
      const allPhotos = Array.isArray(content.photos) ? content.photos : [];
      const photos = allPhotos.slice(0, 8);   // cap at 8 per request
      if (photos.length) {
        const photoSrcs = photos.map(src => ({ src }));
        photos.forEach((src, i) => {
          const tile = el("button", { type: "button", class: "photo-tile", "aria-label": "Open larger view" });
          tile.appendChild(el("img", { src, alt: "", loading: "lazy", decoding: "async" }));
          tile.addEventListener("click", () => openLightboxWith(photoSrcs, i));
          reelGrid.appendChild(tile);
        });
      } else {
        for (let i = 0; i < 3; i++) {
          reelGrid.appendChild(el("div", { class: "photo-tile photo-placeholder" },
            el("div", { class: "placeholder-tag" }, "Photo " + (i + 1)),
            el("span", {}, t(content.photosPlaceholderText))
          ));
        }
      }
    }

    // Student testimonials (per-campus) — only render if any exist
    const testWrap = $("#schoolTestimonials");
    const testSection = testWrap && testWrap.closest('[data-module="school-page.testimonials"]');
    if (testWrap) {
      testWrap.innerHTML = "";
      const items = Array.isArray(content.testimonials) ? content.testimonials : [];
      if (items.length === 0) {
        if (testSection) testSection.style.display = "none";
      } else {
        if (testSection) testSection.style.display = "";
        items.forEach(tm => {
          testWrap.appendChild(el("blockquote", { class: "school-testimonial" },
            el("p", { class: "school-testimonial-quote" }, tm.quote),
            el("footer", { class: "school-testimonial-attr" }, tm.name)
          ));
        });
      }
    }

    // Pathways at this campus — render as pills linking back to the pathways page
    const pwWrap = $("#schoolPathways");
    pwWrap.innerHTML = "";
    const pathwaySlugs = school.pathways || [];
    if (pathwaySlugs.length === 0) {
      pwWrap.appendChild(el("p", { class: "muted" }, "Pathway details for this campus coming soon."));
    } else {
      pathwaySlugs.forEach(pSlug => {
        const p = (cfg.pathways.items || []).find(x => x.slug === pSlug);
        if (!p) return;
        pwWrap.appendChild(el("a", {
          href: "#pathways",
          class: "pathway-pill",
        },
          el("span", { class: "pathway-pill-title" }, p.title),
          el("span", { class: "pathway-pill-arrow", "aria-hidden": "true" }, "→")
        ));
      });
    }

    // Calendar — single download button (PDF preferred, falls back to image
    // or any calendar URL the campus has set). No inline preview — keeps
    // every campus page light and consistent.
    const cal = $("#schoolCalendar");
    cal.innerHTML = "";
    const calUrl = content.calendarPdfUrl || content.calendarImageUrl || content.calendarUrl || null;
    if (calUrl) {
      const card = el("div", { class: "calendar-download-card" });
      card.appendChild(el("div", { class: "calendar-download-icon", "aria-hidden": "true",
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
      }));
      const text = el("div", { class: "calendar-download-text" });
      text.appendChild(el("strong", {}, school.name + " school calendar"));
      text.appendChild(el("span", {}, "Grab the full year at a glance."));
      card.appendChild(text);
      const dl = el("a", {
        class: "btn btn-primary btn-pop calendar-download-btn",
        href: calUrl,
        download: "",
        target: "_blank",
        rel: "noopener",
      });
      dl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true" style="margin-right:8px;vertical-align:-3px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download calendar';
      card.appendChild(dl);
      cal.appendChild(card);
    } else {
      cal.appendChild(el("div", { class: "calendar-download-card is-placeholder" },
        el("div", { class: "calendar-download-icon", "aria-hidden": "true",
          html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        }),
        el("div", { class: "calendar-download-text" },
          el("strong", {}, school.name + " school calendar — coming soon"),
          el("span", {}, t(content.calendarPlaceholderText))
        )
      ));
    }

    // Contact — slim rectangular module: copy on the left, contact rows on
    // the right. Stacks on mobile via the CSS grid.
    const contact = $("#schoolContact");
    contact.innerHTML = "";
    const contactLeft = el("div", { class: "campus-contact-left" });
    contactLeft.appendChild(el("span", { class: "eyebrow" }, "Contact this campus"));
    contactLeft.appendChild(el("h2", { class: "campus-contact-headline" }, "Talk to an enrollment specialist at " + school.name));
    contactLeft.appendChild(el("p", { class: "campus-contact-blurb" }, t(content.contactBlurb)));
    const contactCta = el("div", { class: "campus-contact-cta" });
    contactCta.appendChild(el("a", {
      class: "btn btn-primary btn-pop",
      href: applyUrl,
      target: applyExternal ? "_blank" : null,
      rel: applyExternal ? "noopener" : null,
    }, "Apply Now"));
    contactCta.appendChild(el("a", {
      class: "btn btn-outline",
      href: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(school.address),
      target: "_blank", rel: "noopener",
    }, "Get directions"));
    contactLeft.appendChild(contactCta);
    contact.appendChild(contactLeft);

    const contactGrid = el("div", { class: "campus-contact-grid" });
    contactGrid.appendChild(el("div", { class: "contact-item" },
      el("span", { class: "contact-label" }, "Address"),
      el("span", {}, school.address)
    ));
    contactGrid.appendChild(el("div", { class: "contact-item" },
      el("span", { class: "contact-label" }, "Phone"),
      el("a", { href: "tel:" + school.phone.replace(/[^0-9]/g, "") }, school.phone)
    ));
    if (school.email) {
      contactGrid.appendChild(el("div", { class: "contact-item" },
        el("span", { class: "contact-label" }, "Email"),
        el("a", { href: "mailto:" + school.email }, school.email)
      ));
    }
    contact.appendChild(contactGrid);

    // Pain points — same list as the home page, rendered into the campus copy.
    if (cfg.painPoints) {
      const pp = cfg.painPoints;
      const eb = $("#schoolPainPointsEyebrow"); if (eb) eb.textContent = pp.eyebrow || "";
      const hd = $("#schoolPainPointsHeadline"); if (hd) hd.textContent = pp.headline || "";
      const bd = $("#schoolPainPointsBody");     if (bd) bd.textContent = pp.body || "";
      const grid = $("#schoolPainPointsGrid");
      if (grid) {
        grid.innerHTML = "";
        (pp.items || []).forEach(item => {
          const card = el("div", { class: "pain-card" });
          card.appendChild(el("span", { class: "pain-icon", "aria-hidden": "true" }, item.icon || "•"));
          card.appendChild(el("p", { class: "pain-problem" }, item.problem));
          card.appendChild(el("p", { class: "pain-promise" }, item.promise));
          grid.appendChild(card);
        });
      }
    }

    // Comparison chart — same content as the Why We're Different page.
    if (cfg.comparison) {
      const c = cfg.comparison;
      const splitMatch = (c.headline || "").match(/^(.+?)\s+vs\s+(.+)$/i);
      const headlineEl = $("#schoolCompareHeadline");
      if (headlineEl) {
        if (splitMatch) {
          headlineEl.innerHTML = "";
          headlineEl.appendChild(el("span", { class: "ch-trad" }, splitMatch[1]));
          headlineEl.appendChild(el("span", { class: "ch-vs" }, " vs "));
          headlineEl.appendChild(el("span", { class: "ch-cp" }, splitMatch[2]));
        } else {
          headlineEl.textContent = c.headline || "";
        }
      }
      const head = $("#schoolCompareHead");
      if (head) {
        head.innerHTML = "";
        head.appendChild(el("th", {}, ""));
        (c.columns || []).forEach(col => head.appendChild(el("th", { class: col.accent ? "accent" : "" }, col.label)));
      }
      const body = $("#schoolCompareBody");
      if (body) {
        body.innerHTML = "";
        (c.rows || []).forEach(row => {
          body.appendChild(el("tr", {},
            el("td", { class: "trait" }, row.trait),
            el("td", { class: "trad" }, row.traditional),
            el("td", { class: "cp" }, row.cp)
          ));
        });
      }
    }

    // Wraparound services circle — same ecosystem the home page uses.
    const ecoHost = $("#schoolEcosystem");
    if (ecoHost) {
      ecoHost.innerHTML = "";
      const offerings = (cfg.studentLife && cfg.studentLife.offerings) || [];
      const total = offerings.length;
      offerings.forEach((o, i) => {
        ecoHost.appendChild(el("li", {
          class: "ecosystem-node",
          style: "--i:" + i + ";--total:" + total + ";",
        },
          el("span", { class: "offering-badge" + (i % 2 ? " is-navy" : "") }, String(i + 1)),
          el("h4", {}, o.title),
          el("p", { class: "muted" }, o.body)
        ));
      });
      ecoHost.appendChild(el("div", { class: "ecosystem-hub" },
        el("span", { class: "ecosystem-hub-label" }, "Wraparound support"),
        el("span", { class: "ecosystem-hub-sub" }, "Every student")
      ));
    }

    // Mountain graph — same 4-step climb the home page renders.
    if (cfg.howItWorks) {
      const hiw = cfg.howItWorks;
      const eb = $("#schoolHiwEyebrow"); if (eb) eb.textContent = hiw.eyebrow || "";
      const hd = $("#schoolHiwHeadline"); if (hd) hd.textContent = hiw.headline || "Make the Climb Toward Your Diploma";
      const sub = $("#schoolHiwSub"); if (sub) sub.textContent = hiw.sub || "";
      const stepsHost = $("#schoolHiwSteps");
      if (stepsHost) {
        stepsHost.innerHTML = "";
        const steps = hiw.steps || [];
        const total = steps.length;
        steps.forEach((s, i) => {
          const li = el("li", {
            class: "mtn-item hiw-mtn-item",
            tabindex: "0",
            role: "button",
            "aria-label": (s.title || ("Step " + (i + 1))) + " — tap for details",
            style: "--i:" + i + ";--total:" + total + ";--delay:" + (0.2 + i * 0.25) + "s;",
          });
          li.appendChild(el("span", { class: "mtn-num" }, s.num || String(i + 1)));
          const body = el("div", { class: "hiw-mtn-body" });
          body.appendChild(el("strong", { class: "hiw-mtn-title" }, s.title));
          body.appendChild(el("p", {}, s.body));
          li.appendChild(body);
          stepsHost.appendChild(li);
        });
      }
      const mtn = document.querySelector('#school-page .hiw-mountain');
      if (mtn) {
        mtn.classList.remove("is-climbing");
        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                mtn.classList.add("is-climbing");
                io.disconnect();
              }
            });
          }, { threshold: 0.25 });
          io.observe(mtn);
        } else {
          mtn.classList.add("is-climbing");
        }
      }
    }

    return true;
  }

  /* ----------------------- LOCATION FINDER ------------------------ */
  // Haversine distance in miles
  function distanceMiles(a, b) {
    const toRad = d => d * Math.PI / 180;
    const R = 3958.8;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  function geocodeAddress(query) {
    // Free, no-key OpenStreetMap geocoding. Bias to USA for relevance.
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=" + encodeURIComponent(query);
    return fetch(url, { headers: { "Accept": "application/json" } })
      .then(r => r.json())
      .then(arr => {
        if (!Array.isArray(arr) || !arr.length) return null;
        return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon), label: arr[0].display_name };
      });
  }

  function showFinderResults(origin, originLabel) {
    const f = cfg.locations.finder;
    const ranked = cfg.locations.items
      .filter(s => s.coords)
      .map(s => ({ school: s, miles: distanceMiles(origin, s.coords) }))
      .sort((a, b) => a.miles - b.miles);

    const status = $("#finderStatus");
    status.classList.remove("is-loading", "is-error");
    status.textContent = originLabel ? "Showing results near " + originLabel : "";

    const out = $("#finderResults");
    out.innerHTML = "";
    ranked.forEach((r, i) => {
      const dirHref = "https://www.google.com/maps/dir/?api=1&origin=" +
        encodeURIComponent(origin.lat + "," + origin.lng) +
        "&destination=" + encodeURIComponent(r.school.address);
      // Name links to the school's dedicated page if it has a slug
      const nameNode = r.school.slug
        ? el("a", { href: "#" + r.school.slug, class: "name" }, r.school.name)
        : el("div", { class: "name" }, r.school.name);
      const actions = el("div", { class: "actions" });
      if (r.school.slug) {
        actions.appendChild(el("a", { class: "btn btn-outline btn-sm", href: "#" + r.school.slug }, "View campus"));
      }
      actions.appendChild(el("a", { class: "btn btn-outline btn-sm", href: dirHref, target: "_blank", rel: "noopener" }, "Directions"));
      actions.appendChild(el("a", { class: "btn btn-primary btn-sm", href: "tel:" + r.school.phone.replace(/[^0-9]/g, "") }, "Call"));

      const li = el("li", { class: i === 0 ? "nearest" : "" },
        el("span", { class: "rank" }, String(i + 1)),
        el("div", {},
          nameNode,
          el("div", { class: "meta" }, r.school.address)
        ),
        el("span", { class: "dist" }, r.miles.toFixed(1) + " mi"),
        actions
      );
      out.appendChild(li);
    });
  }

  function renderFinder() {
    const f = cfg.locations.finder;
    if (!f) return;
    $("#finderEyebrow").textContent = f.eyebrow || "";
    $("#finderTitle").textContent = f.title || "";
    $("#finderSub").textContent = f.sub || "";
    const input = $("#finderInput");
    input.placeholder = f.placeholder || "";
    $("#finderSubmit").textContent = f.submitLabel || "Find";
    $("#finderUseLocation").textContent = f.useLocationLabel || "Use my location";

    const status = $("#finderStatus");
    const setLoading = msg => { status.className = "finder-status is-loading"; status.textContent = msg; };
    const setError   = msg => { status.className = "finder-status is-error"; status.textContent = msg; };
    const clear      = ()  => { status.className = "finder-status"; status.textContent = ""; };

    $("#finderForm").addEventListener("submit", e => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      setLoading("Looking up that address…");
      geocodeAddress(q).then(origin => {
        if (!origin) { setError(f.noResultsMessage); $("#finderResults").innerHTML = ""; return; }
        showFinderResults({ lat: origin.lat, lng: origin.lng }, q);
      }).catch(() => setError(f.errorMessage));
    });

    $("#finderUseLocation").addEventListener("click", () => {
      if (!navigator.geolocation) { setError("Your browser doesn't support location."); return; }
      setLoading("Getting your location…");
      navigator.geolocation.getCurrentPosition(
        pos => showFinderResults({ lat: pos.coords.latitude, lng: pos.coords.longitude }, "your current location"),
        err => setError(err.code === 1 ? "Location permission denied. Try entering an address instead." : f.errorMessage),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  /* ----------------------- START TODAY ---------------------------- */
  function loadHubspotForm(embed, targetSelector, fallbackUrl, fallbackNode) {
    const create = () => {
      try {
        if (window.hbspt && window.hbspt.forms) {
          window.hbspt.forms.create({
            portalId: embed.portalId,
            formId: embed.formId,
            region: embed.region || "na1",
            target: targetSelector,
          });
          return;
        }
      } catch (e) { /* fall through to fallback */ }
      showFallback();
    };
    const showFallback = () => {
      if (!fallbackUrl || !fallbackNode) return;
      fallbackNode.innerHTML = "";
      fallbackNode.appendChild(el("a", {
        class: "btn btn-outline",
        href: fallbackUrl,
        target: "_blank",
        rel: "noopener",
      }, "Open the interest form →"));
    };

    if (window.hbspt) { create(); return; }
    const existing = document.querySelector('script[src*="js.hsforms.net"]');
    if (existing) {
      existing.addEventListener("load", create);
      existing.addEventListener("error", showFallback);
      return;
    }
    const sc = document.createElement("script");
    sc.src = "https://js.hsforms.net/forms/embed/v2.js";
    sc.charset = "utf-8";
    sc.onload = create;
    sc.onerror = showFallback;
    document.head.appendChild(sc);
  }

  function renderStart() {
    const s = cfg.start;
    $("#startEyebrow").textContent = s.eyebrow || "";
    if (!s.eyebrow) $("#startEyebrow").style.display = "none";
    $("#startHeadline").textContent = s.headline;
    const sub = $("#startSubheadline");
    if (sub) sub.textContent = s.subheadline || "";
    $("#startBody").textContent = s.body;

    if (s.alwaysOpen) {
      const banner = $("#startAlwaysOpen");
      banner.innerHTML = "";
      banner.appendChild(el("span", { class: "always-open-icon", "aria-hidden": "true" }, "✓"));
      banner.appendChild(el("span", {}, s.alwaysOpen));
    }

    // 3-step process
    const steps = $("#startSteps");
    steps.innerHTML = "";
    s.process.forEach(p => {
      const step = el("div", { class: "step" });
      step.appendChild(el("span", { class: "num" }, p.step));
      step.appendChild(el("h3", {}, p.title));
      step.appendChild(el("p", { class: "muted" }, p.body));
      steps.appendChild(step);
    });

    // Apply block: copy is rendered from config; the HubSpot v3 embed div has
    // its data attributes baked into HTML so the loader script can pick it up
    // on page load (avoids race conditions with deferred scripts).
    if (s.apply) {
      $("#applyEyebrow").textContent = s.apply.eyebrow || "";
      $("#applyTitle").textContent   = s.apply.title || "";
      $("#applyBody").textContent    = s.apply.body || "";
    }

    // Quiet interest nudge link (intentionally less prominent than Apply)
    if (s.interestNudge) {
      const nudge = $("#interestNudgeLink");
      nudge.textContent = s.interestNudge.label || "Not ready yet?";
      nudge.href = s.interestNudge.href || "#interest-form";
    }
  }

  /* ----------------------- INTEREST FORM PAGE --------------------- */
  function renderInterestForm() {
    const i = cfg.interestForm;
    if (!i) return;
    $("#interestEyebrow").textContent = i.eyebrow || "";
    $("#interestHeadline").textContent = i.headline || "";
    $("#interestBody").textContent = i.body || "";
    // Form renders automatically from the .hs-form-frame div in HTML
    // (data attributes are baked in; v3 loader script in <head> picks it up).
    if (i.secondaryCta) {
      const sc = $("#interestSecondaryCta");
      sc.textContent = i.secondaryCta.label || "";
      sc.href = i.secondaryCta.href || "#start";
    }
  }

  /* ----------------------- TESTIMONIALS PAGE ---------------------- */
  function renderTestimonials() {
    const t = cfg.testimonials;
    if (!t) return;
    $("#testimonialsEyebrow").textContent = t.eyebrow || "";
    $("#testimonialsHeadline").textContent = t.headline || "";
    $("#testimonialsBody").textContent = t.body || "";
    const grid = $("#testimonialsGrid");
    grid.innerHTML = "";
    (t.videos || []).forEach(v => {
      const card = el("div", { class: "testimonial-card" });
      const frame = el("div", { class: "video-frame" });
      if (v.embedUrl) {
        frame.appendChild(el("iframe", {
          src: v.embedUrl,
          title: v.title || "Student testimonial",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "",
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        }));
      } else {
        const ph = el("div", { class: "video-placeholder" });
        ph.appendChild(el("div", { class: "placeholder-tag" }, "Placeholder"));
        ph.appendChild(el("div", { class: "play-icon", "aria-hidden": "true" }, "▶"));
        ph.appendChild(el("strong", {}, "Coming soon"));
        ph.appendChild(el("span", {}, t.placeholderCaption || ""));
        frame.appendChild(ph);
      }
      card.appendChild(frame);
      const meta = el("div", { class: "testimonial-meta" });
      meta.appendChild(el("h3", {}, v.title || ""));
      if (v.campus) meta.appendChild(el("p", { class: "muted" }, v.campus));
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  /* ----------------------- GRADUATES PAGE ------------------------- */
  /* Sub-page of Student Life. Three modules: graduation component, before
     & after stories, and where-are-they-now alumni. All copy/photos here
     come from cfg.graduates — drop real content into site-config.js and
     the renderer reflects it 1:1. */
  function renderGraduates() {
    const g = cfg.graduates;
    if (!g) return;

    // Intro
    if (g.intro) {
      const eb = $("#gradIntroEyebrow");   if (eb) eb.textContent = g.intro.eyebrow  || "";
      const hd = $("#gradIntroHeadline");  if (hd) hd.textContent = g.intro.headline || "";
      const bd = $("#gradIntroBody");      if (bd) bd.textContent = g.intro.body     || "";
    }

    // Graduation component piece
    if (g.graduation) {
      const gr = g.graduation;
      const eb = $("#gradGraduationEyebrow");   if (eb) eb.textContent = gr.eyebrow  || "";
      const hd = $("#gradGraduationHeadline");  if (hd) hd.textContent = gr.headline || "";
      const bd = $("#gradGraduationBody");      if (bd) bd.textContent = gr.body     || "";
      const cl = $("#gradCeremonyList");
      if (cl) {
        cl.innerHTML = "";
        (gr.ceremonyDetails || []).forEach(d => {
          const li = el("li", { class: "grad-ceremony-item" });
          li.appendChild(el("span", { class: "grad-ceremony-label" }, d.label || ""));
          li.appendChild(el("span", { class: "grad-ceremony-value" }, d.value || ""));
          cl.appendChild(li);
        });
      }
      const photosWrap = $("#gradGraduationPhotos");
      const photosPlaceholder = $("#gradGraduationPhotosPlaceholder");
      if (photosWrap) {
        // Drop existing photos in (if any) — render a reel
        const photos = Array.isArray(gr.photos) ? gr.photos : [];
        // Clear everything except the placeholder text node
        Array.from(photosWrap.querySelectorAll("img")).forEach(n => n.remove());
        if (photos.length) {
          if (photosPlaceholder) photosPlaceholder.style.display = "none";
          photos.forEach(src => {
            photosWrap.appendChild(el("img", { src, alt: "Graduation photo", class: "grad-photo", loading: "lazy" }));
          });
        } else {
          if (photosPlaceholder) {
            photosPlaceholder.style.display = "";
            photosPlaceholder.textContent = gr.photosPlaceholderText || "Graduation photos will appear here.";
          }
        }
      }
    }

    // Before & After
    if (g.beforeAfter) {
      const ba = g.beforeAfter;
      const eb = $("#gradBeforeAfterEyebrow");   if (eb) eb.textContent = ba.eyebrow  || "";
      const hd = $("#gradBeforeAfterHeadline");  if (hd) hd.textContent = ba.headline || "";
      const bd = $("#gradBeforeAfterBody");      if (bd) bd.textContent = ba.body     || "";
      const grid = $("#gradBeforeAfterGrid");
      if (grid) {
        grid.innerHTML = "";
        (ba.stories || []).forEach(s => {
          const card = el("article", { class: "grad-story" + (s.placeholder ? " is-placeholder" : "") });
          if (s.photoUrl) {
            card.appendChild(el("img", { class: "grad-story-photo", src: s.photoUrl, alt: s.name || "Student photo", loading: "lazy" }));
          } else {
            card.appendChild(el("div", { class: "grad-story-photo-placeholder" },
              el("span", { class: "placeholder-tag", style: "position:static;" }, "Photo placeholder")
            ));
          }
          const body = el("div", { class: "grad-story-body" });
          body.appendChild(el("h3", { class: "grad-story-name" }, s.name || ""));
          if (s.campus) body.appendChild(el("p", { class: "grad-story-campus muted" }, s.campus));
          const ba2 = el("div", { class: "grad-story-ba" });
          ba2.appendChild(el("div", { class: "grad-story-before" },
            el("span", { class: "grad-story-label" }, "Before"),
            el("p", {}, s.before || "")
          ));
          ba2.appendChild(el("div", { class: "grad-story-after" },
            el("span", { class: "grad-story-label" }, "After"),
            el("p", {}, s.after || "")
          ));
          body.appendChild(ba2);
          card.appendChild(body);
          grid.appendChild(card);
        });
      }
    }

    // Where Are They Now?
    if (g.whereNow) {
      const wn = g.whereNow;
      const eb = $("#gradWhereNowEyebrow");   if (eb) eb.textContent = wn.eyebrow  || "";
      const hd = $("#gradWhereNowHeadline");  if (hd) hd.textContent = wn.headline || "";
      const bd = $("#gradWhereNowBody");      if (bd) bd.textContent = wn.body     || "";
      const grid = $("#gradWhereNowGrid");
      if (grid) {
        grid.innerHTML = "";
        (wn.alumni || []).forEach(a => {
          const card = el("article", { class: "grad-alum" + (a.placeholder ? " is-placeholder" : "") });
          if (a.photoUrl) {
            card.appendChild(el("img", { class: "grad-alum-photo", src: a.photoUrl, alt: a.name || "Alum photo", loading: "lazy" }));
          } else {
            card.appendChild(el("div", { class: "grad-alum-photo-placeholder" },
              el("span", { class: "placeholder-tag", style: "position:static;" }, "Photo placeholder")
            ));
          }
          const body = el("div", { class: "grad-alum-body" });
          body.appendChild(el("h3", { class: "grad-alum-name" }, a.name || ""));
          const meta = [a.gradYear ? `Class of ${a.gradYear}` : null, a.campus].filter(Boolean).join(" · ");
          if (meta) body.appendChild(el("p", { class: "grad-alum-meta muted" }, meta));
          if (a.path)  body.appendChild(el("p", { class: "grad-alum-path"  }, a.path));
          if (a.quote) body.appendChild(el("blockquote", { class: "grad-alum-quote" }, a.quote));
          card.appendChild(body);
          grid.appendChild(card);
        });
      }
    }
  }

  /* ----------------------- FAQ PAGE ------------------------------- */
  function renderFaq() {
    const f = cfg.faq;
    if (!f) return;
    $("#faqEyebrow").textContent = f.eyebrow || "";
    $("#faqHeadline").textContent = f.headline || "";
    $("#faqBody").textContent = f.body || "";
    const list = $("#faqList");
    list.innerHTML = "";
    (f.items || []).forEach(item => {
      const d = el("details", {});
      d.appendChild(el("summary", {}, item.q));
      d.appendChild(el("div", { class: "a" }, item.a));
      list.appendChild(d);
    });
  }

  /* ----------------------- RESOURCES ------------------------------ */
  function renderResources() {
    const r = cfg.resources;
    $("#resEyebrow").textContent = r.eyebrow;
    $("#resHeadline").textContent = r.headline;
    $("#resBody").textContent = r.body;
    // FAQ moved to its own page (#faq) — see renderFaq().

    // District-wide docs FIRST
    $("#districtTitle").textContent = r.districtDocs.title;
    $("#districtSub").textContent = r.districtDocs.sub;
    const dd = $("#districtDocs");
    dd.innerHTML = "";
    r.districtDocs.links.forEach(link => {
      dd.appendChild(el("a", { class: "school-tile", href: link.url },
        el("span", { class: "icon" }, "↗"),
        el("span", {},
          el("span", { class: "name", style: "display:block;" }, link.label),
          el("span", { class: "meta" }, link.url === "#" ? "Link not yet wired up" : "Open document")
        )
      ));
    });
    $("#districtNote").textContent = r.districtDocs.note;

    // Per-school docs — with category toggle
    const sdCfg = r.schoolDocs;
    $("#schoolDocsTitle").textContent = sdCfg.title;
    $("#schoolDocsSub").textContent = sdCfg.sub;
    const categories = sdCfg.categories || [];
    let selectedCat = sdCfg.defaultCategory || (categories[0] && categories[0].id);

    const toggleHost = $("#schoolDocsToggle");
    const activeLabel = $("#schoolDocsActiveLabel");
    const tilesHost = $("#schoolDocs");

    const labelFor = (id) => {
      const cat = categories.find(c => c.id === id);
      return cat ? cat.label : "";
    };

    function renderTiles() {
      const catLabel = labelFor(selectedCat);
      activeLabel.textContent = catLabel
        ? "Showing " + catLabel.toLowerCase() + " for each campus. Click a campus to see the files."
        : "";
      tilesHost.innerHTML = "";
      sdCfg.schools.forEach(school => {
        const folderUrl = (school.folders && school.folders[selectedCat]) || "#";
        const linked = folderUrl && folderUrl !== "#";
        const initials = school.name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
        const cityOrNote = school.city || school.note || "";
        const fullTitle = school.name + (cityOrNote ? " · " + cityOrNote : "") + " — " + catLabel;

        // Every tile opens the in-page file list modal — files render inline
        // and visitors download directly. Empty-state tiles get a "coming
        // soon" message in the same modal.
        const tile = el("button", {
          type: "button",
          class: "school-tile" + (linked ? "" : " is-empty"),
          title: fullTitle,
          "aria-label": fullTitle,
        },
          el("span", { class: "icon" }, initials),
          el("span", { class: "school-tile-text" },
            el("span", { class: "name" }, school.name),
            el("span", { class: "meta" }, cityOrNote)
          )
        );
        tile.addEventListener("click", () => openDocModal(school, catLabel, folderUrl));
        tilesHost.appendChild(tile);
      });
    }

    toggleHost.innerHTML = "";
    categories.forEach(cat => {
      const btn = el("button", {
        type: "button",
        class: "doc-toggle-btn" + (cat.id === selectedCat ? " is-active" : ""),
        "data-cat": cat.id,
        role: "tab",
        "aria-selected": cat.id === selectedCat ? "true" : "false",
      }, cat.label);
      btn.addEventListener("click", () => {
        selectedCat = cat.id;
        toggleHost.querySelectorAll(".doc-toggle-btn").forEach(b => {
          const active = b.dataset.cat === selectedCat;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderTiles();
      });
      toggleHost.appendChild(btn);
    });

    renderTiles();
    // Hide the "How to wire up Drive folders" text — visitors don't need to see it
    const howTo = $("#driveHowTo");
    if (howTo) howTo.style.display = "none";
  }

  /* ----------------------- DOCUMENT LIST MODAL -------------------- */
  // Cache the Drive file list per folder ID so reopening the same modal
  // is instant after the first fetch.
  const docListCache = new Map();

  function driveFolderIdFromUrl(url) {
    if (!url || url === "#") return null;
    const m = String(url).match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : null;
  }

  // Friendly file-size formatting (1.2 MB, 360 KB, etc.)
  function formatBytes(n) {
    n = Number(n) || 0;
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
    return (n / 1024 / 1024).toFixed(1) + " MB";
  }

  // Drive mime types we'll preview as a recognizable icon. Anything else
  // gets the generic 📄.
  const MIME_ICON = {
    "application/pdf": "📄",
    "application/vnd.google-apps.document": "📝",
    "application/vnd.google-apps.spreadsheet": "📊",
    "application/vnd.google-apps.presentation": "📽️",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "📝",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "📽️",
    "image/png": "🖼️",
    "image/jpeg": "🖼️",
    "image/webp": "🖼️",
  };
  function iconFor(mime) {
    if (!mime) return "📄";
    if (MIME_ICON[mime]) return MIME_ICON[mime];
    if (mime.startsWith("image/")) return "🖼️";
    if (mime.startsWith("video/")) return "🎬";
    if (mime.startsWith("audio/")) return "🎵";
    return "📄";
  }

  // Build the right download URL for each Drive file. Google Docs/Sheets/
  // Slides need their special export endpoints; regular uploads use the
  // direct download URL. All variants force `Content-Disposition: attachment`
  // so the browser saves the file instead of navigating to Drive.
  function driveDownloadUrl(file) {
    const id = file.id;
    switch (file.mimeType) {
      case "application/vnd.google-apps.document":
        return "https://docs.google.com/document/d/" + id + "/export?format=pdf";
      case "application/vnd.google-apps.spreadsheet":
        return "https://docs.google.com/spreadsheets/d/" + id + "/export?format=xlsx";
      case "application/vnd.google-apps.presentation":
        return "https://docs.google.com/presentation/d/" + id + "/export?format=pdf";
      default:
        return "https://drive.google.com/uc?export=download&id=" + id;
    }
  }

  // Public Drive folder → JSON file listing, no OAuth, just an API key.
  // The folder must be shared "Anyone with the link — Viewer".
  // `supportsAllDrives` + `includeItemsFromAllDrives` so Shared Drive
  // contents are visible too (resources live in a Shared Drive).
  async function fetchDriveFolderFiles(folderId, apiKey) {
    if (docListCache.has(folderId)) return docListCache.get(folderId);
    const url = "https://www.googleapis.com/drive/v3/files"
      + "?q=" + encodeURIComponent("'" + folderId + "' in parents and trashed = false")
      + "&fields=files(id,name,mimeType,size,modifiedTime)"
      + "&orderBy=name"
      + "&pageSize=200"
      + "&supportsAllDrives=true"
      + "&includeItemsFromAllDrives=true"
      + "&key=" + encodeURIComponent(apiKey);
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("Drive API " + res.status + ": " + body.slice(0, 200));
    }
    const data = await res.json();
    const files = Array.isArray(data.files) ? data.files : [];
    docListCache.set(folderId, files);
    return files;
  }

  /* Subfolders of a public Drive folder. Mirrors fetchDriveFolderFiles
     but filters to mimeType = folder so we can list gallery sections.
     `supportsAllDrives` + `includeItemsFromAllDrives` let us read Shared
     Drives that are shared "Anyone with the link". */
  const galleryFolderCache = new Map();
  const galleryImageCache  = new Map();
  async function fetchDriveSubfolders(parentFolderId, apiKey) {
    if (galleryFolderCache.has(parentFolderId)) return galleryFolderCache.get(parentFolderId);
    const url = "https://www.googleapis.com/drive/v3/files"
      + "?q=" + encodeURIComponent("'" + parentFolderId + "' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false")
      + "&fields=files(id,name)"
      + "&orderBy=name"
      + "&pageSize=200"
      + "&supportsAllDrives=true"
      + "&includeItemsFromAllDrives=true"
      + "&key=" + encodeURIComponent(apiKey);
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("Drive API " + res.status + ": " + body.slice(0, 200));
    }
    const data = await res.json();
    const folders = Array.isArray(data.files) ? data.files : [];
    galleryFolderCache.set(parentFolderId, folders);
    return folders;
  }

  /* Images inside a Drive folder (filtered to mimeType starts-with image/).
     Paginates through all pages (Drive caps at 1000/page) and strips out
     macOS AppleDouble metadata files (names starting with "." like ._DSC.JPG)
     — those have an image/jpeg MIME type but no actual image data, so Drive's
     thumbnail API returns a broken placeholder for them. */
  async function fetchDriveFolderImages(folderId, apiKey) {
    if (galleryImageCache.has(folderId)) return galleryImageCache.get(folderId);
    const all = [];
    let pageToken = "";
    do {
      const url = "https://www.googleapis.com/drive/v3/files"
        + "?q=" + encodeURIComponent("'" + folderId + "' in parents and mimeType contains 'image/' and trashed = false")
        + "&fields=nextPageToken,files(id,name,mimeType)"
        + "&orderBy=name"
        + "&pageSize=1000"
        + "&supportsAllDrives=true"
        + "&includeItemsFromAllDrives=true"
        + (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : "")
        + "&key=" + encodeURIComponent(apiKey);
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error("Drive API " + res.status + ": " + body.slice(0, 200));
      }
      const data = await res.json();
      (data.files || []).forEach(f => all.push(f));
      pageToken = data.nextPageToken || "";
    } while (pageToken);
    // Strip AppleDouble shadow files
    const files = all.filter(f => !f.name.startsWith("."));
    galleryImageCache.set(folderId, files);
    return files;
  }

  /* Build a Drive thumbnail URL at a given width. Works for any file shared
     "Anyone with the link" — returns a JPEG, no Drive redirect, no OAuth. */
  function driveThumbnailUrl(fileId, width) {
    return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w" + (width || 800);
  }

  function renderFileList(host, files) {
    host.innerHTML = "";
    if (!files.length) {
      host.appendChild(el("p", { class: "doc-file-empty" }, "This folder is empty right now. Check back soon."));
      return;
    }
    files.forEach(file => {
      const row = el("div", { class: "doc-file-row" });
      row.appendChild(el("span", { class: "doc-file-icon", "aria-hidden": "true" }, iconFor(file.mimeType)));
      const info = el("div", { class: "doc-file-info" });
      info.appendChild(el("span", { class: "doc-file-name" }, file.name));
      const metaBits = [];
      if (file.size) metaBits.push(formatBytes(file.size));
      if (file.modifiedTime) {
        try {
          const d = new Date(file.modifiedTime);
          metaBits.push("updated " + d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }));
        } catch (e) { /* ignore */ }
      }
      if (metaBits.length) info.appendChild(el("span", { class: "doc-file-meta" }, metaBits.join(" · ")));
      row.appendChild(info);
      const dl = el("a", {
        class: "btn btn-primary btn-sm doc-file-download",
        href: driveDownloadUrl(file),
        download: file.name,
        rel: "noopener",
      });
      dl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true" style="margin-right:6px;vertical-align:-2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download';
      row.appendChild(dl);
      host.appendChild(row);
    });
  }

  async function openDocModal(school, catLabel, folderUrl) {
    const modal = document.getElementById("docModal");
    if (!modal) return;
    const folderId = driveFolderIdFromUrl(folderUrl);
    const apiKey = (cfg.resources && cfg.resources.googleApiKey) || null;

    document.getElementById("docModalEyebrow").textContent =
      (school.city || "") + (school.city ? " · " : "") + catLabel;
    document.getElementById("docModalTitle").textContent = school.name + " — " + catLabel;
    const list = document.getElementById("docModalList");
    const empty = document.getElementById("docModalEmpty");
    const hint = document.getElementById("docModalHint");
    list.innerHTML = "";
    empty.hidden = true;
    hint.textContent = "Click Download next to any file to save it to your device.";

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";

    if (!folderId) {
      list.hidden = true;
      empty.hidden = false;
      return;
    }
    if (!apiKey) {
      list.hidden = true;
      empty.hidden = false;
      empty.innerHTML =
        '<p><strong>One-time setup needed.</strong></p>' +
        '<p>To list the files inline, paste a Google API key into ' +
        '<code>resources.googleApiKey</code> in <code>site-config.js</code>. ' +
        'Setup takes ~2 minutes — see the comment in that file.</p>';
      return;
    }

    list.hidden = false;
    list.innerHTML = '<p class="doc-file-loading">Loading files…</p>';
    try {
      const files = await fetchDriveFolderFiles(folderId, apiKey);
      if (!files.length) {
        list.hidden = true;
        empty.hidden = false;
      } else {
        renderFileList(list, files);
      }
    } catch (err) {
      list.innerHTML = "";
      list.appendChild(el("p", { class: "doc-file-error" },
        "Couldn't load this folder's files. The folder may not be public, or the API key may need to be re-checked. " +
        "(" + (err.message || String(err)) + ")"
      ));
    }
  }

  function closeDocModal() {
    const modal = document.getElementById("docModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => { modal.hidden = true; }, 220);
    document.body.style.overflow = "";
  }
  function initDocModal() {
    const modal = document.getElementById("docModal");
    if (!modal) return;
    // Use closest() so a click on any child of a close target (e.g. text node
    // inside the X button) still walks up to find the [data-modal-close]
    // element and triggers close.
    modal.addEventListener("click", e => {
      if (e.target.closest && e.target.closest("[data-modal-close]")) closeDocModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !modal.hidden) closeDocModal();
    });
  }

  /* ----------------------- FOOTER --------------------------------- */
  function renderFooter() {
    const f = cfg.footer;
    $("#footerTagline").textContent = f.tagline || "";
    const ul = $("#footerQuickLinks");
    ul.innerHTML = "";
    (f.quickLinks || []).forEach(link => {
      const href = link.href || cfg.brand.applyUrl;
      const isExternal = /^https?:\/\//i.test(href || "");
      ul.appendChild(el("li", {},
        el("a", {
          href,
          target: isExternal ? "_blank" : null,
          rel:    isExternal ? "noopener" : null,
        }, link.label)
      ));
    });
    $("#finePrint").textContent = f.finePrint || "";
  }

  /* ----------------------- CAREER QUIZ ---------------------------- */
  /* Modal quiz with weighted scoring. The map of pathway-slug → points is
     accumulated as the visitor answers each question. The pathway with the
     highest total is the recommendation. State lives in `cqState` so the
     visitor can back-step, retake, etc. */
  let cqState = null;

  function openCareerQuiz() {
    const overlay = document.getElementById("cqOverlay");
    if (!overlay) return;
    const quiz = cfg.careerQuiz;
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) return;

    // Initialize / reset state on open.
    // Flow: intro → lead → question (× N) → thankyou.
    cqState = {
      stage: "intro",                  // intro | lead | question | thankyou
      index: 0,                         // current question index (used in stage "question")
      total: quiz.questions.length,
      scores: {},                       // pathway-slug → points
      lead: null,                       // {firstname, lastname, email, date_of_birth}
      hubspotPosted: false,             // becomes true once we've POSTed to HubSpot
    };
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    renderCareerQuiz();
  }
  function closeCareerQuiz() {
    const overlay = document.getElementById("cqOverlay");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function renderCareerQuiz() {
    const quiz = cfg.careerQuiz;
    if (!quiz) return;
    const titleEl = document.getElementById("cqTitle");
    const subEl   = document.getElementById("cqSub");
    const ebEl    = document.getElementById("cqEyebrow");
    const body    = document.getElementById("cqBody");
    const footer  = document.getElementById("cqFooter");
    const bar     = document.getElementById("cqProgressBar");
    if (!body || !footer) return;
    body.innerHTML = "";
    footer.innerHTML = "";

    // ---- INTRO SCREEN ----
    if (cqState.stage === "intro") {
      if (ebEl)    ebEl.textContent    = quiz.intro?.eyebrow || "Career Quiz";
      if (titleEl) titleEl.textContent = quiz.intro?.title   || "Find Your Pathway";
      if (subEl)   subEl.textContent   = quiz.intro?.sub     || "";
      if (bar)     bar.style.width = "0%";
      body.appendChild(el("p", { class: "cq-intro-pitch" },
        quiz.intro?.pitch || "Tell us a little about you, then take the quiz — we'll send your matched pathway straight to your inbox."
      ));
      const startBtn = el("button", {
        type: "button",
        class: "btn btn-primary btn-pop cq-start",
      }, quiz.intro?.cta || "Start the quiz →");
      startBtn.addEventListener("click", () => {
        // Lead capture comes BEFORE the questions when enabled
        cqState.stage = (quiz.leadCapture && quiz.leadCapture.enabled) ? "lead" : "question";
        cqState.index = 0;
        renderCareerQuiz();
      });
      footer.appendChild(startBtn);
      return;
    }

    // ---- LEAD CAPTURE SCREEN (before the first question) ----
    if (cqState.stage === "lead") {
      renderCareerQuizLead(quiz, quiz.leadCapture, { titleEl, subEl, ebEl, body, footer, bar });
      return;
    }

    // ---- THANK-YOU SCREEN (final) ----
    if (cqState.stage === "thankyou") {
      // Compute the matched pathway (highest score; ties → first in config order)
      const ordered = (cfg.pathways && cfg.pathways.items) || [];
      let best = null; let bestScore = -1;
      ordered.forEach(p => {
        const s = cqState.scores[p.slug] || 0;
        if (s > bestScore) { best = p; bestScore = s; }
      });

      // Submit to HubSpot exactly once — fire and forget. If it fails, the
      // visitor still sees their thank-you screen (we don't punish them for
      // a HubSpot hiccup), and the payload is logged so we know what's missing.
      if (!cqState.hubspotPosted && cqState.lead && best) {
        cqState.hubspotPosted = true;
        submitCareerQuizLeadToHubSpot(quiz.leadCapture, cqState.lead, best.slug);
      }

      const ty = quiz.thankyou || {};
      if (ebEl)    ebEl.textContent    = ty.eyebrow || "All set";
      if (titleEl) titleEl.textContent = ty.title   || "Thank you! We'll be in touch regarding your results.";
      if (subEl)   subEl.textContent   = "";
      if (bar)     bar.style.width = "100%";

      const card = el("div", { class: "cq-result cq-thankyou" });
      if (ty.body) card.appendChild(el("p", { class: "cq-thankyou-body" }, ty.body));
      if (best) {
        const row = el("div", { class: "cq-thankyou-pathway" });
        row.appendChild(el("span", { class: "cq-result-icon", "aria-hidden": "true" }, best.icon || "★"));
        row.appendChild(el("h3", { class: "cq-result-title" }, best.title));
        card.appendChild(row);
      }
      if (ty.footnote) card.appendChild(el("p", { class: "cq-thankyou-footnote muted" }, ty.footnote));
      body.appendChild(card);

      const closeBtn = el("button", { type: "button", class: "btn btn-primary btn-pop" }, "Close");
      closeBtn.addEventListener("click", () => closeCareerQuiz());
      footer.appendChild(closeBtn);
      const retake = el("button", { type: "button", class: "btn btn-outline cq-retake" }, ty.retake || "Take it again");
      retake.addEventListener("click", () => {
        // Full reset — keep them in the modal but bounce back to the intro
        cqState.stage = "intro";
        cqState.index = 0;
        cqState.scores = {};
        cqState.lead = null;
        cqState.hubspotPosted = false;
        renderCareerQuiz();
      });
      footer.appendChild(retake);
      return;
    }

    // ---- QUESTION SCREEN ----
    const q = quiz.questions[cqState.index];
    if (ebEl)    ebEl.textContent    = "Question " + (cqState.index + 1) + " of " + cqState.total;
    if (titleEl) titleEl.textContent = q.q;
    if (subEl)   subEl.textContent   = "";
    if (bar)     bar.style.width = Math.round(((cqState.index) / cqState.total) * 100) + "%";

    const list = el("ul", { class: "cq-answers", role: "radiogroup", "aria-label": q.q });
    (q.answers || []).forEach((a, ai) => {
      const li = el("li", {});
      const btn = el("button", {
        type: "button",
        class: "cq-answer",
        "data-i": ai,
      }, a.label);
      btn.addEventListener("click", () => {
        // Tally weights for this answer
        const w = a.weights || {};
        Object.keys(w).forEach(slug => {
          cqState.scores[slug] = (cqState.scores[slug] || 0) + (w[slug] || 0);
        });
        cqState.index += 1;
        // After the last question, jump to the thank-you screen (which also
        // triggers the HubSpot submission with the now-computed pathway).
        if (cqState.index >= cqState.total) cqState.stage = "thankyou";
        renderCareerQuiz();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    body.appendChild(list);

    // Footer: back button + question counter
    if (cqState.index > 0) {
      const back = el("button", { type: "button", class: "btn btn-outline cq-back" }, "← Back");
      back.addEventListener("click", () => {
        // Going back doesn't unwind scores (cheap UX trade-off) but lets you re-pick.
        cqState.index = Math.max(0, cqState.index - 1);
        renderCareerQuiz();
      });
      footer.appendChild(back);
    }
    footer.appendChild(el("span", { class: "cq-counter" }, (cqState.index + 1) + " / " + cqState.total));
  }

  /* Lead-capture screen — shown BEFORE the questions. Collects name, email,
     and birthday so we know who's taking the quiz. The chosen pathway isn't
     known yet — it gets stitched in at the end (see the "thankyou" stage,
     which calls submitCareerQuizLeadToHubSpot). */
  function renderCareerQuizLead(quiz, lc, refs) {
    const { titleEl, subEl, ebEl, body, footer, bar } = refs;
    if (ebEl)    ebEl.textContent    = lc.eyebrow || "First, the basics";
    if (titleEl) titleEl.textContent = lc.title   || "Tell us about yourself";
    if (subEl)   subEl.textContent   = lc.sub     || "We'll send your matched pathway after the quiz.";
    if (bar)     bar.style.width = "10%";

    const form = el("form", { class: "cq-lead-form", novalidate: "" });
    const row1 = el("div", { class: "cq-lead-row" });
    row1.appendChild(el("label", { class: "cq-lead-field" },
      el("span", {}, "First name"),
      el("input", { type: "text", name: "firstname", autocomplete: "given-name", required: "" })
    ));
    row1.appendChild(el("label", { class: "cq-lead-field" },
      el("span", {}, "Last name"),
      el("input", { type: "text", name: "lastname", autocomplete: "family-name", required: "" })
    ));
    form.appendChild(row1);
    form.appendChild(el("label", { class: "cq-lead-field" },
      el("span", {}, "Email"),
      el("input", { type: "email", name: "email", autocomplete: "email", required: "" })
    ));
    form.appendChild(el("label", { class: "cq-lead-field" },
      el("span", {}, "Phone number"),
      el("input", { type: "tel", name: "phone", autocomplete: "tel", placeholder: "(555) 555-5555", required: "" })
    ));
    form.appendChild(el("label", { class: "cq-lead-field" },
      el("span", {}, "Date of birth (MM/DD/YYYY)"),
      el("input", { type: "date", name: "date_of_birth", autocomplete: "bday", required: "" })
    ));
    const errEl = el("p", { class: "cq-lead-error", role: "alert", hidden: "" });
    form.appendChild(errEl);

    const submitBtn = el("button", { type: "submit", class: "btn btn-primary btn-pop cq-lead-submit" }, lc.submitLabel || "Start the quiz →");
    form.appendChild(submitBtn);
    body.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errEl.hidden = true; errEl.textContent = "";
      const fd = new FormData(form);
      const lead = {
        firstname:     String(fd.get("firstname")     || "").trim(),
        lastname:      String(fd.get("lastname")      || "").trim(),
        email:         String(fd.get("email")         || "").trim(),
        phone:         String(fd.get("phone")         || "").trim(),
        date_of_birth: String(fd.get("date_of_birth") || "").trim(),
      };
      if (!lead.firstname || !lead.lastname || !lead.email || !lead.phone || !lead.date_of_birth) {
        errEl.textContent = "Please fill in every field.";
        errEl.hidden = false;
        return;
      }
      // Stash the lead and advance to the first question. We DON'T POST to
      // HubSpot here — the pathway isn't known yet. The POST happens after
      // the last answer, in the thank-you stage, with pathway included.
      cqState.lead = lead;
      cqState.stage = "question";
      cqState.index = 0;
      renderCareerQuiz();
    });
  }

  /* Fire-and-forget HubSpot Forms API submission. Called once from the
     thank-you stage with the lead info from earlier + the now-computed
     pathway. If the form GUID isn't configured yet, the payload is logged
     to the console so the captured data isn't silently lost. */
  function submitCareerQuizLeadToHubSpot(lc, lead, pathwaySlug) {
    if (!lc) return;
    const fields = [
      { objectTypeId: "0-1", name: "firstname",     value: lead.firstname     },
      { objectTypeId: "0-1", name: "lastname",      value: lead.lastname      },
      { objectTypeId: "0-1", name: "email",         value: lead.email         },
      { objectTypeId: "0-1", name: "phone",          value: lead.phone         },
      { objectTypeId: "0-1", name: "date_of_birth_", value: lead.date_of_birth },
      { objectTypeId: "0-1", name: lc.pathwayPropertyName || "pathway_interest", value: pathwaySlug },
    ];
    const payload = {
      submittedAt: Date.now(),
      fields,
      context: { pageUri: location.href, pageName: document.title },
    };
    if (!lc.hubspotPortalId || !lc.hubspotFormId) {
      console.warn("[careerQuiz.leadCapture] hubspotFormId not set in site-config.js — submission captured below but NOT sent to HubSpot:", payload);
      return;
    }
    fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${lc.hubspotPortalId}/${lc.hubspotFormId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error("HubSpot rejected: " + r.status + " " + t.slice(0, 200)); });
      })
      .catch(err => {
        console.error("[careerQuiz.leadCapture] submission failed:", err);
      });
  }

  function initCareerQuiz() {
    const overlay = document.getElementById("cqOverlay");
    if (!overlay) return;
    // Close: X button, backdrop click, Escape
    document.getElementById("cqClose")?.addEventListener("click", closeCareerQuiz);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCareerQuiz(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("is-open")) closeCareerQuiz(); });
    // Any link with data-action="open-quiz" opens the quiz
    document.addEventListener("click", (e) => {
      const t = e.target.closest('[data-action="open-quiz"]');
      if (t) { e.preventDefault(); openCareerQuiz(); }
    });
  }

  /* ----------------------- FIRST-TIME VISITOR POP-UP ------------- */
  /* Shown once per browser. Submits to the HubSpot Forms API directly
     (no backend). Dismissal is remembered via localStorage so it never
     becomes obnoxious. */
  function initFirstTimePopup() {
    const ftv = cfg.firstTimePopup;
    if (!ftv || !ftv.enabled) return;
    const overlay = $("#ftvOverlay");
    if (!overlay) return;

    const KEY = ftv.storageKey || "cphs_ftv_seen";
    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(KEY) === "1"; } catch (_) { /* private mode → still show */ }
    if (alreadySeen) return;

    // Populate copy
    const titleEl = $("#ftvTitle"); if (titleEl && ftv.title) titleEl.textContent = ftv.title;
    const subEl = $("#ftvSub");     if (subEl   && ftv.sub)   subEl.textContent   = ftv.sub;

    const markSeen = () => { try { localStorage.setItem(KEY, "1"); } catch (_) {} };
    const open  = () => { overlay.classList.add("is-open");  overlay.setAttribute("aria-hidden", "false"); };
    const close = () => { overlay.classList.remove("is-open"); overlay.setAttribute("aria-hidden", "true"); markSeen(); };

    // Audience toggle (Student / Parent)
    const audienceInput = $("#ftvAudience");
    overlay.querySelectorAll(".ftv-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        overlay.querySelectorAll(".ftv-toggle-btn").forEach(b => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        if (audienceInput) audienceInput.value = btn.dataset.audience || "student";
      });
    });

    // Close / "Not now" / backdrop click / Esc
    $("#ftvClose")?.addEventListener("click", close);
    $("#ftvLater")?.addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("is-open")) close(); });

    // Submit → HubSpot Forms API (or local log if form not wired up yet)
    const form = $("#ftvForm");
    const errEl = $("#ftvError");
    const successEl = $("#ftvSuccess");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (errEl) { errEl.hidden = true; errEl.textContent = ""; }
      const fd = new FormData(form);
      const fields = ["firstname","lastname","email","phone","date_of_birth","audience_type"].map(name => ({
        objectTypeId: "0-1",
        name,
        value: String(fd.get(name) || "").trim(),
      }));
      const missing = fields.find(f => !f.value);
      if (missing) {
        if (errEl) { errEl.textContent = "Please fill in every field — we use all of it to follow up."; errEl.hidden = false; }
        return;
      }
      const payload = {
        submittedAt: Date.now(),
        fields,
        context: {
          pageUri: location.href,
          pageName: document.title,
        },
      };
      const portal = ftv.hubspotPortalId;
      const formId = ftv.hubspotFormId;
      const submitBtn = $("#ftvSubmit");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      try {
        if (portal && formId) {
          const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) {
            const txt = await r.text();
            throw new Error("HubSpot rejected the submission: " + r.status + " " + txt.slice(0, 200));
          }
        } else {
          // Form GUID not configured yet — surface the payload so it isn't lost.
          console.warn("[firstTimePopup] hubspotFormId not set in site-config.js — submission captured below but NOT sent to HubSpot:", payload);
        }
        if (successEl) successEl.hidden = false;
        form.style.display = "none";
        setTimeout(close, 1600);
      } catch (err) {
        console.error("[firstTimePopup] submission failed:", err);
        if (errEl) { errEl.textContent = "Something went wrong on our side. Try again, or call the campus directly."; errEl.hidden = false; }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send it"; }
      }
    });

    // Show after a short delay so the hero registers first
    setTimeout(open, Math.max(0, Number(ftv.delayMs) || 4000));
  }

  /* ----------------------- ROUTING -------------------------------- */
  function showPage(pageId) {
    let target;            // which <section> id to display
    let menuActive;        // which id to mark active in the menu

    // Pages that exist as <section id="..."> in the DOM but live in submenus / external nav
    const standaloneIds = ["testimonials", "faq", "resources", "interest-form", "graduates"];

    if (isSchoolSlug(pageId)) {
      renderSchoolPage(pageId);
      target = "school-page";
      menuActive = pageId;
    } else if (standaloneIds.includes(pageId)) {
      target = pageId;
      menuActive = pageId;
    } else if (cfg.menu.find(m => m.id === pageId)) {
      target = pageId;
      menuActive = pageId;
    } else {
      target = "home";
      menuActive = "home";
    }

    $$("section.page").forEach(s => s.classList.toggle("is-current", s.id === target));
    renderMenu(menuActive);
    updateQuickFinderVisibility(target);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    $("#navList").classList.remove("open");
    $("#navToggle").setAttribute("aria-expanded", "false");

    // Initialise / refresh the interactive Locations map only when its page is visible
    if (target === "locations") {
      const tryInit = () => {
        if (window.L) initInteractiveMap();
        else setTimeout(tryInit, 200);
      };
      setTimeout(tryInit, 50);
      startLocationRotator();
    }
  }

  function pageFromHash() {
    const hash = (location.hash || "#home").replace("#", "").trim();
    return hash || "home";
  }

  /* ----------------------- BRAND LOGO ----------------------------- */
  function wireApplyLinks() {
    const url = cfg.brand && cfg.brand.applyUrl;
    if (!url) return;
    const isExternal = /^https?:\/\//i.test(url);
    // Sweep any element flagged with the apply target id, plus the static CTA-band button
    ["ctaBandApply"].forEach(id => {
      const node = document.getElementById(id);
      if (!node) return;
      node.href = url;
      if (isExternal) { node.target = "_blank"; node.rel = "noopener"; }
    });
  }

  function renderBrand() {
    const b = cfg.brand;
    const navLogo = $("#navLogo");
    const footerLogo = $("#footerLogo");
    if (navLogo) {
      // Nav is dark — use the white-wordmark variant
      const src = b.logoLight || b.logo;
      navLogo.src = src;
      navLogo.alt = b.name;
      navLogo.onerror = () => {
        if (b.logoFallback && navLogo.src.indexOf(b.logoFallback) === -1) {
          navLogo.onerror = null;
          navLogo.src = b.logoFallback;
        }
      };
    }
    if (footerLogo && b.logoLight) {
      footerLogo.src = b.logoLight;
      footerLogo.alt = b.name;
    }
  }

  /* ----------------------- INIT ----------------------------------- */
  function init() {
    renderBrand();
    wireApplyLinks();
    renderHeroVideo();
    renderHome();
    startHeroHeadlineRotator();
    renderWhy();
    renderPathways();
    renderStudentLife();
    renderLocations();
    renderStart();
    renderResources();
    renderTestimonials();
    renderGraduates();
    renderFaq();
    renderInterestForm();
    renderFooter();
    applyModuleVisibility();
    initQuickFinder();
    initAskQuestionButton();
    initGalleryLightbox();
    initCareerQuiz();
    initFirstTimePopup();
    initDocModal();
    showPage(pageFromHash());

    window.addEventListener("hashchange", () => showPage(pageFromHash()));

    $("#navToggle").addEventListener("click", () => {
      const list = $("#navList");
      const open = list.classList.toggle("open");
      $("#navToggle").setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Translucent backdrop-blur nav once user scrolls past the hero edge
    const header = document.querySelector(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
