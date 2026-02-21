from flask import Blueprint, request, jsonify
import mysql.connector
from config import Config
from recommendation_engine import get_recommendations, get_weather_data

api_bp = Blueprint('api', __name__)

def get_db_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )

@api_bp.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    city = request.args.get('city')
    
    if not user_id or not city:
        return jsonify({"error": "Missing user_id or city"}), 400

    # 1. Get Weather
    weather = get_weather_data(city)
    
    # 2. Get Recommendations
    recommendations = get_recommendations(user_id, weather)
    
    return jsonify({
        "weather": weather,
        "recommendations": recommendations
    })

@api_bp.route('/wardrobe', methods=['POST'])
def add_item():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    sql = "INSERT INTO clothing (cloth_type, color, style, season, image_url, price) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (data['cloth_type'], data['color'], data['style'], data['season'], data['image_url'], data['price'])
    
    try:
        cursor.execute(sql, val)
        conn.commit()
        return jsonify({"message": "Item added successfully", "id": cursor.lastrowid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@api_bp.route('/wardrobe', methods=['GET'])
def get_wardrobe():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clothing")
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(items)
