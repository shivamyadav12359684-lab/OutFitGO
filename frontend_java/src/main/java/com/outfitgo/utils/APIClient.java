package com.outfitgo.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class APIClient {
    private static final String BASE_URL = "http://localhost:5000/api";

    public static String getRecommendations(int userId, String city) {
        try {
            String urlString = BASE_URL + "/recommend?user_id=" + userId + "&city=" + city;
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                return null; // Error
            }

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            StringBuilder sb = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }
            conn.disconnect();
            return sb.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
