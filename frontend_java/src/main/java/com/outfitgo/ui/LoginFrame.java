package com.outfitgo.ui;

import com.outfitgo.utils.DatabaseConnection;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class LoginFrame extends JFrame {
    private JTextField emailField;
    private JPasswordField passwordField;

    public LoginFrame() {
        setTitle("OutfitGo - Login");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
        
        // Dark Theme
        getContentPane().setBackground(new Color(30, 30, 30));
        setLayout(null);

        JLabel titleLabel = new JLabel("Login");
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        titleLabel.setBounds(160, 20, 100, 30);
        add(titleLabel);

        JLabel emailLabel = new JLabel("Email:");
        emailLabel.setForeground(Color.LIGHT_GRAY);
        emailLabel.setBounds(50, 80, 80, 25);
        add(emailLabel);

        emailField = new JTextField();
        emailField.setBounds(140, 80, 200, 25);
        add(emailField);

        JLabel passLabel = new JLabel("Password:");
        passLabel.setForeground(Color.LIGHT_GRAY);
        passLabel.setBounds(50, 120, 80, 25);
        add(passLabel);

        passwordField = new JPasswordField();
        passwordField.setBounds(140, 120, 200, 25);
        add(passwordField);

        JButton loginButton = new JButton("Login");
        loginButton.setBackground(new Color(123, 97, 255));
        loginButton.setForeground(Color.WHITE);
        loginButton.setFocusPainted(false);
        loginButton.setBounds(140, 170, 100, 35);
        add(loginButton);

        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String email = emailField.getText();
                String password = new String(passwordField.getPassword());
                if (authenticate(email, password)) {
                    JOptionPane.showMessageDialog(null, "Login Successful!");
                    dispose(); // Close login
                    new Dashboard(1).setVisible(true); // Open Dashboard (Hardcoded userId 1 for now)
                } else {
                    JOptionPane.showMessageDialog(null, "Invalid Credentials");
                }
            }
        });
    }

    private boolean authenticate(String email, String password) {
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
