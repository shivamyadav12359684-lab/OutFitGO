@echo off
echo [INFO] Starting OutfitGo Frontend...
cd frontend_java
if not exist "bin" mkdir bin
echo Compiling...
javac -d bin -cp "lib/*" src/main/java/com/outfitgo/Main.java src/main/java/com/outfitgo/ui/*.java src/main/java/com/outfitgo/utils/*.java
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed.
    pause
    exit /b
)
echo Launching...
java -cp "bin;lib/*" com.outfitgo.Main
pause
