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
