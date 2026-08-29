(function () {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  function header() {
    return `<div class="brand-bar"></div><header class="site"><div class="wrap nav"><a class="logo" href="index.html"><img src="${(window.YIM_LOGOS && window.YIM_LOGOS.light) || 'assets/logo-light.png'}" alt="YIM logo"><span>Yakha Ikusasa Manje</span></a><button class="menu-btn" id="menuBtn" aria-label="Menu">☰</button><nav class="nav-links" id="navLinks"><a href="index.html" data-page="index.html">Home</a><a href="about.html" data-page="about.html">About</a><a href="programmes.html" data-page="programmes.html">Programmes</a><a href="events.html" data-page="events.html">Events</a><a href="contact.html" data-page="contact.html">Contact</a><a class="btn btn-yellow" href="donate.html">Donate</a></nav></div></header>`;
  }
  function footer() {
    const y = new Date().getFullYear();
    return `<footer class="site"><div class="wrap grid"><div><img src="${(window.YIM_LOGOS && window.YIM_LOGOS.dark) || 'assets/logo-dark.png'}" alt="YIM" style="height:72px;background:#000;border-radius:12px;padding:.4rem"><p>Established in 2004 as an NPC. Registered NPO and PBO.</p></div><div><strong>Visit</strong><p>850 Bheka Street<br>Kingsway, Benoni, 1501<br>Tel: +27 11 423 3370<br>info@yim.org.za</p></div><div><strong>Follow</strong><p><a href="https://www.facebook.com/YIManje/">Facebook</a><br><a href="https://x.com/YIManje">X</a><br><a href="https://za.linkedin.com/company/yakha-ikusasa-manje">LinkedIn</a></p></div></div><div class="wrap fine">© ${y} Yakha Ikusasa Manje</div></footer>`;
  }
  document.body.insertAdjacentHTML("afterbegin", header());
  document.body.insertAdjacentHTML("beforeend", footer());
  const heroLogo = document.getElementById("heroLogo");
  if (heroLogo && window.YIM_LOGOS && window.YIM_LOGOS.light) heroLogo.src = window.YIM_LOGOS.light;
  document.querySelectorAll(".nav-links a").forEach((a) => { if (a.dataset.page === path) a.classList.add("active"); });
  document.getElementById("menuBtn")?.addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
})();
