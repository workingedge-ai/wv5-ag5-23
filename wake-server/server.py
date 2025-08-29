"""Simple wake-word websocket broadcaster using Vosk.

Usage:
  - Install dependencies: pip install -r requirements.txt
  - Download a small Vosk model (e.g., "vosk-model-small-en-us-0.15") and set VOSK_MODEL_PATH env var or place in ./model
  - Run: python server.py

This script opens the microphone and runs continuous recognition. On detecting the configured wake word (default: "hey lara"),
it broadcasts a JSON message {"type":"wake"} to any connected websocket clients.

Notes:
  - This is minimal and intended for local setups. On macOS you must grant microphone permission.
  - For production, run inside a supervised process and secure websockets.
"""
import asyncio
import json
import os
import sys
import argparse

import sounddevice as sd
import numpy as np
from vosk import Model, KaldiRecognizer
import websockets

# Configuration
WAKE_PHRASE = os.environ.get('WAKE_PHRASE', 'hey pluto')
MODEL_PATH = os.environ.get('VOSK_MODEL_PATH', './model')
SAMPLE_RATE = 16000
WEBSOCKET_PORT = int(os.environ.get('WEBSOCKET_PORT', 8765))

connected_clients = set()

async def broadcast_wake():
    if not connected_clients:
        return
    message = json.dumps({"type": "wake", "phrase": WAKE_PHRASE})
    await asyncio.wait([ws.send(message) for ws in connected_clients])

async def ws_handler(websocket, path):
    print('Client connected')
    connected_clients.add(websocket)
    try:
        async for _ in websocket:
            # ignore incoming messages
            pass
    except websockets.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)
        print('Client disconnected')


def recognize_loop(recognizer, loop):
    """Blocking loop reading from microphone and feeding recognizer. This runs in a thread."""

    def callback(indata, frames, time, status):
        if status:
            print('Sounddevice status:', status, file=sys.stderr)

        # Convert incoming buffer to raw bytes
        try:
            # RawInputStream typically provides a CFFI buffer; bytes() works for it
            data = bytes(indata)
        except Exception:
            try:
                arr = np.frombuffer(indata, dtype=np.int16)
                data = arr.tobytes()
            except Exception as e:
                print('Error converting audio buffer:', e, file=sys.stderr)
                return

        # Feed the audio to the recognizer
        try:
            if recognizer.AcceptWaveform(data):
                result = recognizer.Result()
                try:
                    j = json.loads(result)
                    text = j.get('text', '').strip()
                    if text:
                        print(f'Recognised:{text}', flush=True)
                        if WAKE_PHRASE in text.lower():
                            print('Wake phrase detected, broadcasting', flush=True)
                            try:
                                print(f'Broadcasting wake to {len(connected_clients)} client(s)', flush=True)
                                asyncio.run_coroutine_threadsafe(broadcast_wake(), loop)
                            except Exception as e:
                                print('Failed to schedule broadcast', e, flush=True)
                except Exception:
                    pass
            else:
                # Print partial results for debugging
                try:
                    partial = recognizer.PartialResult()
                    try:
                        pj = json.loads(partial)
                        ptext = pj.get('partial', '').strip()
                        if ptext:
                            print(f'Recognised:{ptext}', flush=True)
                    except Exception:
                        pass
                except Exception:
                    pass
        except Exception as e:
            print('Recognizer error:', e, file=sys.stderr)

    with sd.RawInputStream(samplerate=SAMPLE_RATE, blocksize=8000, dtype='int16', channels=1, callback=callback):
        print('Listening for wake phrase:', WAKE_PHRASE)
        while True:
            sd.sleep(1000)


async def main():
    if not os.path.exists(MODEL_PATH):
        print(f'Model path not found: {MODEL_PATH}', file=sys.stderr)
        sys.exit(1)

    print('Loading model...')
    model = Model(MODEL_PATH)
    # Use free-form recognition (no explicit grammar) for wake-word detection
    # Removing the grammar here avoids strict phrase matching and lets recognizer
    # produce full text results which we inspect for the wake phrase.
    recognizer = KaldiRecognizer(model, SAMPLE_RATE)

    # Start websocket server
    ws_server = await websockets.serve(ws_handler, '0.0.0.0', WEBSOCKET_PORT)
    print(f'WebSocket server listening on ws://0.0.0.0:{WEBSOCKET_PORT}')

    # Run recognize loop in executor (blocking) and pass the loop for thread-safe scheduling
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, recognize_loop, recognizer, loop)

    await ws_server.wait_closed()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Shutting down')
