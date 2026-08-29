(function () {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const logos = window.YIM_LOGOS || {};
  const light = logos.light || "assets/logo-light.png";
  const dark = logos.dark || "assets/logo-dark.png";
  const lightFile = logos.localLight || "assets/logo-light.png";
  const darkFile = logos.localDark || "assets/logo-dark.png";

  function header() {
    return `
      <div class="brand-bar"></div>
      <header class="site">
        <div class="wrap nav">
          <a class="logo" href="index.html">
            <img src="${light}" alt="Yakha Ikusasa Manje" onerror="this.onerror=null;this.src='${lightFile}'">
          </a>
          <button class="menu-btn" id="menuBtn" aria-label="Menu">☰</button>
          <nav class="nav-links" id="navLinks">
            <a href="index.html" data-page="index.html">Home</a>
            <a href="about.html" data-page="about.html">About</a>
            <a href="programmes.html" data-page="programmes.html">Programmes</a>
            <a href="impact.html" data-page="impact.html">Impact</a>
            <a href="gallery.html" data-page="gallery.html">Gallery</a>
            <a href="team.html" data-page="team.html">Team</a>
            <a href="events.html" data-page="events.html">Events</a>
            <a href="contact.html" data-page="contact.html">Contact</a>
            <a class="btn btn-yellow" href="donate.html">Donate</a>
          </nav>
        </div>
      </header>`;
  }

  function footer() {
    const y = new Date().getFullYear();
    return `
      <footer class="site">
        <div class="wrap grid">
          <div>
            <img src="${dark}" alt="Yakha Ikusasa Manje" class="footer-logo" onerror="this.onerror=null;this.src='${darkFile}'">
            <p>Established in 2004 as a Section 21 / NPC. Registered NPO 044-732 and PBO 9565369197. Working across Gauteng, Mpumalanga and KwaZulu-Natal.</p>
          </div>
          <div>
            <strong>Visit</strong>
            <p>850 Bheka Street<br>Kingsway, Benoni, 1501<br>Tel: +27 11 423 3370<br>Cell: 083 654 9014<br>info@yim.org.za</p>
          </div>
          <div>
            <strong>Follow</strong>
            <p>
              <a href="https://www.facebook.com/YIManje/">Facebook</a><br>
              <a href="https://x.com/YIManje">X / Twitter</a><br>
              <a href="https://za.linkedin.com/company/yakha-ikusasa-manje">LinkedIn</a>
            </p>
          </div>
        </div>
        <div class="wrap fine">© ${y} Yakha Ikusasa Manje Health Development Centre. Figures on this site are drawn from the 2023 and 2024–2025 annual reports.</div>
      </footer>`;
  }

  document.body.insertAdjacentHTML("afterbegin", header());
  document.body.insertAdjacentHTML("beforeend", footer());
  const heroLogo = document.getElementById("heroLogo");
  if (heroLogo) {
    heroLogo.src = light;
    heroLogo.addEventListener("error", function once() {
      heroLogo.removeEventListener("error", once);
      heroLogo.src = lightFile;
    });
  }

  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.dataset.page === path) a.classList.add("active");
  });

  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");
  btn?.addEventListener("click", () => links.classList.toggle("open"));
})();
