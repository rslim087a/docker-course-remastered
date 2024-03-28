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