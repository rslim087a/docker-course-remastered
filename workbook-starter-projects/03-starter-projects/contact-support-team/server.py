from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    response = {'status': 'success', 'message': 'Your message has been successfully submitted.'}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)