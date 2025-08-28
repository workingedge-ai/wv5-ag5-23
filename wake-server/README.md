Wake-word server (Vosk + websockets)

Quick start:

1. Create a Python venv and activate it:

   python3 -m venv .venv
   source .venv/bin/activate

2. Install deps:

   pip install -r requirements.txt

3. Download a Vosk model (for example: https://alphacephei.com/vosk/models) and unpack to ./model or set VOSK_MODEL_PATH env var.

4. Run the server:

   python server.py

5. The frontend connects to ws://<host>:8765 and will receive {"type":"wake"} when the wake phrase is detected.

Notes:
- On macOS grant microphone permissions to the terminal or Python binary.
- This server is minimal; for production secure the websocket connections and run as a background service.
