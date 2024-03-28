import sys

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide at least one command-line argument.")
    else:
        print("Command-line arguments:")
        for arg in sys.argv[1:]:
            print(arg)


# rayanslim@Rayans-MacBook-Air docker-bootcamp-resources % docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/python-script/script.py:/app/script.py' python:3.8-slim python /app/script.py I am silly 



# The -v flag mounts the script.py file from the local machine to the /app/script.py path inside the Docker container.
# python:3.8-slim is the name of the official Python Docker image that will be used to run the script.
# python /app/script.py is the command that runs the Python script inside the container.
# arg1 arg2 arg3 are the command-line arguments passed to the script.
# When you run the command, Docker will pull the python:3.8-slim image (if not already available), create a new container, mount the script.py file into the container, and execute the script with the provided command-line arguments.

# The script will then print the command-line arguments it received.