#!/bin/bash
# Build travelbahia.com into ./site (macOS: uses built-in JavaScript for Automation — nothing to install).
# On any OS with Node.js you can instead run: node build-node.js
set -e
cd "$(dirname "$0")"
SRC="src/config.js src/art.js src/content-destinations.js src/content-articles.js src/content-stays.js src/photos.js src/templates.js src/build.js"
TMP="$(mktemp -t travelbahia).js"
cat $SRC tools/jxa-runner.js > "$TMP"
rm -rf site && mkdir -p site
cp -R public/ site/
osascript -l JavaScript "$TMP" "$(pwd)/site"
rm -f "$TMP"
echo "Done → $(pwd)/site"
