from flask import Flask
from app_routes import configure_routes

app = Flask(__name__)
configure_routes(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# Developer: Captain DevOps, there are a couple of ways to get this Flask app up and running:
#
# First, install the dependencies with:
#   pip install -r requirements.txt
#
# Then, choose one of the following options to run the app:
#
# Option 1:
#   Run the app directly with:
#     python app.py
#
# Option 2:
#   Set the FLASK_APP shell environment variable and run using the flask command.
#   For Git Bash:
#     export FLASK_APP=app.py
#   For PowerShell:
#     $env:FLASK_APP = "app.py"
#   For Command Prompt:
#     set FLASK_APP=app.py
#   For Mac Terminal:
#     export FLASK_APP=app.py
#   Then run the app with:
#     flask run
#
# Note: The FLASK_APP variable is a shell environment variable used by the flask command.
#       It's different from the environment variables used within the Flask application itself.
#
# I trust you to choose the method that works best for you and your environment.
# The application is in your capable hands now. Make it sail smoothly!
