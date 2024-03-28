# Use the official Python image as the base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the Flask application to the working directory
COPY server.py .

# Expose the port that the Flask application listens on
EXPOSE 8000

# Run the Flask application when the container starts
CMD ["python", "server.py"]