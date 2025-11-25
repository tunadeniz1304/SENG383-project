package model;

public class Wish {
    private String name;
    private int cost;
    private String owner;
    private WishStatus status;
    private int requiredLevel;

    public Wish(String name, int cost, String owner, int requiredLevel) {
        this.name = name;
        this.cost = cost;
        this.owner = owner;
        this.status = WishStatus.PENDING;
        this.requiredLevel = requiredLevel;
    }
    
    public String toCSV() {
        return name + "," + cost + "," + owner + "," + status + "," + requiredLevel;
    }
    
    public static Wish fromCSV(String line) {
        String[] parts = line.split(",");
        if (parts.length < 5) return null;
        
        Wish w = new Wish(parts[0], Integer.parseInt(parts[1]), parts[2], Integer.parseInt(parts[4]));
        w.status = WishStatus.valueOf(parts[3]);
        return w;
    }
    
    
    public String getName() { return name; }
    public int getCost() { return cost; }
    public String getOwner() { return owner; }
    public WishStatus getStatus() { return status; }
    public int getRequiredLevel() { return requiredLevel; }
    
    public void setStatus(WishStatus status) { this.status = status; }
}
