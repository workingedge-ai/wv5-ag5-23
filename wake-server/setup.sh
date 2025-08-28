#!/usr/bin/env bash
set -euo pipefail

# setup.sh - sets up Python venv, installs deps, downloads a Vosk small model if not present.
# Run from project root: ./wake-server/setup.sh

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

PYTHON=python3
VENV_DIR="$HERE/.venv"
REQUIREMENTS="$HERE/requirements.txt"
MODEL_DIR="$HERE/model"
MODEL_NAME_ENV="${VOSK_MODEL:-vosk-model-small-en-us-0.15}"
MODEL_ARCHIVE="${MODEL_NAME_ENV}.zip"
MODEL_URL="https://alphacephei.com/vosk/models/${MODEL_ARCHIVE}"

echo "Setting up wake-server in: $HERE"

# Create venv
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtualenv..."
  $PYTHON -m venv "$VENV_DIR"
else
  echo "Virtualenv already exists at $VENV_DIR"
fi

# Activate and install
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r "$REQUIREMENTS"

# Download model if missing
if [ -d "$MODEL_DIR" ]; then
  echo "Model directory already exists: $MODEL_DIR"
else
  echo "Model not found. Downloading model: $MODEL_NAME_ENV"
  echo "Model URL: $MODEL_URL"

  # Download archive
  if command -v curl >/dev/null 2>&1; then
    curl -L -o "$MODEL_ARCHIVE" "$MODEL_URL"
  elif command -v wget >/dev/null 2>&1; then
    wget -O "$MODEL_ARCHIVE" "$MODEL_URL"
  else
    echo "Neither curl nor wget is available. Please install one to download the model." >&2
    exit 1
  fi

  echo "Unpacking model..."
  if command -v unzip >/dev/null 2>&1; then
    unzip -q "$MODEL_ARCHIVE"
  else
    python - <<PY
import zipfile, sys
zf = zipfile.ZipFile('$MODEL_ARCHIVE')
zf.extractall()
zf.close()
PY
  fi

  # Move extracted folder to model dir if needed
  if [ -d "$MODEL_NAME_ENV" ]; then
    mv "$MODEL_NAME_ENV" "$MODEL_DIR"
  else
    # If the zip extracted to a folder named differently, attempt to find a folder
    FOUND_DIR=$(ls -d */ | grep -i vosk | head -n1 || true)
    if [ -n "$FOUND_DIR" ]; then
      mv "$FOUND_DIR" "$MODEL_DIR"
    else
      echo "Could not find extracted model folder; please inspect the archive." >&2
      exit 1
    fi
  fi

  # Cleanup archive
  rm -f "$MODEL_ARCHIVE"
  echo "Model downloaded and extracted to $MODEL_DIR"
fi

echo "Setup complete. Activate the venv with:\n  source $VENV_DIR/bin/activate\nThen run the server with:\n  python $HERE/server.py\n"
