@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🚀 COSTGUARD AI - QUICK START 🚀               ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo.
echo ⚠️  IMPORTANT: Make sure MongoDB is running!
echo.
echo    If not, open a new terminal and run: mongod
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
echo.
echo Starting Backend Server...
cd backend
start "CostGuard Backend" cmd /k "npm start"
echo ✅ Backend starting on http://localhost:5000
echo.
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..
start "CostGuard Frontend" cmd /k "cd frontend && npm run dev"
echo ✅ Frontend starting on http://localhost:5173
echo.
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1. Wait for both servers to start (check the new windows)
echo 2. Open browser: http://localhost:5173
echo 3. Register a new account OR use:
echo    Email: admin@costguard.ai
echo    Password: admin123
echo.
echo 💡 TIP: If login fails, just register a new account!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Press any key to close this window...
pause >nul
