#!/usr/bin/env bash

# Root start script for Railway Railpack
# Delegates to the backend/start.sh so Railpack can discover this script at repo root

set -euo pipefail

exec bash backend/start.sh
