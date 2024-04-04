import requests
import os
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

GRADE_SERVICE_HOST = os.environ.get('GRADE_SERVICE_HOST', 'localhost')
GRADE_SERVICE_URL = f'http://{GRADE_SERVICE_HOST}:3000/grades'

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
    app.run(debug=True, host='0.0.0.0', port=5001)

# Developer: Ahoy, Captain DevOps! This Flask app is quite straightforward, but there's a catch:
#
# I typically run it with the Node.js API on my local machine, so I set the GRADE_SERVICE_HOST 
# environment variable to 'localhost'. But I'm just a programmer, and I wouldn't know the first 
# thing about setting it up in containers, the cloud, or any of those fancy environments.
#
# That's where you come in! I trust you to work your devops magic and ensure this app can talk 
# to the Node.js API, no matter where they're running. You'll need to set the GRADE_SERVICE_HOST 
# variable to whatever it needs to be for the app to find its way.
#
# I'll leave it in your capable hands, Captain DevOps. Make this app sail smoothly!
