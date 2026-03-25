@echo off
echo ========================================
echo   CostGuard AI - Starting Application
echo ========================================
echo.

echo Checking MongoDB connection...
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/costguard-ai').then(() => { console.log('MongoDB is running!'); process.exit(0); }).catch(() => { console.log('ERROR: MongoDB is NOT running!'); process.exit(1); });" 2>nul

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   ERROR: MongoDB is not running!
    echo ========================================
    echo.
    echo Please start MongoDB first:
    echo   1. Open a new terminal
    echo   2. Run: mongod
    echo   3. Then run this script again
    echo.
    echo Or use MongoDB Atlas:
    echo   Edit backend/.env with your connection string
    echo.
    pause
    exit /b 1
)

echo.
echo Seeding database with dummy credentials...
call npm run seed
if %errorlevel% neq 0 (
    echo.
    echo Warning: Seeding failed. You may need to register manually.
    echo.
)

echo.
echo Starting Backend Server...
start "CostGuard Backend" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..
start "CostGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo LOGIN CREDENTIALS:
echo Email: admin@costguard.ai
echo Password: admin123
echo.
echo If login fails, register a new account!
echo.
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
