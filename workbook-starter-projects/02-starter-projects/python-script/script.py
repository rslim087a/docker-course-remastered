import sys

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide at least one command-line argument.")
    else:
        print("Command-line arguments:")
        for arg in sys.argv[1:]:
            print(arg)

