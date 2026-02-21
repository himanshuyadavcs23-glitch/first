 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/stake-mba-visual.user.js b/stake-mba-visual.user.js
new file mode 100644
index 0000000000000000000000000000000000000000..e794eddb36fa3345381f79bc4046b4f036963589
--- /dev/null
+++ b/stake-mba-visual.user.js
@@ -0,0 +1,195 @@
+// ==UserScript==
+// @name         Stake.mba Visual Tweaks
+// @namespace    https://stake.mba/
+// @version      1.0.0
+// @description  Customize the look and readability of stake.mba with a dark mode polish and quality-of-life visual controls.
+// @author       Codex
+// @match        https://stake.mba/*
+// @run-at       document-idle
+// @grant        GM_addStyle
+// @grant        GM_getValue
+// @grant        GM_setValue
+// @grant        GM_registerMenuCommand
+// ==/UserScript==
+
+(function () {
+  'use strict';
+
+  const STORAGE_KEY = 'stake_mba_visual_settings_v1';
+
+  const defaultSettings = {
+    glassCards: true,
+    compactLayout: false,
+    hidePromos: false,
+    fontScale: 1,
+    accentColor: '#56ccf2'
+  };
+
+  const styleId = 'stake-mba-visual-tweaks-style';
+
+  function mergeSettings(value) {
+    if (!value || typeof value !== 'object') return { ...defaultSettings };
+    return { ...defaultSettings, ...value };
+  }
+
+  async function readSettings() {
+    const saved = await GM_getValue(STORAGE_KEY, defaultSettings);
+    return mergeSettings(saved);
+  }
+
+  async function writeSettings(next) {
+    await GM_setValue(STORAGE_KEY, mergeSettings(next));
+  }
+
+  function css(settings) {
+    const cardBackground = settings.glassCards
+      ? 'rgba(255,255,255,0.07)'
+      : 'rgba(20,20,20,0.95)';
+
+    const sectionPadding = settings.compactLayout ? '0.55rem' : '1rem';
+    const promoSelector = settings.hidePromos
+      ? '.promo, .advertisement, [class*="promo" i], [id*="promo" i], [class*="banner" i], [id*="banner" i]'
+      : null;
+
+    const rootFontScale = Number(settings.fontScale) > 0 ? Number(settings.fontScale) : 1;
+    const accentColor = settings.accentColor || defaultSettings.accentColor;
+
+    return `
+      :root {
+        --smba-accent: ${accentColor};
+        --smba-font-scale: ${rootFontScale};
+      }
+
+      html {
+        font-size: calc(16px * var(--smba-font-scale));
+      }
+
+      body {
+        background: radial-gradient(circle at top left, #1e293b 0%, #0b1120 40%, #05070e 100%) fixed !important;
+        color: #e5e7eb !important;
+      }
+
+      a, button {
+        transition: all .2s ease;
+      }
+
+      a:hover, button:hover {
+        filter: brightness(1.08);
+      }
+
+      .card,
+      [class*="card" i],
+      [class*="panel" i],
+      [class*="widget" i] {
+        background: ${cardBackground} !important;
+        border: 1px solid rgba(255, 255, 255, 0.12) !important;
+        border-radius: 12px !important;
+        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28) !important;
+        backdrop-filter: blur(8px);
+      }
+
+      .container,
+      [class*="container" i],
+      [class*="section" i] {
+        padding-top: ${sectionPadding} !important;
+        padding-bottom: ${sectionPadding} !important;
+      }
+
+      .btn,
+      button,
+      [class*="button" i] {
+        border-radius: 10px !important;
+      }
+
+      .btn-primary,
+      [class*="primary" i] {
+        background: linear-gradient(135deg, var(--smba-accent), #3f8cff) !important;
+        border: none !important;
+      }
+
+      input,
+      textarea,
+      select {
+        background-color: rgba(16, 24, 40, 0.7) !important;
+        color: #f9fafb !important;
+        border: 1px solid rgba(255, 255, 255, 0.2) !important;
+        border-radius: 8px !important;
+      }
+
+      ${promoSelector ? `${promoSelector} { display: none !important; }` : ''}
+    `;
+  }
+
+  function renderStyle(settings) {
+    const old = document.getElementById(styleId);
+    if (old) old.remove();
+
+    const style = document.createElement('style');
+    style.id = styleId;
+    style.textContent = css(settings);
+    document.head.appendChild(style);
+  }
+
+  async function toggle(key, label) {
+    const settings = await readSettings();
+    settings[key] = !settings[key];
+    await writeSettings(settings);
+    renderStyle(settings);
+    alert(`${label}: ${settings[key] ? 'ON' : 'OFF'}`);
+  }
+
+  async function setFontScale() {
+    const settings = await readSettings();
+    const input = prompt('Set font scale (e.g. 0.9, 1, 1.1, 1.2):', String(settings.fontScale));
+    if (input === null) return;
+    const parsed = Number(input.trim());
+    if (!Number.isFinite(parsed) || parsed <= 0.5 || parsed > 2) {
+      alert('Please enter a number between 0.5 and 2.');
+      return;
+    }
+    settings.fontScale = parsed;
+    await writeSettings(settings);
+    renderStyle(settings);
+  }
+
+  async function setAccentColor() {
+    const settings = await readSettings();
+    const input = prompt('Set accent color in HEX format (e.g. #56ccf2):', settings.accentColor);
+    if (input === null) return;
+    const trimmed = input.trim();
+    if (!/^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(trimmed)) {
+      alert('Please provide a valid hex color like #56ccf2.');
+      return;
+    }
+    settings.accentColor = trimmed;
+    await writeSettings(settings);
+    renderStyle(settings);
+  }
+
+  async function resetSettings() {
+    await writeSettings(defaultSettings);
+    renderStyle(defaultSettings);
+    alert('Visual settings reset to defaults.');
+  }
+
+  function registerMenu() {
+    GM_registerMenuCommand('Toggle glass cards', () => toggle('glassCards', 'Glass cards'));
+    GM_registerMenuCommand('Toggle compact layout', () => toggle('compactLayout', 'Compact layout'));
+    GM_registerMenuCommand('Toggle hide promos', () => toggle('hidePromos', 'Hide promos'));
+    GM_registerMenuCommand('Set font scale', setFontScale);
+    GM_registerMenuCommand('Set accent color', setAccentColor);
+    GM_registerMenuCommand('Reset settings', resetSettings);
+  }
+
+  async function boot() {
+    const settings = await readSettings();
+    renderStyle(settings);
+    registerMenu();
+  }
+
+  if (document.readyState === 'loading') {
+    document.addEventListener('DOMContentLoaded', boot, { once: true });
+  } else {
+    boot();
+  }
+})();
 
EOF
)
