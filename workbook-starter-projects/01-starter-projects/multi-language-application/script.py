from datetime import datetime
import subprocess
import time


def generate_greeting_with_collaboration():
    hour = datetime.now().hour
    if hour < 12:
        part_of_day = "morning"
    elif hour < 18:
        part_of_day = "afternoon"
    else:
        part_of_day = "evening"
    
    collaboration_message = """
       *****
      *     *
     * -^- -^- *
    *  \\   /  *  
     *   v   *  - Hello from Python!
      *     *   Have a nice {part_of_day}!
       *****       Now, calling my Java friend...
    """.format(part_of_day=part_of_day)

    return collaboration_message

if __name__ == "__main__":
    print(generate_greeting_with_collaboration())
    time.sleep(2)
    result = subprocess.run(["java", "-cp", ".", "JavaClass"], stdout=subprocess.PIPE, text=True)
    print(result.stdout)