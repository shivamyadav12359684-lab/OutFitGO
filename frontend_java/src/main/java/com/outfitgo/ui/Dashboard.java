package com.outfitgo.ui;

import com.outfitgo.utils.APIClient;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Dashboard extends JFrame {
    private int userId;
    private JPanel mainContentPanel;

    public Dashboard(int userId) {
        this.userId = userId;
        setTitle("OutfitGo - Dashboard");
        setSize(1000, 700);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // --- Sidebar ---
        JPanel sidebar = new JPanel();
        sidebar.setBackground(new Color(40, 40, 40));
        sidebar.setPreferredSize(new Dimension(200, 700));
        sidebar.setLayout(new GridLayout(6, 1, 0, 10));
        
        JButton navHome = createNavButton("Home");
        JButton navWardrobe = createNavButton("My Wardrobe");
        JButton navOutfits = createNavButton("Outfits");
        JButton navExplore = createNavButton("Explore");
        
        sidebar.add(navHome);
        sidebar.add(navWardrobe);
        sidebar.add(navOutfits);
        sidebar.add(navExplore);
        
        add(sidebar, BorderLayout.WEST);

        // --- Main Content ---
        mainContentPanel = new JPanel();
        mainContentPanel.setBackground(new Color(30, 30, 30));
        mainContentPanel.setLayout(new BorderLayout());
        
        // Header
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(30, 30, 30));
        header.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        JLabel welcomeLabel = new JLabel("Welcome back!");
        welcomeLabel.setForeground(Color.WHITE);
        welcomeLabel.setFont(new Font("SansSerif", Font.BOLD, 28));
        header.add(welcomeLabel, BorderLayout.NORTH);
        
        JLabel subtitle = new JLabel("Here are your outfits for today.");
        subtitle.setForeground(Color.GRAY);
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 14));
        header.add(subtitle, BorderLayout.SOUTH);
        
        mainContentPanel.add(header, BorderLayout.NORTH);

        // Content Area (Grid for Recommendations)
        JPanel contentGrid = new JPanel(new GridLayout(1, 2, 20, 0)); // 2 columns
        contentGrid.setBackground(new Color(30, 30, 30));
        contentGrid.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        // --- Widget 1: Weather (Placeholder) ---
        JPanel weatherCard = createCard("Weather Analysis");
        JLabel weatherText = new JLabel("<html>Loading weather...<br/><br/>Fetching data from Flask...</html>");
        weatherText.setForeground(Color.LIGHT_GRAY);
        weatherText.setHorizontalAlignment(SwingConstants.CENTER);
        weatherCard.add(weatherText, BorderLayout.CENTER);
        contentGrid.add(weatherCard);
        
        // --- Widget 2: Recommendation ---
        JPanel recCard = createCard("Today's Look");
        JLabel recText = new JLabel("<html>Analyzing wardrobe...</html>");
        recText.setForeground(Color.LIGHT_GRAY);
        recText.setHorizontalAlignment(SwingConstants.CENTER);
        recCard.add(recText, BorderLayout.CENTER);
        contentGrid.add(recCard);
        
        mainContentPanel.add(contentGrid, BorderLayout.CENTER);
        add(mainContentPanel, BorderLayout.CENTER);

        // --- Trigger API Call ---
        loadData(weatherText, recText);
    }

    private void loadData(JLabel weatherLabel, JLabel recLabel) {
        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() {
                return APIClient.getRecommendations(userId, "New York");
            }

            @Override
            protected void done() {
                try {
                    String json = get();
                    if (json != null) {
                        // Simple String parsing to avoid external JSON library dependency
                        String temp = extractJsonValue(json, "temp");
                        String condition = extractJsonValue(json, "condition");
                        
                        weatherLabel.setText("<html><center><font size='5'>" + temp + "°C</font><br/>" + condition + "</center></html>");
                        recLabel.setText("<html><center>Outfit recommendations<br/>updated based on <b>" + condition + "</b> weather.</center></html>");
                    } else {
                        weatherLabel.setText("Failed to connect.");
                        recLabel.setText("Backend offline.");
                    }
                } catch (Exception e) {
                   e.printStackTrace();
                }
            }
        };
        worker.execute();
    }
    
    // Helper to extract value from simple JSON string
    private String extractJsonValue(String json, String key) {
        try {
            String search = "\"" + key + "\":";
            int start = json.indexOf(search);
            if (start == -1) return "N/A";
            start += search.length();
            
            // Handle if value is string or number
            boolean isString = json.charAt(json.indexOf(":", start - search.length()) + 1) == '"' || json.trim().charAt(start) == '"';
            if (json.charAt(start) == ' ') start++; // skip space
            if (json.charAt(start) == '"') start++;
            
            int end;
            if (isString) {
                end = json.indexOf("\"", start);
            } else {
                 end = json.indexOf(",", start);
                 if (end == -1) end = json.indexOf("}", start);
            }
            return json.substring(start, end);
        } catch (Exception e) {
            return "Error";
        }
    }

    private JButton createNavButton(String text) {
        JButton btn = new JButton(text);
        btn.setBackground(new Color(40, 40, 40));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setFont(new Font("SansSerif", Font.PLAIN, 16));
        return btn;
    }

    private JPanel createCard(String title) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(new Color(50, 50, 50));
        card.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JLabel titleLabel = new JLabel(title);
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 18));
        titleLabel.setBorder(new EmptyBorder(0, 0, 10, 0));
        
        card.add(titleLabel, BorderLayout.NORTH);
        return card;
    }
}
