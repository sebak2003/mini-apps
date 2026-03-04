#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APPS_DIR="$ROOT_DIR/apps"

# --- Validate input ---
if [ $# -lt 1 ]; then
  echo "Usage: pnpm create-app <app-name>"
  echo "Example: pnpm create-app dolar-blue"
  exit 1
fi

APP_NAME="$1"
APP_DIR="$APPS_DIR/$APP_NAME"

if [ -d "$APP_DIR" ]; then
  echo "Error: apps/$APP_NAME already exists."
  exit 1
fi

# --- Detect next available port ---
MAX_PORT=3000
for pkg in "$APPS_DIR"/*/package.json; do
  [ -f "$pkg" ] || continue
  PORT=$(grep -oP '(?<=--port )\d+' "$pkg" 2>/dev/null || true)
  if [ -n "$PORT" ] && [ "$PORT" -gt "$MAX_PORT" ]; then
    MAX_PORT=$PORT
  fi
done
NEXT_PORT=$((MAX_PORT + 1))

# --- Derive title from name (dolar-blue → Dolar Blue) ---
TITLE=$(echo "$APP_NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

echo "Creating app: $APP_NAME (port $NEXT_PORT)"

# --- Create directory structure ---
mkdir -p "$APP_DIR/src/app" "$APP_DIR/public"

# --- package.json (templated) ---
cat > "$APP_DIR/package.json" << EOF
{
  "name": "@mini-apps/$APP_NAME",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port $NEXT_PORT",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@repo/env": "workspace:*",
    "@repo/db": "workspace:*"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^16",
    "eslint": "^9",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
EOF

# --- tsconfig.json (exact copy) ---
cat > "$APP_DIR/tsconfig.json" << 'EOF'
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
EOF

# --- next.config.ts (exact copy) ---
cat > "$APP_DIR/next.config.ts" << 'EOF'
import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load root-level .env.local for shared secrets in local dev.
// In production (Vercel), shared env vars come from team-level settings.
config({ path: resolve(import.meta.dirname, "../../.env.local") });

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/env", "@repo/db"],
};

export default nextConfig;
EOF

# --- postcss.config.mjs (exact copy) ---
cat > "$APP_DIR/postcss.config.mjs" << 'EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
EOF

# --- eslint.config.mjs (exact copy) ---
cat > "$APP_DIR/eslint.config.mjs" << 'EOF'
import nextjsConfig from "@repo/eslint-config/nextjs";

export default nextjsConfig;
EOF

# --- globals.css (exact copy) ---
cat > "$APP_DIR/src/app/globals.css" << 'EOF'
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
EOF

# --- layout.tsx (templated) ---
cat > "$APP_DIR/src/app/layout.tsx" << EOF
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$TITLE",
  description: "$TITLE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# --- page.tsx (starter) ---
cat > "$APP_DIR/src/app/page.tsx" << EOF
"use client";

export default function Page() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600 }}>$TITLE</h1>
    </div>
  );
}
EOF

# --- Add dev:<name> script to root package.json ---
cd "$ROOT_DIR"
TEMP_FILE=$(mktemp)
node -e "
const pkg = require('./package.json');
pkg.scripts['dev:$APP_NAME'] = 'turbo run dev --filter=@mini-apps/$APP_NAME';
require('fs').writeFileSync('$TEMP_FILE', JSON.stringify(pkg, null, 2) + '\n');
"
mv "$TEMP_FILE" "$ROOT_DIR/package.json"

# --- Install dependencies ---
pnpm install

echo ""
echo "App created: apps/$APP_NAME"
echo "Dev port: $NEXT_PORT"
echo ""
echo "Next steps:"
echo "  pnpm dev:$APP_NAME          # Start dev server"
echo "  pnpm deploy-app $APP_NAME   # Deploy to Vercel"
