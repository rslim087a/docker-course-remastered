from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection details
mongo_host = os.environ['MONGODB_HOST']
mongo_port = int(os.environ['MONGODB_PORT'])
mongo_database = os.environ['MONGODB_DATABASE']

# Connect to MongoDB
client = MongoClient(mongo_host, mongo_port)
db = client[mongo_database]
contact_messages = db['contact_messages']

@app.route('/api/contact-message', methods=['GET'])
def get_contact_message():
    response = {
        'message': "We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us. Our dedicated support team is ready to assist you."
    }
    return jsonify(response)

@app.route('/api/contact-submit', methods=['POST'])
def submit_contact_form():
    post_data = request.get_json()
    print("Received submission:", post_data)

    # Extract form data
    name = post_data.get('name')
    email = post_data.get('email')
    message = post_data.get('message')
    timestamp = datetime.now()

    # Insert contact message into MongoDB
    contact_messages.insert_one({
        'name': name,
        'email': email,
        'message': message,
        'timestamp': timestamp
    })

    response = {'status': 'success', 'message': 'Your message has been successfully submitted.'}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)