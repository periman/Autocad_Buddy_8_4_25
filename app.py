from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import uuid
from datetime import datetime, timedelta

# Initialize Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Configure CORS to allow requests from any origin for development
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)

# Simulated in-memory database
USERS_DB = {}
MODELS_DB = {}

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({"status": "healthy"}), 200

# Static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# API routes
@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
        
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if email in USERS_DB:
            return jsonify({'error': 'Email already registered'}), 400
        
        user_id = str(uuid.uuid4())
        USERS_DB[email] = {
            'id': user_id,
            'email': email,
            'password': password,  # In a real app, hash this password
            'name': name,
            'created_at': datetime.now().isoformat(),
            'models': []
        }
        
        # Create JWT token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user_id,
                'email': email,
                'name': name,
                'models': []
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
        
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = USERS_DB.get(email)
        if not user or user['password'] != password:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create JWT token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'models': user['models']
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        current_user_email = get_jwt_identity()
        user = USERS_DB.get(current_user_email)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'models': user['models']
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# For testing purposes
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "AutoCad_Buddy API is running"}), 200

# Make the app compatible with Render's expected port
if __name__ == '__main__':
    # Get port from environment variable or default to 10000
    port = int(os.environ.get('PORT', 10000))
    # Bind to 0.0.0.0 to make it accessible from outside
    app.run(host='0.0.0.0', port=port)
