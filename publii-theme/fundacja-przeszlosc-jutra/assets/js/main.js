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
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
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
    });
  }

  // 6. Kontrola wideo w tle na stronie głównej (Pauza / Odtwórz)
  const heroVideo = document.getElementById("heroBgVideo");
  const videoToggleBtn = document.getElementById("videoToggleBtn");
  if (heroVideo && videoToggleBtn) {
    heroVideo.addEventListener("error", () => {
      videoToggleBtn.hidden = true;
    });
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

  // 8. Interaktywny Lightbox Galerii Zdjęć (podstrony aktualności i projektów)
  const galleryItems = Array.from(document.querySelectorAll("[data-lightbox-gallery]"));
  if (galleryItems.length) {
    const lb = document.createElement("div");
    lb.className = "fpj-lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Podgląd zdjęcia w galerii");
    lb.innerHTML = `
      <span class="fpj-lightbox-counter" id="lbCounter"></span>
      <button type="button" class="fpj-lightbox-btn fpj-lightbox-close" id="lbClose" aria-label="Zamknij">✕</button>
      <button type="button" class="fpj-lightbox-btn fpj-lightbox-prev" id="lbPrev" aria-label="Poprzednie zdjęcie">‹</button>
      <figure class="fpj-lightbox-figure">
        <img id="lbImg" src="" alt="" />
        <figcaption class="fpj-lightbox-caption" id="lbCaption"></figcaption>
      </figure>
      <button type="button" class="fpj-lightbox-btn fpj-lightbox-next" id="lbNext" aria-label="Następne zdjęcie">›</button>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector("#lbImg");
    const lbCaption = lb.querySelector("#lbCaption");
    const lbCounter = lb.querySelector("#lbCounter");
    let currentIndex = 0;

    function showSlide(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      lbImg.src = item.getAttribute("href");
      lbImg.alt = item.dataset.caption || "";
      lbCaption.textContent = item.dataset.caption || "";
      lbCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }

    function openLightbox(index) {
      showSlide(index);
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        openLightbox(idx);
      });
    });

    lb.querySelector("#lbClose").addEventListener("click", closeLightbox);
    lb.querySelector("#lbPrev").addEventListener("click", () => showSlide(currentIndex - 1));
    lb.querySelector("#lbNext").addEventListener("click", () => showSlide(currentIndex + 1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (e.key === "ArrowRight") showSlide(currentIndex + 1);
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
