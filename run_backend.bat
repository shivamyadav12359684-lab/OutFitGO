@echo off
echo [INFO] Starting OutfitGo Backend...
cd backend_python
if exist ".venv" (
    call .venv\Scripts\activate
) else if exist "venv" (
    call venv\Scripts\activate
) else (
    echo [WARNING] Virtual environment not found. Using system python.
)
set FLASK_APP=src/app.py
set FLASK_ENV=development
python src/app.py
pause
