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

// Developer: Captain DevOps, this app expects an environment variable named "MESSAGE" to customize the greeting.
//            If "MESSAGE" is not set, it defaults to "Hello, World!".
//            To run the app, navigate to the directory containing main.go and execute: go run main.go
//            I trust you'll handle the environment setup and deployment with ease!


// PS:        Environment variables are key-value pairs that are typically set outside the application, and accessed inside the application.