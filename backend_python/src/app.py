from flask import Flask, jsonify, request
from config import Config
from routes import api_bp

app = Flask(__name__)
app.config.from_object(Config)

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "OutfitGo Recommendation API is Request"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
