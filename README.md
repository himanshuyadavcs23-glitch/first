 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index b169076c3efe3c5e95011081f1ce1c02c537dd19..e3976988424f28043da834aa7d3e0edbf2115234 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,26 @@
-# first
\ No newline at end of file
+# first
+
+## Stake.mba visual userscript
+
+This repository now includes a Tampermonkey userscript for visual customization of `stake.mba`:
+
+- `stake-mba-visual.user.js`
+
+### Features
+
+- Glass-style cards for panels/widgets
+- Optional compact spacing
+- Optional promotional/banner hiding
+- Adjustable global font scale
+- Customizable accent color
+- Persistent settings using Tampermonkey storage
+- Menu commands for toggles and quick reset
+
+### Install
+
+1. Install Tampermonkey in your browser.
+2. Create a new userscript.
+3. Paste the contents of `stake-mba-visual.user.js`.
+4. Save and visit `https://stake.mba/`.
+
+Use the Tampermonkey menu on the page to toggle visual options.
 
EOF
)
