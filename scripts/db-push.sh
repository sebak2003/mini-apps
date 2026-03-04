#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# --- Validate input ---
if [ $# -lt 1 ]; then
  echo "Usage: pnpm db:push <app-name>"
  echo "Example: pnpm db:push dolar-blue"
  exit 1
fi

APP_NAME="$1"
APP_DIR="$ROOT_DIR/apps/$APP_NAME"

if [ ! -d "$APP_DIR" ]; then
  echo "Error: apps/$APP_NAME does not exist."
  exit 1
fi

if [ ! -f "$APP_DIR/drizzle.config.ts" ]; then
  echo "Error: apps/$APP_NAME/drizzle.config.ts not found."
  echo "Create a drizzle.config.ts in your app first."
  exit 1
fi

# --- Load env vars ---
if [ -f "$ROOT_DIR/.env.local" ]; then
  set -a
  source <(grep -v '^\s*#' "$ROOT_DIR/.env.local" | grep -v '^\s*$')
  set +a
fi

if [ -z "${DATABASE_URL_UNPOOLED:-}" ]; then
  echo "Error: DATABASE_URL_UNPOOLED not set. Add it to .env.local"
  exit 1
fi

echo "Pushing schema for: $APP_NAME"
cd "$APP_DIR"
npx drizzle-kit push
echo ""
echo "Schema pushed successfully!"
