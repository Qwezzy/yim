(function () {
  const cfg = window.YIM || {}; const pf = cfg.payfast || {}; const amounts = [150, 350, 750, 1500]; let selected = 350;
  const grid = document.getElementById("amounts"); const customInput = document.getElementById("customAmount"); const totalEl = document.getElementById("totalLabel"); const form = document.getElementById("donateForm"); const modeNote = document.getElementById("modeNote"); const bankBox = document.getElementById("bankBox");
  if (grid) { grid.innerHTML = amounts.map((n) => `<button type="button" class="amt${n === selected ? " active" : ""}" data-amt="${n}">R${n}</button>`).join(""); grid.addEventListener("click", (e) => { const btn = e.target.closest("[data-amt]"); if (!btn) return; selected = Number(btn.dataset.amt); if (customInput) customInput.value = ""; grid.querySelectorAll(".amt").forEach((b) => b.classList.toggle("active", b === btn)); updateTotal(); }); }
  customInput?.addEventListener("input", () => { const v = Number(customInput.value); if (v > 0) { selected = v; grid.querySelectorAll(".amt").forEach((b) => b.classList.remove("active")); updateTotal(); } });
  function updateTotal() { if (totalEl) totalEl.textContent = `R${Number(selected).toFixed(2)}`; } updateTotal();
  if (modeNote) modeNote.textContent = pf.sandbox ? "PayFast sandbox is active. No live money is taken until js/config.js is switched to live merchant details." : "Live PayFast payments are enabled.";
  if (bankBox && cfg.bank) { const b = cfg.bank; bankBox.innerHTML = `<div><b>Account name</b><br>${b.name}</div><div style="margin-top:.6rem"><b>Bank</b><br>${b.bank}</div><div style="margin-top:.6rem"><b>Account</b><br>${b.account} (${b.type})</div><div style="margin-top:.6rem"><b>Branch</b><br>${b.branch}</div><div style="margin-top:.6rem"><b>Reference</b><br>${b.referenceHint}</div>`; }
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("donorName").value.trim(); const email = document.getElementById("donorEmail").value.trim(); const freq = document.getElementById("freq").value; const cause = document.getElementById("cause").value; const amount = Number(selected);
    if (!name || !email || amount < 10) { alert("Please enter your name, email, and an amount of at least R10."); return; }
    const action = pf.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";
    const origin = location.origin + location.pathname.replace(/[^/]+$/, "");
    const fields = { merchant_id: pf.merchantId, merchant_key: pf.merchantKey, return_url: pf.returnUrl || origin + "donate.html?status=thanks", cancel_url: pf.cancelUrl || origin + "donate.html?status=cancel", name_first: name.split(" ")[0], name_last: name.split(" ").slice(1).join(" ") || "Donor", email_address: email, amount: amount.toFixed(2), item_name: "YIM donation — " + cause, item_description: (freq === "monthly" ? "Monthly" : "Once-off") + " donation to Yakha Ikusasa Manje", custom_str1: cause, custom_str2: freq };
    const pfForm = document.createElement("form"); pfForm.method = "POST"; pfForm.action = action;
    Object.entries(fields).forEach(([k, v]) => { const input = document.createElement("input"); input.type = "hidden"; input.name = k; input.value = v; pfForm.appendChild(input); });
    document.body.appendChild(pfForm); pfForm.submit();
  });
  const status = new URLSearchParams(location.search).get("status"); const banner = document.getElementById("statusBanner");
  if (banner && status === "thanks") { banner.hidden = false; banner.textContent = "Thank you. If the PayFast payment completed, YIM has received your gift."; }
  if (banner && status === "cancel") { banner.hidden = false; banner.textContent = "Payment was cancelled. You can try again or use the EFT details below."; }
})();
