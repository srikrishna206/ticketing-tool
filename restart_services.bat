@echo off
echo.
echo ================================================
echo   FlowTrack Services Restart
echo ================================================
echo.

echo Stopping existing services...
taskkill /F /FI "WINDOWTITLE eq *uvicorn*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *npm*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *node*" 2>nul

echo.
echo Starting Backend (PostgreSQL)...
start "Backend Server" powershell -NoExit -Command "cd '%~dp0backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend Server" powershell -NoExit -Command "cd '%~dp0frontend'; npm start"

echo.
echo ================================================
echo   Services Starting...
echo ================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Note: WebSocket warnings in browser console are normal
echo       and don't affect functionality.
echo.
echo Press any key to continue...
pause >nul

