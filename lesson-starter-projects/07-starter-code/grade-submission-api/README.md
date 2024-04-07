# Grade Submission API
This is a Node.js API for managing grade submissions.

## Usage
To run the Grade Submission API container, use the following Docker command:

```bash
docker run --name node-server --network my-network -p 3000:3000 rslim087/grade-submission-api:1.0.0
```

For version 2.0.0 with MongoDB integration, use the following commands:

```bash
docker run --name mongodb -d -p 27017:27017 mongo
docker run --name node-server --network my-network -p 3000:3000 -e DB_HOST=mongodb -e DB_PORT=27017 -e DB_NAME=gradesDB rslim087/grade-submission-api:2.0.0
```

These commands do the following:
- Runs a container named `node-server`.
- Connects the container to the Docker network named `my-network`.
- Maps port 3000 of the container to port 3000 of the host machine.
- For 2.0.0, runs a MongoDB container named `mongodb` and sets environment variables for database connectivity.
- Uses the `rslim087/grade-submission-api:1.0.0` or `rslim087/grade-submission-api:2.0.0` image, depending on the version.

Make sure you have created the Docker network `my-network` before running the containers. For 2.0.0, ensure that the MongoDB container is running before starting the Grade Submission API container.

## API Endpoints
- `GET /grades`: Retrieves all grade submissions.
- `POST /grades`: Creates a new grade submission.

## Database Integration (2.0.0 only)
The Grade Submission API 2.0.0 integrates with a MongoDB database for persistent storage of grade submissions. The following environment variables are required for the database connection:
- `DB_HOST`: The hostname or IP address of the MongoDB container.
- `DB_PORT`: The port number of the MongoDB container.
- `DB_NAME`: The name of the database to store grade submissions.

Make sure to provide the appropriate values for these environment variables when running the 2.0.0 container.

## Docker Image
The Docker image is built using the following Dockerfile:

```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

The image is based on the Node.js 14 base image and runs the `app.js` file when the container starts.

## Version Differences
**Version 1.0.0:**
- Stateless API without a backend database.
- Grade submissions are stored in memory and not persisted.
- Suitable for testing and development purposes.

**Version 2.0.0:**
- Stateful API with MongoDB integration for data persistence.
- Grade submissions are stored in a MongoDB database.
- Requires a running MongoDB container and additional environment variables for database connectivity.
- Provides permanent storage for grade submissions.
- Suitable for production environments.

## Requirements
- Docker
- For 2.0.0, a MongoDB instance running and accessible

## License
This project is licensed under the MIT License.
