/* ==========================================================================
   Statyczny silnik blogowy Aktualności — Fundacja Przeszłość Jutra
   Źródło prawdy: data/aktualnosci.json (z fallbackiem dla lokalnego file://)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const rootPrefix = document.body.dataset.rootPrefix || "";

  async function loadNewsData() {
    if (window.location.protocol !== "file:") {
      try {
        const res = await fetch(`${rootPrefix}data/aktualnosci.json`, { cache: "no-store" });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn("Użyto kopii zapasowej aktualności:", e);
      }
    }
    return window.FUNDACJA_AKTUALNOSCI_FALLBACK || [];
  }

  const allPosts = (await loadNewsData()).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (!allPosts.length) return;

  // 1. STRONA GŁÓWNA: automatyczne wyświetlenie 3 najnowszych aktualności
  const homeNewsGrid = document.getElementById("homeNewsGrid");
  if (homeNewsGrid) {
    const latestThree = allPosts.slice(0, 3);
    homeNewsGrid.innerHTML = latestThree
      .map(
        (post, idx) => `
      <div class="col-lg-4 col-md-6 reveal reveal-delay-${idx + 1}">
        <article class="fpj-card d-flex flex-column overflow-hidden">
          <a href="${rootPrefix}${post.url}" class="media-frame d-block" style="aspect-ratio: 16 / 10;">
            <img src="${rootPrefix}${post.image}" alt="${post.imageAlt || post.title}" loading="lazy" />
          </a>
          <div class="p-4 d-flex flex-column flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-3 small text-muted-fpj">
              <span class="pill-badge">${post.category}</span>
              <time datetime="${post.date}">${post.dateLabel}</time>
            </div>
            <h3 class="h4 mb-2">
              <a href="${rootPrefix}${post.url}" class="card-title-link">${post.title}</a>
            </h3>
            <p class="text-muted-fpj small flex-grow-1 mb-3">${post.excerpt}</p>
            <a href="${rootPrefix}${post.url}" class="fpj-link align-self-start">Czytaj więcej <span class="arrow">→</span></a>
          </div>
        </article>
      </div>`
      )
      .join("");
    if (window.fpjObserveReveals) window.fpjObserveReveals(homeNewsGrid);
  }

  // 2. ZAKŁADKA AKTUALNOŚCI: wyróżniona aktualność + kategorie + wyszukiwarka + Pokaż więcej
  const featuredContainer = document.getElementById("featuredNewsContainer");
  const newsGrid = document.getElementById("newsListGrid");
  const filterButtons = document.querySelectorAll("[data-news-filter]");
  const searchInput = document.getElementById("newsSearch");
  const emptyState = document.getElementById("newsEmptyState");
  const loadMoreBtn = document.getElementById("loadMoreNewsBtn");
  const newsCountBadge = document.getElementById("newsCountInfo");

  if (featuredContainer && newsGrid) {
    const featuredPost = allPosts.find((p) => p.featured) || allPosts[0];
    const remainingPosts = allPosts.filter((p) => p.slug !== featuredPost.slug);

    featuredContainer.innerHTML = `
      <article class="featured-news-card fpj-card overflow-hidden reveal">
        <div class="row g-0 align-items-stretch">
          <div class="col-lg-6">
            <a href="${rootPrefix}${featuredPost.url}" class="media-frame d-block h-100" style="min-height: 310px;">
              <img src="${rootPrefix}${featuredPost.image}" alt="${featuredPost.imageAlt || featuredPost.title}" />
            </a>
          </div>
          <div class="col-lg-6 d-flex align-items-center">
            <div class="p-4 p-lg-5">
              <div class="d-flex flex-wrap align-items-center gap-3 mb-3 small text-muted-fpj">
                <span class="pill-badge">${featuredPost.category}</span>
                <time datetime="${featuredPost.date}">${featuredPost.dateLabel}</time>
              </div>
              <h2 class="h2 mb-3">
                <a href="${rootPrefix}${featuredPost.url}" class="card-title-link">${featuredPost.title}</a>
              </h2>
              <p class="text-muted-fpj mb-4">${featuredPost.excerpt}</p>
              <a href="${rootPrefix}${featuredPost.url}" class="btn-fpj btn-fpj-burgundy">Czytaj więcej →</a>
            </div>
          </div>
        </div>
      </article>
    `;

    let activeCategory = "all";
    let visibleLimit = 6;
    const STEP = 6;

    function renderGrid() {
      const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const sourcePool = activeCategory === "all" && !q ? remainingPosts : allPosts;

      const filtered = sourcePool.filter((post) => {
        const matchCat = activeCategory === "all" || post.category.toLowerCase() === activeCategory.toLowerCase();
        const haystack = `${post.title} ${post.excerpt} ${post.category} ${post.dateLabel}`.toLowerCase();
        const matchQuery = !q || haystack.includes(q);
        return matchCat && matchQuery;
      });

      const slice = filtered.slice(0, visibleLimit);

      if (!slice.length) {
        newsGrid.innerHTML = "";
        if (emptyState) emptyState.classList.remove("d-none");
      } else {
        if (emptyState) emptyState.classList.add("d-none");
        newsGrid.innerHTML = slice
          .map(
            (post) => `
          <div class="col-lg-4 col-md-6 news-grid-item is-entering">
            <article class="fpj-card d-flex flex-column overflow-hidden">
              <a href="${rootPrefix}${post.url}" class="media-frame d-block" style="aspect-ratio: 16 / 10;">
                <img src="${rootPrefix}${post.image}" alt="${post.imageAlt || post.title}" loading="lazy" />
              </a>
              <div class="p-4 d-flex flex-column flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-3 small text-muted-fpj">
                  <span class="pill-badge">${post.category}</span>
                  <time datetime="${post.date}">${post.dateLabel}</time>
                </div>
                <h3 class="h4 mb-2">
                  <a href="${rootPrefix}${post.url}" class="card-title-link">${post.title}</a>
                </h3>
                <p class="text-muted-fpj small flex-grow-1 mb-3">${post.excerpt}</p>
                <a href="${rootPrefix}${post.url}" class="fpj-link align-self-start">Czytaj więcej <span class="arrow">→</span></a>
              </div>
            </article>
          </div>`
          )
          .join("");
      }

      if (newsCountBadge) {
        newsCountBadge.textContent = `Wyświetlono ${slice.length} z ${filtered.length} wpisów`;
      }

      if (loadMoreBtn) {
        if (filtered.length > visibleLimit) {
          loadMoreBtn.classList.remove("d-none");
        } else {
          loadMoreBtn.classList.add("d-none");
        }
      }
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.newsFilter || "all";
        visibleLimit = STEP;
        renderGrid();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        visibleLimit = STEP;
        renderGrid();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        visibleLimit += STEP;
        renderGrid();
      });
    }

    renderGrid();
    if (window.fpjObserveReveals) window.fpjObserveReveals(featuredContainer);
  }

  // 3. PODSTRONA POJEDYNCZEJ AKTUALNOŚCI: automatyczne 2 powiązane / kolejne publikacje
  const relatedGrid = document.getElementById("relatedNewsGrid");
  if (relatedGrid) {
    const currentSlug = document.body.dataset.postSlug || "";
    const related = allPosts.filter((p) => p.slug !== currentSlug).slice(0, 2);
    relatedGrid.innerHTML = related
      .map(
        (post) => `
      <div class="col-md-6 reveal">
        <article class="fpj-card d-flex flex-column overflow-hidden">
          <a href="${rootPrefix}${post.url}" class="media-frame d-block" style="aspect-ratio: 16 / 9;">
            <img src="${rootPrefix}${post.image}" alt="${post.imageAlt || post.title}" loading="lazy" />
          </a>
          <div class="p-4 d-flex flex-column flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-2 small text-muted-fpj">
              <span class="pill-badge">${post.category}</span>
              <time datetime="${post.date}">${post.dateLabel}</time>
            </div>
            <h3 class="h4 mb-2">
              <a href="${rootPrefix}${post.url}" class="card-title-link">${post.title}</a>
            </h3>
            <p class="text-muted-fpj small flex-grow-1 mb-3">${post.excerpt}</p>
            <a href="${rootPrefix}${post.url}" class="fpj-link align-self-start">Czytaj więcej <span class="arrow">→</span></a>
          </div>
        </article>
      </div>`
      )
      .join("");
    if (window.fpjObserveReveals) window.fpjObserveReveals(relatedGrid);
  }
});
