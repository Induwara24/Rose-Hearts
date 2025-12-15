@echo off
start cmd /k ".\venv\Scripts\activate && uvicorn server:app --reload"
start "" http://127.0.0.1:8000