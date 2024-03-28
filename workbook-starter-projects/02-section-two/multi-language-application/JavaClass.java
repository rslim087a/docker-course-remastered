public class JavaClass {
    public static void main(String[] args) {
        // ASCII Art
        String smileyFace = 
                "   ***** \n" +
                "  *     *\n" +
                " * _   _ *\n" +
                "*  o   o  *\n" +
                " *   v   *  - Hello from Java!\n" +
                "  *     *   Have a nice " + partOfDay() + "!\n" +
                "   *****\n";
        System.out.println(smileyFace);
    }

    private static String partOfDay() {
        int hour = java.time.LocalTime.now().getHour();
        if(hour < 12) {
            return "morning";
        } else if(hour < 18) {
            return "afternoon";
        } else {
            return "evening";
        }
    }
}

// # Compile the Java class
// docker run -v "/Users/rayanslim/Desktop/docker-bootcamp-resources/02-section-two/multi-language-application:/app" -w /app openjdk:11-jdk-slim-buster javac JavaClass.java

// # Run the Python script
// docker run -v "/Users/rayanslim/Desktop/docker-bootcamp-resources/02-section-two/multi-language-application:/app" -w /app python:3.8-slim-buster bash -c "apt-get update && apt-get install -y default-jre && python script.py"