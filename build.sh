#!/bin/bash
# Build travelbahia.com into THIS folder (the top level), ready for GitHub Pages.
# macOS: uses built-in JavaScript for Automation — nothing to install.
# On any OS with Node.js you can instead run: node build-node.js
#
# Safety: only files/folders a previous build created (listed in .generated) are replaced.
# Source files (src, public, tools, originals, build scripts, README.md, .claude, .git) are never touched.
set -e
cd "$(dirname "$0")"
ROOT="$(pwd)"
SRC="src/config.js src/art.js src/content-destinations.js src/content-articles.js src/content-stays.js src/photos.js src/templates.js src/build.js"
TMPJS="$(mktemp -t travelbahia).js"
OUT="$(mktemp -d -t travelbahia-site)"

cat $SRC tools/jxa-runner.js > "$TMPJS"
cp -R public/ "$OUT/"
osascript -l JavaScript "$TMPJS" "$OUT" >/dev/null
rm -f "$TMPJS"
printf 'travelbahia.com\n' > "$OUT/CNAME"   # custom domain for GitHub Pages

# remove the previous build's output (and only that)
if [ -f .generated ]; then
  while IFS= read -r p; do
    case "$p" in ""|.|..|src|public|tools|originals|build.sh|build-node.js|README.md|.git|.github|.claude|.DS_Store|.generated) continue ;; esac
    rm -rf "$ROOT/$p"
  done < .generated
fi

# copy the new build into this folder and remember what it contains
( cd "$OUT" && ls -A ) > .generated
cp -R "$OUT"/. "$ROOT"/
rm -rf "$OUT"
# photo check: warns if a photo is used twice or a name/heading is wrong
CHK="$(mktemp -t travelbahia-check).js"; cat $SRC tools/check-photos.js tools/check-runner.js > "$CHK"; osascript -l JavaScript "$CHK" | sed "s/^/  photos: /"; rm -f "$CHK"
echo "Done → $ROOT (preview: perl tools/serve.pl 8081, then open http://localhost:8081)"
