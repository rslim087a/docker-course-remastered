# Grade Submission Portal
This is a Flask web application for submitting and viewing grades.

## Usage
To run the Grade Submission Portal container, use the following Docker command:

```bash
docker run --name flask-app --network my-network -p 5001:5001 -e GRADE_SERVICE_HOST=node-server rslim087/grade-submission-portal
```

This command does the following:
- Runs a container named `flask-app`.
- Connects the container to the Docker network named `my-network`.
- Maps port 5001 of the container to port 5001 of the host machine.
- Sets the environment variable `GRADE_SERVICE_HOST` to `node-server`, which is the name of the Grade Submission API container.
- Uses the `rslim087/grade-submission-portal` image.

Make sure you have created the Docker network `my-network` and are running the Grade Submission API container before running the Grade Submission Portal container.

## Docker Image
The Docker image is built using the following Dockerfile:

```dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

The image is based on the Python 3.8 slim base image and runs the `app.py` file when the container starts.

## Requirements
- Docker
- Grade Submission API container running on the same Docker network

## License
This project is licensed under the [MIT License](LICENSE).
