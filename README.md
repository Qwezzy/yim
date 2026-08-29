# YIM website (2026 rebuild)

Static site for Yakha Ikusasa Manje. No Bootstrap. No jQuery. Header/footer injected by `js/main.js`.

## Brand
- **New official logo:** five-people circle lockup.
- Light version (white background): `assets/logo-light.png` (attached `1.png`)
- Dark version (black background): `assets/logo-dark.png` (attached `2.png`)
- Both are also embedded as data URIs in `js/logos.js` so they load even if the PNG files are missing from the host.
- Header and hero use the light mark. Footer (dark bar) uses the dark mark.
- Palette: green `#2f9e3a`, gold `#f0c400`, blue `#1d4ed8`, red `#e11d2a`, ink `#161616`.

## Pages
`index.html` `about.html` `programmes.html` `impact.html` `gallery.html` `team.html` `events.html` `donate.html` `contact.html`

## Donations
`donate.html` posts to PayFast. Edit `js/config.js` to leave sandbox and to add the real bank account.
