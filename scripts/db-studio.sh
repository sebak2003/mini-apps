#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# --- Load env vars ---
if [ -f "$ROOT_DIR/.env.local" ]; then
  set -a
  source <(grep -v '^\s*#' "$ROOT_DIR/.env.local" | grep -v '^\s*$')
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL not set. Add it to .env.local"
  exit 1
fi

# --- Find an app with drizzle.config.ts to use as base ---
CONFIG_APP=""
for config in "$ROOT_DIR"/apps/*/drizzle.config.ts; do
  [ -f "$config" ] || continue
  CONFIG_APP="$(dirname "$config")"
  break
done

if [ -z "$CONFIG_APP" ]; then
  echo "Error: No app with drizzle.config.ts found."
  echo "Create a drizzle.config.ts in at least one app first."
  exit 1
fi

echo "Opening Drizzle Studio..."
cd "$CONFIG_APP"
npx drizzle-kit studio
