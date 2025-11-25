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
}
