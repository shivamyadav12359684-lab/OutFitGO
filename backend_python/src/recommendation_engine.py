import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import mysql.connector
from config import Config
import requests

def get_db_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )

def get_weather_data(city):
    # Mocking weather data if API key is not present or fails
    # In production, use requests.get to OpenWeatherMap
    return {
        "temp": 25,
        "condition": "Cloudy", # Clear, Rain, Snow, Clouds
        "humidity": 60
    }

def get_recommendations(user_id, weather):
    conn = get_db_connection()
    
    # Fetch User Preferences
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT style_preference FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    
    # Fetch All Clothes
    query = "SELECT * FROM clothing"
    df_clothes = pd.read_sql(query, conn)
    
    conn.close()
    
    if df_clothes.empty:
        return []

    # --- RULE 1: Weather Filtering ---
    # Python logic for weather rules
    temp = weather['temp']
    condition = weather['condition'].lower()
    
    app_season = []
    if temp < 15:
        app_season = ['Winter', 'All']
    elif temp > 25:
        app_season = ['Summer', 'All']
    else:
        app_season = ['Spring', 'Autumn', 'All']
        
    if 'rain' in condition:
        app_season = ['Rainy', 'All']

    # Filter DataFrame by Season
    filtered_df = df_clothes[df_clothes['season'].isin(app_season)]
    
    if filtered_df.empty:
        # Fallback if no seasonal clothes found
        filtered_df = df_clothes

    # --- RULE 2: Content-Based Filtering (Style Matching) ---
    # If user has a style preference, boost similar items
    if user and user['style_preference']:
        user_style = user['style_preference']
        
        # Simple string matching for now (TF-IDF is overkill for single word but good for scalability)
        tfidf = TfidfVectorizer(stop_words='english')
        
        # Construct a "profile" string for each item
        filtered_df['profile'] = filtered_df['style'] + " " + filtered_df['cloth_type'] + " " + filtered_df['color']
        
        # Calculate similarity with user preference
        tfidf_matrix = tfidf.fit_transform(filtered_df['profile'])
        user_vector = tfidf.transform([user_style])
        
        cosine_sim = linear_kernel(user_vector, tfidf_matrix)
        
        # Get top indices
        sim_scores = list(enumerate(cosine_sim[0]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        top_indices = [i[0] for i in sim_scores]
        recommended_df = filtered_df.iloc[top_indices]
        
        return recommended_df.to_dict('records')
    
    return filtered_df.head(5).to_dict('records')
