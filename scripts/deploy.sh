#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# --- Validate input ---
if [ $# -lt 1 ]; then
  echo "Usage: pnpm deploy-app <app-name>"
  echo "Example: pnpm deploy-app dolar-blue"
  exit 1
fi

APP_NAME="$1"
APP_DIR="$ROOT_DIR/apps/$APP_NAME"

if [ ! -d "$APP_DIR" ]; then
  echo "Error: apps/$APP_NAME does not exist. Run 'pnpm create-app $APP_NAME' first."
  exit 1
fi

# --- Load env vars ---
if [ -f "$ROOT_DIR/.env.local" ]; then
  set -a
  source <(grep -v '^\s*#' "$ROOT_DIR/.env.local" | grep -v '^\s*$')
  set +a
fi

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "Error: VERCEL_TOKEN not set. Add it to .env.local"
  exit 1
fi

# --- Get org ID from .vercel/project.json ---
ORG_ID=""
if [ -f "$ROOT_DIR/.vercel/project.json" ]; then
  ORG_ID=$(node -e "console.log(require('$ROOT_DIR/.vercel/project.json').orgId || '')")
fi

if [ -z "$ORG_ID" ]; then
  echo "Error: Could not find orgId in .vercel/project.json"
  exit 1
fi

echo "Deploying: $APP_NAME"

# --- Check if Vercel project already exists ---
PROJECT_CHECK=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://api.vercel.com/v9/projects/$APP_NAME" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

if [ "$PROJECT_CHECK" = "200" ]; then
  echo "Vercel project '$APP_NAME' already exists, updating config..."
  curl -s -X PATCH "https://api.vercel.com/v9/projects/$APP_NAME" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"rootDirectory\":\"apps/$APP_NAME\",\"installCommand\":\"pnpm install\",\"framework\":\"nextjs\"}" > /dev/null
else
  echo "Creating Vercel project: $APP_NAME"
  RESPONSE=$(curl -s -X POST "https://api.vercel.com/v10/projects" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$APP_NAME\",
      \"framework\": \"nextjs\",
      \"rootDirectory\": \"apps/$APP_NAME\",
      \"installCommand\": \"pnpm install\"
    }")

  PROJECT_ID=$(echo "$RESPONSE" | node -e "
    let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
      try { console.log(JSON.parse(d).id || ''); } catch(e) { console.log(''); }
    });
  ")

  if [ -z "$PROJECT_ID" ]; then
    echo "Error creating project. Response:"
    echo "$RESPONSE"
    exit 1
  fi
  echo "Project created: $PROJECT_ID"
fi

# --- Link and deploy ---
# Create a temporary .vercel link for this specific project
mkdir -p "$ROOT_DIR/.vercel"
ORIGINAL_PROJECT=$(cat "$ROOT_DIR/.vercel/project.json" 2>/dev/null || echo "")

# Get the project ID for the app
PROJECT_INFO=$(curl -s "https://api.vercel.com/v9/projects/$APP_NAME" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

APP_PROJECT_ID=$(echo "$PROJECT_INFO" | node -e "
  let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
    try { console.log(JSON.parse(d).id || ''); } catch(e) { console.log(''); }
  });
")

# Temporarily switch the vercel link to this app's project
cat > "$ROOT_DIR/.vercel/project.json" << EOF
{"projectId":"$APP_PROJECT_ID","orgId":"$ORG_ID","projectName":"$APP_NAME"}
EOF

echo "Deploying to production..."
cd "$ROOT_DIR"
DEPLOY_OUTPUT=$(vercel --token "$VERCEL_TOKEN" --yes --prod 2>&1) || true
echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[a-zA-Z0-9-]+\.vercel\.app' | head -1 || true)

# --- Assign clean alias ---
if [ -n "$DEPLOY_URL" ]; then
  echo ""
  echo "Setting alias: $APP_NAME.vercel.app"
  vercel alias "$DEPLOY_URL" "$APP_NAME.vercel.app" --token "$VERCEL_TOKEN" 2>&1 || true
fi

# --- Restore original .vercel/project.json ---
if [ -n "$ORIGINAL_PROJECT" ]; then
  echo "$ORIGINAL_PROJECT" > "$ROOT_DIR/.vercel/project.json"
fi

echo ""
echo "Deploy complete!"
echo "URL: https://$APP_NAME.vercel.app"
