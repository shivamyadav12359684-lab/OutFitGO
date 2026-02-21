@echo off
echo ==========================================
echo       OutfitGo - Full Stack Launcher
echo ==========================================

:: 1. Start MySQL (Assuming XAMPP or Service is running)
echo.
echo [INFO] Please ensure your MySQL server is running (Port 3306).
echo.

:: 2. Setup Python Backend
echo [STEP 1] Setting up Python Backend...
cd backend_python
if exist ".venv" (
    echo Using existing .venv...
    call .venv\Scripts\activate
) else if exist "venv" (
    echo Using existing venv...
    call venv\Scripts\activate
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
)
echo Installing dependencies...
pip install -r requirements.txt
echo Starting Flask Server in background...
start /B python src/app.py
cd ..

:: 3. Compile & Run Java Frontend
echo [STEP 2] Compiling Java Frontend...
cd frontend_java
if not exist "bin" mkdir bin

:: Find all java files
dir /s /B *.java > sources.txt

:: Compile (Requires mysql-connector-java jar in lib folder if strictly needed, but for now assuming standard compile)
:: NOTE: User MUST have mysql-connector-j-*.jar in the classpath.
:: Since I cannot download it, I will assume it's in a 'lib' folder or ask user to provide it.
:: For this script, I will assume a lib folder exists or add a placeholder.
if not exist "lib" mkdir lib

echo.
echo [IMPORTANT] Ensure 'mysql-connector-j-8.x.jar' is in frontend_java/lib/
echo.

javac -d bin -cp "lib/*" @sources.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed. Check if JDBC driver is in lib/ folder.
    pause
    exit /b
)

echo [STEP 3] Launching OutfitGo Desktop App...
java -cp "bin;lib/*" com.outfitgo.Main

pause
