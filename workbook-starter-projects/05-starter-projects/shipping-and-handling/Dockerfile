# Use the official Golang image as the base image
FROM golang:1.20

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum if they exist
COPY go.mod go.sum ./

# Download any dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Expose the port that the API listens on
EXPOSE 8080

# Run the code when the container starts. Consider using 'go build' and running the compiled binary for production.
CMD ["go", "run", "main.go"]