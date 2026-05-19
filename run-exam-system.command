#!/bin/bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

PORT="${PORT:-4173}"
APP_URL="http://127.0.0.1:${PORT}/"

echo
echo "========================================"
echo "  Personal Exam System - One Click Run"
echo "========================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed or not available in PATH."
  echo "Please install Node.js from https://nodejs.org/ and run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm is not available in PATH."
  echo "Please reinstall Node.js or add npm to PATH."
  read -r -p "Press Enter to close..."
  exit 1
fi

export npm_config_cache="$APP_DIR/.npm-cache"
export npm_config_update_notifier=false
export npm_config_audit=false
export npm_config_fund=false

if [ ! -f "package-lock.json" ]; then
  echo "[ERROR] package-lock.json is missing."
  read -r -p "Press Enter to close..."
  exit 1
fi

if [ ! -f "node_modules/vite/bin/vite.js" ] || [ ! -d "node_modules/express" ]; then
  echo "[1/4] Installing dependencies..."
  npm ci --loglevel=warn
else
  echo "[1/4] Dependencies already installed."
fi

echo "[2/4] Building production files..."
npm run build

echo "[3/4] Checking local port ${PORT}..."
if command -v lsof >/dev/null 2>&1; then
  EXISTING_PIDS="$(lsof -ti tcp:"$PORT" -sTCP:LISTEN || true)"
  if [ -n "$EXISTING_PIDS" ]; then
    echo "Stopping old server process on port ${PORT}: ${EXISTING_PIDS}"
    kill $EXISTING_PIDS || true
    sleep 1
  fi
fi

cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

echo "[4/4] Starting local server..."
PORT="$PORT" node server.js &
SERVER_PID="$!"

for _ in {1..30}; do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "[ERROR] Server stopped unexpectedly."
    wait "$SERVER_PID"
    exit 1
  fi
  sleep 1
done

if ! curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
  echo "[ERROR] Server did not become ready on ${APP_URL}"
  exit 1
fi

echo
echo "App URL: ${APP_URL}"
echo "Keep this Terminal window open while using the system."
echo "Press Ctrl+C to stop the server."
echo

open "$APP_URL" >/dev/null 2>&1 || true
wait "$SERVER_PID"
