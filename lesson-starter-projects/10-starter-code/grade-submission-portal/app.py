import requests
import os
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

GRADE_SUBMISSION_API = os.environ.get('GRADE_SUBMISSION_API', 'localhost')
GRADE_SERVICE_URL = f'{GRADE_SUBMISSION_API}'

PORT = int(os.environ.get('PORT', 5001))

@app.route('/', methods=['GET'])
def get_form():
    return render_template('form.html')

@app.route('/handleSubmit', methods=['POST'])
def submit_form():
    form_data = request.form
    grade_data = {
        'name': form_data['name'],
        'subject': form_data['subject'],
        'score': form_data['score'],
    }
    requests.post(GRADE_SERVICE_URL, json=grade_data)
    return redirect(url_for('get_grades'))

@app.route('/grades', methods=['GET'])
def get_grades():
    return render_template('grades.html')

@app.route('/api/grades', methods=['GET'])
def api_get_grades():
    response = requests.get(GRADE_SERVICE_URL)
    grades = response.json()
    print(f"Received grades from Node.js server: {grades}")
    return jsonify(grades)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)