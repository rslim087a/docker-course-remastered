import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileProcessor {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("Usage: java FileProcessor <input_file> <output_file>");
            System.exit(1);
        }

        String inputFile = args[0];
        String outputFile = args[1];

        try (BufferedReader reader = new BufferedReader(new FileReader(inputFile));
             BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String processedLine = processLine(line);
                writer.write(processedLine);
                writer.newLine();
            }
            System.out.println("File processing completed.");
        } catch (IOException e) {
            System.out.println("An error occurred: " + e.getMessage());
        }
    }

    private static String processLine(String line) {
        // Perform some processing on the line
        return line.toUpperCase();
    }
}



// docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/java-file-processor:/app' openjdk:11-jdk javac /app/FileProcessor.java

// docker run -v '/Users/rayanslim/Desktop/docker-bootcamp-resources/java-file-processor:/app' openjdk:11-jdk java -cp /app FileProcessor /app/input.txt /app/output.txt