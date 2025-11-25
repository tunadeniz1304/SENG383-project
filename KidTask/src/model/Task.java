package model;
import java.time.LocalDate;

public class Task {
	private String id;
	private String title;
	private String description;
    private int points;
    private TaskStatus status;
    private TaskType type;
    private String assignedTo;
    private LocalDate dueDate;
    private int rating;
    
    public Task(String id, String title, int points, TaskType type, String assignedTo,int rating) {
        this.id = id;
        this.title = title;
        this.points = points;
        this.type = type;
        this.assignedTo = assignedTo;
        this.status = TaskStatus.PENDING;
        this.dueDate = LocalDate.now();
        this.rating = rating;
    }





    public String getId() { return id; }
    public String getTitle() { return title; }
    public int getPoints() { return points; }
    public TaskStatus getStatus() { return status; }
    public TaskType getType() { return type; }
    public String getAssignedTo() { return assignedTo; }
    public int getRating() { return rating; }
    
    public void setStatus(TaskStatus status) { this.status = status; }
    public void setRating(int rating) { this.rating = rating; }
}
