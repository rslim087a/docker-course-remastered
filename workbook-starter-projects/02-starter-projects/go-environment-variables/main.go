package main

import (
    "fmt"
    "os"
)

func main() {
    message := os.Getenv("MESSAGE")
    if message == "" {
        message = "Hello, World!"
    }
    fmt.Println(message)
}


// docker run -e MESSAGE='Hello from Docker!' -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/go-environment-variables/main.go:/app/main.go' golang:1.16 go run /app/main.go