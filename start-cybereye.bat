@echo off
title CyberEye AI Launcher

start "CyberEye AI Backend" cmd /k "cd /d C:\Users\a2z\Desktop\CyberEye-AI\backend && python -m uvicorn app.main:app --reload"

timeout /t 4 /nobreak >nul

start "CyberEye AI Frontend" cmd /k "cd /d C:\Users\a2z\Desktop\CyberEye-AI\frontend && npm.cmd run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173
