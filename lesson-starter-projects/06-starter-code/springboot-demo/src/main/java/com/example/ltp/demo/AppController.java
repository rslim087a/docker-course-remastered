package com.example.ltp.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AppController {
    @GetMapping("/")
    @ResponseBody
    public String home() {
        String response = "<pre>" 
        + "     ____.  _________   _________   \n"
        + "    |    | /  _  \\   \\ /   /  _  \\  \n"
        + "    |    |/  /_\\  \\   Y   /  /_\\  \\ \n"
        + "/\\__|    /    |    \\     /    |    \\\n"
        + "\\________\\____|__  /\\___/\\____|__  /\n"
        + "                 \\/              \\/ \n"
        + "             -- Java --             "
        + "</pre>";
        return response;
    }


}

// Developer: Ahoy, Captain DevOps! Here are a few ways to get this Spring Boot app sailing:
//
// Option 1: 
//   Use Maven to clean, install dependencies, and run the app in one command:
//     mvn clean spring-boot:run
//   This single command takes care of everything, including installing the required dependencies and starting the application.
//
// Option 2:
//   Use Maven to install the dependencies first, then run the app:
//     mvn install
//     mvn spring-boot:run
//   The `mvn install` command installs the necessary dependencies, so the subsequent `mvn spring-boot:run` doesn't need to handle that.
//
// Option 3:
//   Use Maven to package the application and its dependencies into a self-contained JAR file, then run it:
//     mvn package
//     java -jar target/demo-0.0.1-SNAPSHOT.jar
//   The `mvn package` command bundles the application and its dependencies into a single, executable JAR file, which you can then run using the `java -jar` command.
//
// I trust you to choose the best route for your journey. May your application have a smooth voyage!
