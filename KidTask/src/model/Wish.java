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
    
    
    
    
    public String getName() { return name; }
    public int getCost() { return cost; }
    public String getOwner() { return owner; }
    public WishStatus getStatus() { return status; }
    public int getRequiredLevel() { return requiredLevel; }
    
    public void setStatus(WishStatus status) { this.status = status; }
}
