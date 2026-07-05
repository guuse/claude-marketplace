#!/usr/bin/env bash
# Poll a URL until it responds (or time out). Use before running any test so
# you never hit a server that isn't up yet.
#
# Usage: wait_for_server.sh <url> [timeout_seconds] [interval_seconds]
#   url               URL to poll (e.g. http://localhost:4173)
#   timeout_seconds   max time to wait before giving up (default 60)
#   interval_seconds  seconds between polls (default 1)
#
# Exit 0 as soon as the server responds; exit 1 on timeout.
set -euo pipefail

URL="${1:-}"
TIMEOUT="${2:-60}"
INTERVAL="${3:-1}"

if [[ -z "$URL" ]]; then
  echo "usage: wait_for_server.sh <url> [timeout_seconds] [interval_seconds]" >&2
  exit 2
fi

echo "Waiting for $URL (timeout ${TIMEOUT}s)..." >&2
elapsed=0
while (( elapsed < TIMEOUT )); do
  # Any HTTP response (even 4xx) means the server is up and listening.
  if curl --silent --output /dev/null --fail-early --max-time 5 "$URL" 2>/dev/null \
     || curl --silent --output /dev/null --max-time 5 "$URL" 2>/dev/null; then
    echo "Server is up at $URL (after ${elapsed}s)." >&2
    exit 0
  fi
  sleep "$INTERVAL"
  elapsed=$(( elapsed + INTERVAL ))
done

echo "Timed out after ${TIMEOUT}s waiting for $URL." >&2
exit 1
