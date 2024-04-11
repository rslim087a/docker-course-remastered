# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the server code to the working directory
COPY server /app/server

# Change to the server directory
WORKDIR /app/server

# Install the client dependencies (only needed if you're not copying over the node_modules)
# RUN npm install

# Change back to the app directory
WORKDIR /app

# Copy the client code to the client directory
COPY client /app/client

# Change to the client directory
WORKDIR /app/client

# Install the client dependencies (only needed if you're not copying over the node_modules)
# RUN npm install

# Build the React application
RUN npm run build

# Change back to the app directory
WORKDIR /app

# Copy the README file to the root directory
COPY README.md /README.md

# Expose the port that the server listens on
EXPOSE 4000

# Run the Node.js server when the container starts
CMD ["node", "server/server.js"]