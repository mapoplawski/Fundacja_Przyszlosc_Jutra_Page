document.addEventListener("DOMContentLoaded", () => {
  // 1. Rok w stopce
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Menu mobilne
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 3. Rozwijany biogram założyciela (O fundacji)
  const toggleFounderBtn = document.getElementById("toggleFounderBio");
  const founderExt = document.getElementById("founderExtended");
  if (toggleFounderBtn && founderExt) {
    toggleFounderBtn.addEventListener("click", () => {
      const hidden = founderExt.hasAttribute("hidden");
      if (hidden) {
        founderExt.removeAttribute("hidden");
        toggleFounderBtn.setAttribute("aria-expanded", "true");
        toggleFounderBtn.textContent = "Zwiń informacje o założycielu ↑";
      } else {
        founderExt.setAttribute("hidden", "");
        toggleFounderBtn.setAttribute("aria-expanded", "false");
        toggleFounderBtn.textContent = "Więcej informacji o założycielu ↓";
      }
    });
  }

  // 4. Kopiowanie numeru rachunku (Wesprzyj nas)
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
      copyFeedback.removeAttribute("hidden");
      setTimeout(() => {
        copyFeedback.setAttribute("hidden", "");
      }, 4000);
    });
  }

  // 5. Filtrowanie i wyszukiwarka aktualności (Aktualności)
  const filterBtns = document.querySelectorAll("[data-news-filter]");
  const searchInput = document.getElementById("newsSearch");
  const newsCards = document.querySelectorAll(".news-grid-card");
  const emptyState = document.getElementById("newsEmptyState");

  let activeCategory = "all";

  function filterNews() {
    if (!newsCards.length) return;
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    newsCards.forEach((card) => {
      const cat = card.dataset.category || "";
      const text = card.textContent.toLowerCase();
      const matchCat = activeCategory === "all" || cat === activeCategory;
      const matchSearch = !query || text.includes(query);

      if (matchCat && matchSearch) {
        card.classList.remove("is-hidden");
        visibleCount++;
      } else {
        card.classList.add("is-hidden");
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.removeAttribute("hidden");
      } else {
        emptyState.setAttribute("hidden", "");
      }
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.newsFilter || "all";
      filterNews();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterNews);
  }

  // 6. Modale szczegółów projektów (Projekty)
  const projectData = {
    rys: {
      cat: "01 / WSPARCIE TWÓRCÓW · PUBLIKACJE",
      title: "Tajemnica „Rysia” z Oddziału 993/W",
      body: `
        <p>Publikacja autorstwa Wojciecha Königsberga i prof. Remigiusza Wiśniewskiego odsłania nieznane dotąd karty historii por. Jana Nowickiego „Rysia” — żołnierza oddziału bojowego kontrwywiadu Komendy Głównej Armii Krajowej 993/W.</p>
        <p>Przez ponad osiem dekad jego prawdziwa tożsamość pozostawała ukryta w archiwalnych szyfrogramach. Projekt obejmuje wsparcie wydawnicze, premierę w Muzeum Powstania Warszawskiego oraz cykl spotkań autorskich i edukacyjnych w całej Polsce.</p>
        <p><strong>Partnerzy inicjatywy:</strong> Muzeum Powstania Warszawskiego, środowisko badaczy historii AK, wydawcy i instytucje kultury.</p>
      `
    },
    powstanie: {
      cat: "02 / DOKUMENTACJA HISTORII",
      title: "Śladami walk i pamięci — Powstanie Warszawskie",
      body: `
        <p>Projekt poświęcony dokumentowaniu szlaku bojowego powstańców warszawskich, archiwizacji relacji, fotografii oraz upowszechnianiu wiedzy historycznej wśród młodego pokolenia.</p>
        <p>Fundacja uczestniczy w uroczystościach rocznicowych, przygotowuje materiały dokumentacyjne oraz wspiera inicjatywy edukacyjne przybliżające realia 1944 roku.</p>
      `
    },
    groby: {
      cat: "03 / UPAMIĘTNIENIE LUDZI I WYDARZEŃ",
      title: "Symboliczne groby powstańców",
      body: `
        <p>Inicjatywa mająca na celu trwałe upamiętnienie żołnierzy Armii Krajowej i uczestników Powstania Warszawskiego, których miejsca spoczynku pozostają nieznane.</p>
        <p>Dzięki współpracy Fundacji Przeszłość Jutra oraz Muzeum Powstania Warszawskiego 25 września 2026 roku na Cmentarzu Wojskowym na Powązkach upamiętniono por. Jana Nowickiego „Rysia” oraz łączniczkę „Halinkę”.</p>
      `
    }
  };

  const projectModal = document.getElementById("projectModal");
  const closeProjectModal = document.getElementById("closeProjectModal");
  if (projectModal) {
    document.querySelectorAll("[data-project-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = projectData[btn.dataset.projectModal];
        if (!item) return;
        document.getElementById("projectModalCat").textContent = item.cat;
        document.getElementById("projectModalTitle").textContent = item.title;
        document.getElementById("projectModalBody").innerHTML = item.body;
        projectModal.removeAttribute("hidden");
      });
    });

    if (closeProjectModal) {
      closeProjectModal.addEventListener("click", () => projectModal.setAttribute("hidden", ""));
    }
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) projectModal.setAttribute("hidden", "");
    });
  }

  // 7. Modale pełnych artykułów (Aktualności)
  const articleData = {
    powazki: {
      cat: "WYDARZENIA",
      date: "25 września 2026",
      title: "Upamiętniliśmy por. Jana Nowickiego „Rysia” i łączniczkę „Halinkę”",
      body: `
        <p>25 września 2026 roku na Powązkach Wojskowych w Warszawie odbyła się uroczystość upamiętniająca żołnierza Armii Krajowej por. Jana Nowickiego „Rysia” oraz łączniczkę „Halinkę”.</p>
        <p>Inicjatywa Fundacji Przeszłość Jutra i Muzeum Powstania Warszawskiego przywraca pamięć o uczestnikach Powstania Warszawskiego, których miejsca pochówku pozostają nieznane. Symboliczne upamiętnienie stanowi wyraz hołdu dla ich odwagi i służby.</p>
        <p>W wydarzeniu uczestniczyli przedstawiciele instytucji pamięci, badacze historii oraz osoby zaangażowane w odkrywanie losów żołnierzy Oddziału 993/W.</p>
      `
    },
    historia: {
      cat: "HISTORIA I BADANIA",
      date: "12 maja 2026",
      title: "Historia Jana Nowickiego „Rysia” ponownie odkryta",
      body: `
        <p>Wieloletnie kwerendy archiwalne oraz analiza dokumentów kontrwywiadu Armii Krajowej pozwoliły po ponad osiemdziesięciu latach ustalić pełną tożsamość por. Jana Nowickiego „Rysia”.</p>
        <p>Odkrycie to otworzyło drogę do rekonstrukcji jego przedwojennych losów, działalności konspiracyjnej oraz udziału w Powstaniu Warszawskim.</p>
      `
    },
    enigma: {
      cat: "WYDARZENIA",
      date: "17 września 2026",
      title: "Spotkanie poświęcone „Rysiowi” w Centrum Szyfrów Enigma",
      body: `
        <p>W poznańskim Centrum Szyfrów Enigma odbyło się spotkanie otwarte poświęcone Janowi Nowickiemu „Rysiowi” — jego związkom z Poznaniem, środowiskiem Dębca oraz przedwojennym Lechem Poznań.</p>
        <p>Uczestnicy spotkania poznali kulisy pracy badawczej nad odszyfrowaniem jego konspiracyjnej biografii.</p>
      `
    },
    ksiazka: {
      cat: "PUBLIKACJE",
      date: "10 kwietnia 2026",
      title: "Książka Wojciecha Königsberga i prof. Remigiusza Wiśniewskiego i kolejne plany wydawnicze",
      body: `
        <p>Publikacja „Tajemnica «Rysia» z Oddziału 993/W” spotkała się z dużym zainteresowaniem czytelników i historyków. Książka dokumentuje nie tylko losy pojedynczego żołnierza, lecz także realia funkcjonowania kontrwywiadu AK.</p>
        <p>Fundacja Przeszłość Jutra planuje kolejne działania wydawnicze oraz spotkania autorskie popularyzujące rzetelne badania historyczne.</p>
      `
    },
    inicjatywa: {
      cat: "PROJEKTY",
      date: "3 marca 2026",
      title: "Inicjatywa upamiętnienia nieznanych miejsc pochówku powstańców",
      body: `
        <p>Rozpoczęliśmy prace organizacyjne i merytoryczne nad projektem symbolicznego upamiętnienia powstańców warszawskich, których mogiły nie zachowały się do naszych czasów.</p>
      `
    },
    wspolpraca: {
      cat: "WSPÓŁPRACA",
      date: "18 lutego 2026",
      title: "Fundacja Przeszłość Jutra rozwija współpracę z instytucjami",
      body: `
        <p>Budujemy partnerstwa z muzeami, archiwami oraz instytucjami kultury, aby wspólnie realizować projekty dokumentacyjne, edukacyjne i wydawnicze.</p>
      `
    },
    zycie: {
      cat: "Z ŻYCIA FUNDACJI",
      date: "5 lutego 2026",
      title: "Nad czym obecnie pracujemy?",
      body: `
        <p>Przygotowujemy kolejne wydarzenia rocznicowe, spotkania autorskie oraz nowe projekty dokumentacyjne. Zapraszamy badaczy, instytucje i darczyńców do wspólnego działania.</p>
      `
    }
  };

  const articleModal = document.getElementById("articleModal");
  const closeArticleModal = document.getElementById("closeArticleModal");
  const backToAllNews = document.getElementById("backToAllNews");
  if (articleModal) {
    document.querySelectorAll("[data-article-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = articleData[btn.dataset.articleModal];
        if (!item) return;
        document.getElementById("articleModalCat").textContent = item.cat;
        document.getElementById("articleModalDate").textContent = item.date;
        document.getElementById("articleModalTitle").textContent = item.title;
        document.getElementById("articleModalBody").innerHTML = item.body;
        articleModal.removeAttribute("hidden");
      });
    });

    const hideArticle = () => articleModal.setAttribute("hidden", "");
    if (closeArticleModal) closeArticleModal.addEventListener("click", hideArticle);
    if (backToAllNews) backToAllNews.addEventListener("click", hideArticle);
    articleModal.addEventListener("click", (e) => {
      if (e.target === articleModal) hideArticle();
    });
  }

  // 8. Obsługa formularzy (Kontakt i Współpraca)
  function setupForm(formId, statusId, subjectPrefix) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Proszę uzupełnić wszystkie wymagane pola oraz zaakceptować zgodę.";
        form.reportValidity();
        return;
      }
      const name = form.querySelector("[name='name']").value.trim();
      const email = form.querySelector("[name='email']").value.trim();
      const topic = form.querySelector("[name='topic']").value;
      const message = form.querySelector("[name='message']").value.trim();

      status.textContent = `Dziękujemy, ${name}! Twoje zgłoszenie (${topic}) zostało przyjęte. Możesz również wysłać je bezpośrednio na adres fundacja@przeszloscjutra.pl.`;

      const mailSubject = encodeURIComponent(`${subjectPrefix}: ${topic} — ${name}`);
      const mailBody = encodeURIComponent(`Imię i nazwisko: ${name}
E-mail: ${email}
Temat: ${topic}

Wiadomość:
${message}`);
      const mailtoLink = document.createElement("a");
      mailtoLink.href = `mailto:fundacja@przeszloscjutra.pl?subject=${mailSubject}&body=${mailBody}`;
      mailtoLink.textContent = " Otwórz w programie pocztowym ↗";
      mailtoLink.className = "text-link";
      status.appendChild(mailtoLink);

      form.reset();
    });
  }

  setupForm("contactForm", "contactFormStatus", "Kontakt ze strony");
  setupForm("coopForm", "coopFormStatus", "Propozycja współpracy");
});
