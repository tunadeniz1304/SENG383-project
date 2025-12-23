package model;

public class User {
	private String username;
    private String password;
    private UserRole role;
    private int totalPoints;
    
    public User(String username, String password, UserRole role, int totalPoints) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.totalPoints = totalPoints;
    }
    
    public String toCSV() {
        return username + "," + password + "," + role + "," + totalPoints;
    }
    
    public static User fromCSV(String line) {
        String[] parts = line.split(",");
        if (parts.length < 4) return null;
        return new User(parts[0], parts[1], UserRole.valueOf(parts[2]), Integer.parseInt(parts[3]));
    }
    
    
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public UserRole getRole() { return role; }
    public int getTotalPoints() { return totalPoints; }
    public void addPoints(int points) { this.totalPoints += points; }
    public void setTotalPoints(int points) { this.totalPoints = points; } 
}
