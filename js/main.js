document.addEventListener("DOMContentLoaded", () => {
  // 1. Aktualny rok w stopce
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky/shrinking header + Scroll Progress Bar + Back to Top
  const navbar = document.querySelector(".site-navbar");
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (navbar) {
      navbar.classList.toggle("is-scrolled", scrollY > 32);
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
      progressBar.style.width = `${progress}%`;
    }
    if (backToTop) {
      backToTop.classList.toggle("is-visible", scrollY > 420);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 3. Subtelna paralaksa tła w sekcjach Hero (inspirowana peryt.eu / estrada.poznan.pl)
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (parallaxEls.length && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxEls.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.2;
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
              el.style.transform = `translate3d(0, ${y * speed}px, 0) scale(1.06)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 4. Scroll-Reveal (IntersectionObserver) z obsługą dynamicznie dodanych kart
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  window.fpjObserveReveals = function (scope = document) {
    scope.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      revealObserver.observe(el);
    });
  };
  window.fpjObserveReveals(document);

  // 5. Płynne przejścia między podstronami (Page Transition Curtain)
  if (!prefersReducedMotion) {
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented) return;
      const link = e.target.closest("a[href]");
      if (!link) return;
      if (
        link.hasAttribute("data-lightbox-gallery") ||
        link.hasAttribute("data-bs-toggle") ||
        link.hasAttribute("download") ||
        link.closest(".gallery, .fpj-gallery")
      ) {
        return;
      }
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        /\.(webp|jpe?g|png|gif|svg|avif|mp4|webm|pdf)(\?.*)?$/i.test(href) ||
        link.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 240);
    });

    window.addEventListener("pageshow", () => {
      document.body.classList.remove("is-leaving");
      document.body.style.overflow = "";
    });
  }

  // 6. Kontrola wideo w tle na stronie głównej (Dźwięk + Pauza / Odtwórz)
  const heroVideo = document.getElementById("heroBgVideo");
  const videoToggleBtn = document.getElementById("videoToggleBtn");
  const videoMuteBtn = document.getElementById("videoMuteBtn");

  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      if (videoToggleBtn) videoToggleBtn.hidden = true;
      if (videoMuteBtn) videoMuteBtn.hidden = true;
    });

    if (videoToggleBtn) {
      videoToggleBtn.addEventListener("click", () => {
        if (heroVideo.paused) {
          heroVideo.play().catch(() => {});
          videoToggleBtn.textContent = "❚❚ Wstrzymaj tło";
        } else {
          heroVideo.pause();
          videoToggleBtn.textContent = "▶ Odtwórz tło";
        }
      });
    }

    if (videoMuteBtn) {
      videoMuteBtn.addEventListener("click", () => {
        const willUnmute = heroVideo.muted;
        heroVideo.muted = !willUnmute;
        if (willUnmute) {
          heroVideo.volume = 1;
          if (heroVideo.paused) {
            heroVideo.play().catch(() => {});
            if (videoToggleBtn) videoToggleBtn.textContent = "❚❚ Wstrzymaj tło";
          }
          videoMuteBtn.textContent = "🔊 Wycisz";
          videoMuteBtn.setAttribute("aria-pressed", "true");
        } else {
          videoMuteBtn.textContent = "🔇 Włącz dźwięk";
          videoMuteBtn.setAttribute("aria-pressed", "false");
        }
      });
    }
  }

  // 7. Kopiowanie numeru rachunku bankowego (Wesprzyj nas)
  const copyBtn = document.getElementById("copyAccountBtn");
  const accountEl = document.getElementById("bankAccountText");
  const copyFeedback = document.getElementById("copyFeedback");
  if (copyBtn && accountEl && copyFeedback) {
    copyBtn.addEventListener("click", async () => {
      const textToCopy = accountEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        const tmp = document.createElement("textarea");
        tmp.value = textToCopy;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
      }
      copyFeedback.classList.remove("d-none");
      setTimeout(() => {
        copyFeedback.classList.add("d-none");
      }, 4200);
    });
  }

  // 8. Galeria zdjęć oparta o komponenty Bootstrap 5 (Modal + Carousel)
  // Obsługuje zarówno [data-lightbox-gallery], jak i galerie generowane przez Publii (.gallery a)
  const gallerySelector =
    '[data-lightbox-gallery], .gallery a[href$=".webp"], .gallery a[href$=".jpg"], .gallery a[href$=".jpeg"], .gallery a[href$=".png"]';
  const allGalleryLinks = Array.from(document.querySelectorAll(gallerySelector));

  if (allGalleryLinks.length) {
    const modalEl = document.createElement("div");
    modalEl.className = "modal fade fpj-gallery-modal";
    modalEl.id = "fpjGalleryModal";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-labelledby", "fpjGalleryModalLabel");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <span class="fpj-gallery-counter" id="fpjGalleryModalLabel">1 / 1</span>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Zamknij galerię"></button>
          </div>
          <div class="modal-body p-0">
            <div id="fpjGalleryCarousel" class="carousel slide" data-bs-ride="false" data-bs-touch="true">
              <div class="carousel-indicators" id="fpjGalleryIndicators"></div>
              <div class="carousel-inner" id="fpjGalleryInner"></div>
              <button class="carousel-control-prev" type="button" data-bs-target="#fpjGalleryCarousel" data-bs-slide="prev" id="fpjGalleryPrev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Poprzednie zdjęcie</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#fpjGalleryCarousel" data-bs-slide="next" id="fpjGalleryNext">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Następne zdjęcie</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    const carouselEl = modalEl.querySelector("#fpjGalleryCarousel");
    const innerEl = modalEl.querySelector("#fpjGalleryInner");
    const indicatorsEl = modalEl.querySelector("#fpjGalleryIndicators");
    const counterEl = modalEl.querySelector("#fpjGalleryModalLabel");
    const prevBtn = modalEl.querySelector("#fpjGalleryPrev");
    const nextBtn = modalEl.querySelector("#fpjGalleryNext");

    let activeCarousel = null;
    let activeTotal = 0;

    function escapeHtml(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function getGroupItems(clickedLink) {
      const groupName = clickedLink.getAttribute("data-lightbox-gallery");
      if (groupName) {
        return Array.from(document.querySelectorAll(`[data-lightbox-gallery="${CSS.escape(groupName)}"]`));
      }
      const parentGallery = clickedLink.closest(".gallery");
      if (parentGallery) {
        return Array.from(parentGallery.querySelectorAll("a[href]"));
      }
      return [clickedLink];
    }

    function openBootstrapGallery(clickedLink) {
      const items = getGroupItems(clickedLink);
      const startIndex = Math.max(0, items.indexOf(clickedLink));
      activeTotal = items.length;

      if (activeCarousel) {
        activeCarousel.dispose();
        activeCarousel = null;
      }

      innerEl.innerHTML = items
        .map((item, idx) => {
          const src = item.getAttribute("href");
          const imgInside = item.querySelector("img");
          const caption = item.dataset.caption || (imgInside ? imgInside.getAttribute("alt") : "") || "";
          return `
            <div class="carousel-item ${idx === startIndex ? "active" : ""}">
              <figure class="fpj-gallery-slide-figure">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" />
                ${caption ? `<figcaption class="fpj-gallery-slide-caption">${escapeHtml(caption)}</figcaption>` : ""}
              </figure>
            </div>
          `;
        })
        .join("");

      const multi = items.length > 1;
      prevBtn.classList.toggle("d-none", !multi);
      nextBtn.classList.toggle("d-none", !multi);
      indicatorsEl.classList.toggle("d-none", !multi);

      indicatorsEl.innerHTML = multi
        ? items
            .map(
              (_, idx) => `
            <button type="button" data-bs-target="#fpjGalleryCarousel" data-bs-slide-to="${idx}"
              class="${idx === startIndex ? "active" : ""}"
              aria-current="${idx === startIndex ? "true" : "false"}"
              aria-label="Zdjęcie ${idx + 1}"></button>`
            )
            .join("")
        : "";

      counterEl.textContent = `${startIndex + 1} / ${items.length}`;

      if (window.bootstrap && window.bootstrap.Modal && window.bootstrap.Carousel) {
        activeCarousel = new window.bootstrap.Carousel(carouselEl, {
          interval: false,
          ride: false,
          wrap: true,
          touch: true,
          keyboard: true
        });
        const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        bsModal.show();
      }
    }

    carouselEl.addEventListener("slide.bs.carousel", (ev) => {
      if (typeof ev.to === "number" && activeTotal > 0) {
        counterEl.textContent = `${ev.to + 1} / ${activeTotal}`;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!modalEl.classList.contains("show") || !activeCarousel) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        activeCarousel.prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        activeCarousel.next();
      }
    });

    allGalleryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openBootstrapGallery(link);
      });
    });
  }

  // 9. FormSubmit.co (AJAX z walidacją Bootstrap 5 i fallbackiem)
  document.querySelectorAll(".js-formsubmit").forEach((form) => {
    const statusBox = form.querySelector(".js-form-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        if (statusBox) {
          statusBox.className = "js-form-status alert alert-warning mt-3 mb-0";
          statusBox.textContent = "Proszę uzupełnić wszystkie wymagane pola i zaakceptować zgodę.";
        }
        return;
      }

      const endpoint = form.getAttribute("action").replace("formsubmit.co/", "formsubmit.co/ajax/");
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((val, key) => {
        payload[key] = val;
      });

      const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Wysyłanie...';
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && (data.success === "true" || data.success === true)) {
          if (statusBox) {
            statusBox.className = "js-form-status alert alert-success mt-3 mb-0";
            statusBox.textContent = "Dziękujemy! Wiadomość została wysłana na adres fundacja@przeszloscjutra.pl. Odpowiemy najszybciej jak to możliwe.";
          }
          form.reset();
          form.classList.remove("was-validated");
        } else {
          throw new Error(data.message || "FormSubmit wymaga jednorazowej aktywacji adresu e-mail.");
        }
      } catch (err) {
        if (statusBox) {
          statusBox.className = "js-form-status alert alert-info mt-3 mb-0";
          statusBox.innerHTML =
            'Nie udało się wysłać formularza w tle (np. podgląd lokalny <code>file://</code> lub nieaktywowany jeszcze adres w FormSubmit). ' +
            'Po opublikowaniu na GitHub Pages wyślij pierwszą wiadomość testową, aby kliknąć link aktywacyjny wysłany przez <strong>FormSubmit.co</strong> na skrzynkę <code>fundacja@przeszloscjutra.pl</code>.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });
});
