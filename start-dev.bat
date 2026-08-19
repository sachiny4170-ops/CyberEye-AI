@echo off
start "CyberEye Backend" cmd /k "cd /d C:\Users\a2z\Desktop\CyberEye-AI\backend && python -m uvicorn app.main:app --reload"
timeout /t 3 /nobreak >nul
start "CyberEye Frontend" cmd /k "cd /d C:\Users\a2z\Desktop\CyberEye-AI\frontend && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173