#!/usr/bin/env bash
set -euo pipefail

echo "Env setup (Linux) — Debian/Ubuntu style example"

cat <<'EOF'
Steps (manual):
1) Install build deps (Debian/Ubuntu):
   sudo apt update && sudo apt install -y build-essential python3 curl

2) Install nvm (if not present):
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

3) Install/use Node (example Node 18):
   nvm install 18
   nvm use 18

4) In project root, install deps and rebuild native modules:
   cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
   npm install
   npm rebuild --update-binary

EOF

echo "Done — follow the printed steps in this shell." 
