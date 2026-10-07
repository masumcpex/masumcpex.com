
(function () {
  "use strict";

  /* Service worker: updateViaCache "none" so a new version is picked up quickly */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js", { updateViaCache: "none" }).catch((err) => {
        console.warn("[PWA] Service worker registration failed:", err);
      });
    });
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true /* iOS Safari */
    );
  }

  if (isStandalone()) return; /* already installed: no install button needed */

  var DEBUG = /(?:^|[?&])pwa=debug(?:&|$)/.test(location.search);
  var dbg = { bip: "not fired yet", installed: "no" };
  window.addEventListener("beforeinstallprompt", function () { dbg.bip = "FIRED ✔ (Chrome says installable)"; if (DEBUG) renderDebug(); });
  window.addEventListener("appinstalled", function () { dbg.installed = "yes"; if (DEBUG) renderDebug(); });

  var DISMISS_KEY = "masumcpex_install_dismissed_at";
  var DISMISS_DAYS = 14;

  function readDismissed() {
    try { return localStorage.getItem(DISMISS_KEY); } catch (e) { return null; }
  }
  function writeDismissed() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
  }
  function clearDismissed() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (e) {}
  }
  function wasRecentlyDismissed() {
    var raw = readDismissed();
    if (!raw) return false;
    return (Date.now() - Number(raw)) / 86400000 < DISMISS_DAYS;
  }

  /* The button follows the page: WorkTrack gets "Install WorkTrack" in the navy brand colour. */
  function appLabel() {
    var m = document.querySelector('meta[name="application-name"]');
    return m && m.content ? m.content : "";
  }
  function themeColor() {
    var m = document.querySelector('meta[name="theme-color"]');
    return m && m.content ? m.content : "#0E6E5C";
  }

  var deferredPrompt = null;
  var box = null;

  var ICON_DOWNLOAD =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>';

  function ensureStyle() {
    if (document.getElementById("pwaInstallStyle")) return;
    var style = document.createElement("style");
    style.id = "pwaInstallStyle";
    style.textContent =
      "#pwaInstallBtn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:9999;display:flex;align-items:stretch;" +
      "border-radius:999px;overflow:hidden;color:#fff;box-shadow:0 10px 30px rgba(16,24,40,.25);opacity:0;transform:translateY(12px);" +
      "transition:transform .2s ease,opacity .2s ease;font-family:'Hind Siliguri','Inter',system-ui,sans-serif;}" +
      "#pwaInstallBtn.show{opacity:1;transform:translateY(0);}" +
      "#pwaInstallBtn button{all:unset;box-sizing:border-box;cursor:pointer;color:inherit;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;}" +
      "#pwaInstallBtn .pwa-main{padding:12px 6px 12px 16px;min-height:44px;}" +
      "#pwaInstallBtn .pwa-close{padding:12px 14px 12px 8px;min-width:40px;min-height:44px;justify-content:center;opacity:.8;font-size:13px;}" +
      "#pwaInstallBtn button:focus-visible{outline:2px solid #fff;outline-offset:-4px;border-radius:999px;}" +
      "#pwaInstallBtn button:active{opacity:.85;}" +
      "@media (max-width:480px){#pwaInstallBtn{right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));}#pwaInstallBtn button{font-size:13px;}}";
    document.head.appendChild(style);
  }

  function createInstallButton(label, onMain, hint) {
    if (document.getElementById("pwaInstallBtn")) return;
    ensureStyle();
    box = document.createElement("div");
    box.id = "pwaInstallBtn";
    box.style.background = themeColor();
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", label);
    box.innerHTML =
      '<button type="button" class="pwa-main" aria-label="' + label + '">' + ICON_DOWNLOAD + "<span>" + label + "</span></button>" +
      '<button type="button" class="pwa-close" aria-label="Dismiss">&#10005;</button>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("show"); });

    box.querySelector(".pwa-main").addEventListener("click", function () { onMain(hint); });
    box.querySelector(".pwa-close").addEventListener("click", dismiss);
  }

  function removeButton() {
    if (box && box.parentNode) box.parentNode.removeChild(box);
    box = null;
  }

  function dismiss() {
    writeDismissed();
    removeButton();
  }

  async function runInstall() {
    if (!deferredPrompt) return;
    var main = box && box.querySelector(".pwa-main");
    if (main) main.disabled = true;
    deferredPrompt.prompt();
    var choice = await deferredPrompt.userChoice.catch(function () { return null; });
    deferredPrompt = null;
    removeButton();
    if (!choice || choice.outcome !== "accepted") writeDismissed();
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (!wasRecentlyDismissed()) {
      var name = appLabel();
      createInstallButton(name ? "Install " + name : "Install App", runInstall);
    }
  });

  window.addEventListener("appinstalled", function () {
    removeButton();
    clearDismissed();
  });

  /* ---- Diagnostics: open the page with ?pwa=debug to see why Chrome does or does not offer "Install" ---- */
  var dbgLines = [];
  async function collectDebug() {
    var L = [];
    var ua = navigator.userAgent || "";
    var mobileUA = /android.+mobile|iphone|ipad/i.test(ua);
    L.push("URL: " + location.pathname + location.search);
    L.push("Secure (https): " + window.isSecureContext);
    L.push("Mobile browser mode: " + (mobileUA ? "yes" : "NO  ← 'Desktop site' is probably ON"));
    L.push("Screen width (css px): " + window.innerWidth + "  dpr " + window.devicePixelRatio);
    L.push("Opened as installed app: " + (window.matchMedia("(display-mode: standalone)").matches ? "yes" : "no"));
    var link = document.querySelector('link[rel="manifest"]');
    L.push("Manifest link: " + (link ? link.getAttribute("href") : "MISSING"));
    if (link) {
      try {
        var r = await fetch(link.href, { cache: "no-store" });
        L.push("Manifest fetch: " + r.status + " " + (r.headers.get("content-type") || ""));
        var m = await r.json();
        L.push("  name: " + m.name + " | id: " + m.id);
        L.push("  scope: " + m.scope + " | start: " + m.start_url);
        for (var i = 0; i < (m.icons || []).length; i++) {
          var ic = m.icons[i];
          try { var ir = await fetch(ic.src, { cache: "no-store" }); L.push("  icon " + ic.sizes + " " + ic.purpose + ": " + ir.status); }
          catch (e) { L.push("  icon " + ic.sizes + ": ERROR"); }
        }
      } catch (e) { L.push("Manifest fetch/parse: ERROR " + e.message); }
    }
    try {
      var reg = await navigator.serviceWorker.getRegistration();
      L.push("Service worker: " + (reg ? (reg.active ? reg.active.state : "installing/waiting") : "none") + " | controls this page: " + !!navigator.serviceWorker.controller);
      if (reg && reg.active) {
        var t = await (await fetch("/service-worker.js", { cache: "no-store" })).text();
        L.push("  service-worker.js file: " + (/v2\.0\.0/.test(t) ? "NEW (v2)" : "OLD version"));
      }
    } catch (e) { L.push("Service worker: ERROR " + e.message); }
    L.push("Install event: " + dbg.bip);
    L.push("App already installed (this session): " + dbg.installed);
    L.push("'Not now' saved: " + (readDismissed() ? "yes (button hidden for " + DISMISS_DAYS + " days)" : "no"));
    return L;
  }
  async function renderDebug() {
    var el = document.getElementById("pwaDebug");
    if (!el) {
      el = document.createElement("pre");
      el.id = "pwaDebug";
      el.style.cssText = "position:fixed;left:6px;right:6px;top:6px;z-index:2147483647;margin:0;padding:10px;background:rgba(15,23,42,.94);color:#e2e8f0;font:12px/1.45 monospace;white-space:pre-wrap;word-break:break-word;border-radius:10px;max-height:92vh;overflow:auto;";
      document.body.appendChild(el);
    }
    dbgLines = await collectDebug();
    el.textContent = "PWA CHECK (send a screenshot)\n\n" + dbgLines.join("\n");
  }
  if (DEBUG) {
    window.addEventListener("load", function () { setTimeout(renderDebug, 1500); setTimeout(renderDebug, 6000); });
  }

  /* iPhone / iPad Safari has no install prompt: show a short "Add to Home Screen" hint instead. */
  var ua = navigator.userAgent || "";
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);
  if (isIOS && isSafari && !wasRecentlyDismissed()) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (document.getElementById("pwaInstallBtn") || isStandalone()) return;
        var name = appLabel() || "this app";
        createInstallButton("Add " + name + " to Home Screen", function () {
          alert("To install: tap the Share button in Safari, then choose \"Add to Home Screen\".");
        });
      }, 2500);
    });
  }
})();
