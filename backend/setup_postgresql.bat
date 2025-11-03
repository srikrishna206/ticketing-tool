@echo off
echo.
echo ================================================
echo   FlowTrack PostgreSQL Setup
echo ================================================
echo.
echo This will configure your PostgreSQL database.
echo.

REM Run the configuration script
.\venv\Scripts\python.exe configure_database.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   Creating Database Tables
    echo ================================================
    echo.
    
    REM Run the setup script
    .\venv\Scripts\python.exe setup_database.py
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ================================================
        echo   Setup Complete!
        echo ================================================
        echo.
        echo   You can now start the backend server:
        echo   start_backend.bat
        echo.
    ) else (
        echo.
        echo ERROR: Failed to create database tables.
        echo Please check the error messages above.
        echo.
    )
) else (
    echo.
    echo ERROR: Failed to configure database connection.
    echo Please check your credentials and try again.
    echo.
)

pause

