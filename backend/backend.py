from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import pyodbc
import os
from datetime import timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'  # Change this in production!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# SQL Server Connection
conn = pyodbc.connect(
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost;"
    "Database=DW_PIBI;"
    "Trusted_Connection=yes;"
)

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        print(f"Login attempt - Received data: {request.json}")
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        cursor = conn.cursor()
        cursor.execute("SELECT dashboard FROM Users WHERE email = ? AND password = ?", email, password)
        result = cursor.fetchone()
        
        if result:
            print(f"Login successful for user: {email}")
            # Create JWT token
            access_token = create_access_token(identity=email)
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'dashboard': result[0],
                'token': access_token
            })
        else:
            print(f"Login failed - Invalid credentials for user: {email}")
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/auth/dashboard-access/<email>', methods=['GET'])
@jwt_required()
def get_dashboard_access(email):
    # Verify the email matches the JWT identity
    current_user = get_jwt_identity()
    if email != current_user:
        return jsonify({'error': 'Unauthorized'}), 403
    
    cursor = conn.cursor()
    cursor.execute("SELECT dashboard FROM Users WHERE email = ?", email)
    result = cursor.fetchone()
    
    if result:
        return jsonify({
            'email': email,
            'dashboard': result[0]
        })
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/')
def index():
    return 'Backend server is running! Available endpoints: /auth/login, /auth/dashboard-access/<email>'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
