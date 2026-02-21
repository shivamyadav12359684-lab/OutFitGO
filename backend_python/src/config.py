import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = '' # Default, change if needed
    MYSQL_DB = 'outfitgo_db'
    OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE' # Placeholder
