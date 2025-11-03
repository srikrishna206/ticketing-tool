@echo off
REM =====================================================
REM FlowTrack Backend - Environment Setup Script (Windows)
REM =====================================================

echo.
echo ========================================
echo FlowTrack Environment Setup
echo ========================================
echo.

REM Check if .env already exists
if exist .env (
    echo [WARNING] .env file already exists!
    echo.
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled. Existing .env file preserved.
        goto :end
    )
)

REM Copy template to .env
echo Creating .env file from template...
copy env.template .env >nul 2>&1

if errorlevel 1 (
    echo [ERROR] Failed to create .env file
    echo Please manually copy env.template to .env
    goto :end
)

echo [SUCCESS] .env file created successfully!
echo.
echo ========================================
echo IMPORTANT: Next Steps
echo ========================================
echo.
echo 1. Edit the .env file with your actual values:
echo    - Update DATABASE_URL with your database credentials
echo    - Generate a SECRET_KEY (see ENV_SETUP_GUIDE.md)
echo    - Update ALLOWED_ORIGINS for your environment
echo.
echo 2. For production deployment:
echo    - Set ENVIRONMENT=production
echo    - Set DEBUG=False
echo    - Use strong passwords
echo.
echo 3. Review ENV_SETUP_GUIDE.md for detailed instructions
echo.
echo ========================================
echo.
echo Press any key to open .env file in notepad...
pause >nul
notepad .env

:end
echo.
echo Setup complete!
pause

