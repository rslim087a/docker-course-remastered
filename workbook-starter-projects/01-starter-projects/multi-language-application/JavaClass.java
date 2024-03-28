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