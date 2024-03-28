# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port that the microservice listens on
EXPOSE 3001

# Run the Node.js application when the container starts
CMD ["node", "index.js"]

