import sys

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide at least one command-line argument.")
    else:
        print("Command-line arguments:")
        for arg in sys.argv[1:]:
            print(arg)

# Developer: Captain DevOps, this Python script expects command-line arguments to function properly. Command-line arguments are values passed to a program when it is run from the command line.
#            To run this script, you typically use the following command:
#            python script.py arg1 arg2 ...
#            Replace 'script.py' with the actual script name and 'arg1', 'arg2', etc., with the desired arguments.
#
#            The script prints out each argument passed to it during execution.