#ifndef MYLIB_H
#define MYLIB_H

class MyLib {
public:
    void sayHello();
};

#endif


// # Compile the shared library
// docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/cpp-shared-libraries:/app' gcc:10 g++ -shared -fPIC -o /app/libmylib.so /app/mylib.cpp

// # Compile the main application
// docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/cpp-shared-libraries:/app' gcc:10 g++ -o /app/main /app/main.cpp -L/app -lmylib

// # Run the application
// docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/cpp-shared-libraries:/app' -e LD_LIBRARY_PATH=/app gcc:10 /app/main