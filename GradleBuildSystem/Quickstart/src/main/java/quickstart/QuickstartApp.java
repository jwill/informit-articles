package quickstart;

import javax.swing.*;

public class QuickstartApp extends JFrame {
  public QuickstartApp() {
    super("Gradle demo");

    this.getContentPane().add(new JLabel("Hello from Gradle."));

    this.setSize(400,150);
    this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    this.setVisible(true);
  }

  public static void main(String [] args) {
    new QuickstartApp();
  }
}
